import express from 'express';
import { signup, signin, editProfile } from '../../controllers/auth';
import { authenticate } from '../../middlewares/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh-token', authenticate, editProfile);

export default router;
