import express from 'express';
import { Router } from 'express';
import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import businessRoutes from './business.route.js';

const router = Router();

router.use('/auth', authRoutes);

router.use('/users', userRoutes);

router.use('/businesses', businessRoutes);

export default router;
