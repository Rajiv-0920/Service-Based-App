import express from 'express';
import * as controller from '../controllers/service.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isBusiness } from '../middleware/business.middleware.js';

const router = express.Router();

router.get('/', controller.getAllServices);

router.get('/:id', controller.getServiceById);

router.post('/', authenticate, isBusiness, controller.createService);

router.put('/:id', controller.updateService);

router.delete('/:id', controller.deleteService);

export default router;
