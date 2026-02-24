import jwt from "jsonwebtoken";
import {
  createAdmin,
  findAdminByEmail,
  matchPassword,
} from "../models/adminModel.js";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER ADMIN
export async function registerAdmin(req, res) {
  try {
    const { name, email, password } = req.body;

    const existing = await findAdminByEmail(email);

    if (existing) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const admin = await createAdmin({ name, email, password });

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      token: generateToken(admin.id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

// LOGIN ADMIN
export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isValid = await matchPassword(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      },
      token: generateToken(admin.id),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
