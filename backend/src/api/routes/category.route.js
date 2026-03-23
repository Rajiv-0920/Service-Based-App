import express from 'express';
import * as controller from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', controller.getCategories);

router.get('/:id/services', controller.getServicesByCategory);

router.post('/', controller.createCategory);

router.put('/:id', controller.updateCategory);

router.delete('/:id', controller.deleteCategory);

export default router;
