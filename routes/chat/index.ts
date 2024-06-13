import express from 'express';
import { authenticate } from '../../middlewares/auth';
import { fetchOneToOneChats, fetchConversation } from '../../controllers/chat';

const router = express.Router();

router.get('/one-to-one', authenticate, fetchOneToOneChats);
router.get('/conversation', authenticate, fetchConversation);

export default router;
