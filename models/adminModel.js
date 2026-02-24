import bcrypt from "bcryptjs";
import supabase from "../config/supabase.js";

// CREATE ADMIN
export async function createAdmin({ name, email, password }) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from("admins")
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("CreateAdmin Error:", err.message);
    throw err;
  }
}

// FIND ADMIN BY EMAIL
export async function findAdminByEmail(email) {
  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data;
  } catch (err) {
    console.error("FindAdmin Error:", err.message);
    throw err;
  }
}

// MATCH PASSWORD
export async function matchPassword(enteredPassword, hashedPassword) {
  return bcrypt.compare(enteredPassword, hashedPassword);
}
