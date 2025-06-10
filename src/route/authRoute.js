// Import the express module and create a router instance
import express from 'express';
const router = express.Router();

// Import controller functions
import { handleLogin, handleRegister } from '../controllers/authController.js'

// Auth routes for user registration and login
router.post('/register',handleRegister);
router.post('/login',handleLogin);

export default router;