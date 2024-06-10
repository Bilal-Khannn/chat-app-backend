import express from 'express';
import { signup } from '../controllers/authController';
// import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signup);

export default router;
