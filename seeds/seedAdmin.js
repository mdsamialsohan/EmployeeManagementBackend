// seedAdmin.js
import supabase from "../utils/supabaseClient.js";

const seedAdmin = async () => {
  const email = "admin@abc.com";
  const password = "1234";

  // 1. Create the user in Auth
  const { data: userData, error: signUpError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (signUpError) {
    console.error("❌ Error creating admin user:", signUpError.message);
    return;
  }

  const userId = userData.user.id;

  // 2. Insert profile info
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: userId,
      name: "Admin User",
      role: "admin",
      dob: "1990-01-01",
      profile_image: "",
      employee_id: "EMP-0001",
      gender: "Other",
      department: "Admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  if (profileError) {
    console.error("❌ Error creating admin profile:", profileError.message);
  } else {
    console.log("✅ Admin user and profile created successfully");
  }
};

seedAdmin();
