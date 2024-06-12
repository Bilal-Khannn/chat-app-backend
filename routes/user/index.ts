import express from 'express';
import { authenticate } from '../../middlewares/auth';
import { getAllUsers } from '../../controllers/user';

const router = express.Router();

router.get('/allUsers', authenticate, getAllUsers);

export default router;
