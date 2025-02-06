import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "../services/auth";


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop()?.trim(); // Ensure `pop()` doesn’t fail
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decodedUser = authenticateToken(token);
    if (!decodedUser) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    (req as any).user = decodedUser; // Attach authenticated user to `req`
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
  }
};

