import express from 'express';
import { signup, signin, getUserInfo, signout } from '../../controllers/auth';
import { authenticate } from '../../middlewares/auth';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/verify-session', authenticate, getUserInfo);

export default router;
