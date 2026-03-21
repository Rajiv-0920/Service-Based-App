import express from 'express';
import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/register/user', controller.registerUser);

router.post('/register/business', authenticate, controller.registerBusiness);

router.post('/login', controller.login);

router.post('/logout', authenticate, controller.logout);

router.get('/me', authenticate, controller.getMe);

export default router;
