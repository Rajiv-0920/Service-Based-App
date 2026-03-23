import express from 'express';
import * as controller from '../controllers/business.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', authenticate, controller.getBusinessProfile);

router.get('/:id', controller.getPublicBusinessProfile);

export default router;
