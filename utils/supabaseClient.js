import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // Load .env file

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin actions
);

export default supabase;
