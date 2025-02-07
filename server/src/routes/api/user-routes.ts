// import express from 'express';
// const router= express.Router();
// import {
//     createUser,
//     getSingleUser,
//     newMission,
//     deleteMission,
//     login,
// } from '../../controllers/user-controller.js';

//import middleware
import {authenticateToken} from '../../services/auth.js';

// //put authMiddleware anywhere we need to send a token for verification of user
// router.route('/').post(createUser).put(authenticateToken, newMission);
// router.route('/login').post(login);
// router.route('/me').get(authenticateToken, getSingleUser);
// router.route('/missions/:missionId').delete(authenticateToken, deleteMission);

// export default router;

import { Router } from "express";
// import bcrypt from "bcrypt";
import User, { UserRole } from "../../models/User.js"; // Import User model
//import jwt from "jsonwebtoken"; // For authentication (Optional)
import { authMiddleware } from "../../middleware/auth.js"; // Custom auth middleware (if using JWT)

const router = Router();

// 📌 REGISTER a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, unit } = req.body;

    // Ensure required fields are present
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Prevent non-EVALUATOR users from registering without a unit
    if (role === UserRole.USER && !unit) {
      return res.status(400).json({ message: "Unit is required for USER role." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Create new user
    const newUser = await User.create({ username, email, password, role, unit });

    return res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// 📌 LOGIN a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate password
    const validPassword = await user.isCorrectPassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token (Optional)
    // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
    //   expiresIn: "1h",
    // });

    const token= authenticateToken;

    return res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// 📌 GET all users (Protected route - Admin only)
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const users = await User.find().populate("unit"); // Populate Unit details
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 GET a single user by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("unit");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// 📌 UPDATE a user by ID
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { username, email, role, unit } = req.body;

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role, unit },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// 📌 DELETE a user by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" }); // ✅ Ensures a return
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" }); // ✅ Ensures a return
  }
});


export default router;
