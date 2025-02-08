import express from 'express';
import { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateToken } from '../../services/auth.js';
import { createUser, getSingleUser, newReport, deleteReport, login } from '../../controllers/user-controller.js';

const router = express.Router();

// ✅ Public Routes (No Authentication Required)
router.post('/register', createUser);
router.post('/login', login);

// ✅ Protected Routes (Require Authentication)
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  // Explicitly cast `req` to `AuthenticatedRequest`
  const authReq = req as AuthenticatedRequest;
  return getSingleUser(authReq, res);
});

router.put('/report', authenticateToken, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  return newReport(authReq, res);
});

router.delete('/reports/:reportId', authenticateToken, async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  return deleteReport(authReq, res);
});

export default router;
