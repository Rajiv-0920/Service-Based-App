import express from 'express';
import * as controller from '../controllers/business.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isBusiness } from '../middleware/business.middleware.js';

const router = express.Router();

router.get('/profile', authenticate, controller.getBusinessProfile);

router.get('/:id', controller.getPublicBusinessProfile);

router.get('/:id/services', controller.getBusinessServices);

router.put(
  '/profile',
  authenticate,
  isBusiness,
  controller.updateBusinessProfile,
);

export default router;
