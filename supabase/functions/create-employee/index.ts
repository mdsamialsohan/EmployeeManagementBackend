import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // 🔁 Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*", // or "http://localhost:5173"
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    // 🔐 Get and verify token
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    console.log("Incoming token:", token);
    if (!token) {
      console.log("No token found");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 👑 Check admin role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: corsHeaders,
      });
    }

    // 📦 Parse incoming request data
    const body = await req.json();
    const { email, password, ...profileData } = body;

    // 🧑‍💼 Create Auth User
    const { data: newUser, error: userError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (userError || !newUser?.user) {
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 🗃️ Insert into `profiles` table
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: newUser.user.id,
        ...profileData,
      },
    ]);

    if (insertError) {
      await supabase.auth.admin.deleteUser(newUser.user.id);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Unexpected error: " + err.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});

// 🌍 Reusable CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or "http://localhost:5173"
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Content-Type": "application/json",
};
