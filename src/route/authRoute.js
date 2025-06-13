// Import the express module and create a router instance
import express from 'express';
const router = express.Router();

// Import controller functions
import { handleChangePassword, handleLogin, handleRegister, handleVerifyEmail, handleVerifyOtp } from '../controllers/authController.js'
import { otpLimiter } from '../middleware/otpLimiter.js';

// Auth routes for user registration and login
router.post('/register',handleRegister);
router.post('/login',handleLogin);
router.post('/verifyEmail', otpLimiter, handleVerifyEmail);
router.post('/verifyOtp',handleVerifyOtp);
router.post('/changePassword',handleChangePassword);

export default router;