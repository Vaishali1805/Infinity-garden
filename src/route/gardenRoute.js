// Import the express module and create a router instance
import express from 'express';
const router = express.Router();

// Import controller functions
import { handleGardenList } from '../controllers/gardenController.js';

router.get('/list',handleGardenList);

export default router;