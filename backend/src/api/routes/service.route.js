import express from 'express';
import * as controller from '../controllers/service.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isBusiness } from '../middleware/business.middleware.js';

const router = express.Router();

router.get('/', controller.getAllServices);

router.get('/cities', controller.getCities);

router.get('/:id', controller.getServiceById);

router.post('/', authenticate, isBusiness, controller.createService);

router.patch('/:id', authenticate, isBusiness, controller.updateService);

router.delete('/:id', authenticate, isBusiness, controller.deleteService);

router.patch('/:id', authenticate, isBusiness, controller.updateServiceListing);

export default router;
