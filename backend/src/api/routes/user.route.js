import express from 'express';
import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/profile', authenticate, controller.getUserProfile);

router.put('/profile', authenticate, controller.updateUserProfile);

export default router;
