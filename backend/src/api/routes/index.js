import express from 'express';
import { Router } from 'express';
import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import businessRoutes from './business.route.js';
import serviceRoutes from './service.route.js';
import categoryRoutes from './category.route.js';

const router = Router();

router.use('/auth', authRoutes);

router.use('/users', userRoutes);

router.use('/businesses', businessRoutes);

router.use('/services', serviceRoutes);

router.use('/categories', categoryRoutes);

export default router;
