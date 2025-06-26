import supabase from "../utils/supabaseClient.js"; // or wherever you put it

// ✅ Signup
export const signup = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error)
    return res.status(400).json({ success: false, error: error.message });

  return res.status(200).json({ success: true, user: data.user });
};

// ✅ Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    return res.status(401).json({ success: false, error: error.message });

  return res
    .status(200)
    .json({ success: true, session: data.session, user: data.user });
};

// ✅ Logout
export const logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error)
    return res.status(400).json({ success: false, error: error.message });
  return res
    .status(200)
    .json({ success: true, message: "Logged out Successfully" });
};
