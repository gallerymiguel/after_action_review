import express from 'express';
const router = express.Router();
import {
    createUser, // ✅ Register user via REST
    login,      // ✅ Login user via REST
    getSingleUser,  // ✅ Get user profile via REST (protected)
    newReport,      // 🛑 Only needed if reports are used
    deleteReport    // 🛑 Only needed if reports are used
} from '../../controllers/user-controller.js';

// ✅ Import authentication middleware
import { authenticateToken } from '../../services/auth.js';

// ✅ Registration & Login (Only for REST API)
router.post('/register', createUser); // Register
router.post('/login', login); // Login

// ✅ Authenticated Routes
router.get('/me', authenticateToken, getSingleUser); // Get user profile (protected)
router.put('/reports', authenticateToken, newReport); // Add Report (protected)
router.delete('/reports/:reportId', authenticateToken, deleteReport); // Delete Report (protected)

export default router;