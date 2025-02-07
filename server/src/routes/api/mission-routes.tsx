import { Router, Request, Response } from "express";
import User, { UserRole } from "../../models/User.js"; // Import User model
import { authMiddleware } from "../../middleware/auth.js"; // Authentication middleware
import jwt from "jsonwebtoken"; // JWT for authentication

const router = Router();

// 📌 REGISTER a new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, unit } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (role === UserRole.USER && !unit) {
      return res.status(400).json({ message: "Unit is required for USER role." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const newUser = await User.create({ username, email, password, role, unit });

    return res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// 📌 LOGIN a user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const validPassword = await user.isCorrectPassword(password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Ensure `JWT_SECRET` is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// 📌 GET all users (Protected route - Admin only)
router.get("/", authMiddleware, async (_req: Request, res: Response) => {
  try {
    const users = await User.find().populate("unit");
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// 📌 GET a single user by ID
router.get("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate("unit");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

// 📌 UPDATE a user by ID
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { username, email, role, unit } = req.body;

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
    return res.status(500).json({ message: "Server error", error });
  }
});

// 📌 DELETE a user by ID
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});

export default router;