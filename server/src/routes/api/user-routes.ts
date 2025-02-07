import express from 'express';
const router= express.Router();
import {
    createUser,
    getSingleUser,
    newReport,
    deleteReport,
    login,
} from '../../controllers/user-controller.js';

//import middleware
import {authenticateToken} from '../../services/auth';

//put authMiddleware anywhere we need to send a token for verification of user
router.route('/').post(createUser).put(authenticateToken, newReport);
router.route('/login').post(login);
router.route('/me').get(authenticateToken, getSingleUser);
router.route('/reports/:reportId').delete(authenticateToken, deleteReport);

export default router;