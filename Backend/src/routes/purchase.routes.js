// src/routes/purchase.routes.js
import { Router } from 'express';
import { createPurchase, getUserPurchases } from '../controllers/purchase.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, createPurchase);
router.get('/', protect, getUserPurchases);

export default router;