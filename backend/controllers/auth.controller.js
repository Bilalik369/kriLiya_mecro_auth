import User from "../models/users.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !address) {
      return res.status(400).json({ msg: "Tous les champs sont obligatoires" });
    }

    const userExiste = await User.findOne({ email });
    if (userExiste) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: user.toPublicProfile(),
      token: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
