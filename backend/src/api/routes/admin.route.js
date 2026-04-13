import express from 'express';
import * as controller from '../controllers/admin.controller.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users', authenticate, isAdmin, controller.getUsers);

router.get('/businesses', authenticate, isAdmin, controller.getBusinesses);

router.get('/services', authenticate, isAdmin, controller.getServices);

router.put(
  '/businesses/:id/approve',
  authenticate,
  isAdmin,
  controller.approveBusiness,
);

router.put(
  '/businesses/:id/suspend',
  authenticate,
  isAdmin,
  controller.suspendBusiness,
);

router.delete('/services/:id', authenticate, isAdmin, controller.deleteService);

router.delete('/users/:id', authenticate, isAdmin, controller.deleteUser);

export default router;
