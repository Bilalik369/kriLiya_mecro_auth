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


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ msg: "Account is deactivated" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
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


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: user.toPublicProfile(),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, profileImage } = req.body;

   
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address }; 
    if (profileImage) user.profileImage = profileImage;

    await user.save();

  
    return res.status(200).json({
      success: true,
      user: user.toPublicProfile ? user.toPublicProfile() : user, 
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not update profile.",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    
    const { page = 1, limit = 10, role, isActive } = req.query;

    const filter = {};

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const users = await User.find(filter)
      .limit(Number(limit)) 
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

  
    const count = await User.countDocuments(filter);

    
    return res.status(200).json({
      success: true,
      users: users.map((u) =>
        u.toPublicProfile ? u.toPublicProfile() : u
      ),
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalUsers: count,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Could not fetch users.",
    });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    
    const user = await User.findByIdAndDelete(userId);

    
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "User deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error while deleting user",
    });
  }
};