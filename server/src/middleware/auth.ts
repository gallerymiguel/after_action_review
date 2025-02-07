import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../services/auth.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop()?.trim(); // Ensure `pop()` doesn’t fail
    }

    if (!token) {
      res.status(401).json({ message: "Unauthorized - No token provided" });
      return; // ✅ Ensure function always returns a value
    }

    const decodedUser = authenticateToken(token);
    if (!decodedUser) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
      return; // ✅ Ensure function always returns a value
    }

    (req as any).user = decodedUser; // Attach authenticated user to `req`
    next(); // ✅ This ensures execution continues for authenticated users
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};

export default authMiddleware;