// src/routes/products.routes.js
import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// =========================================================
// RUTAS DE PRODUCTOS
// =========================================================

// GET /api/products (Obtener todos los productos)
router.get('/', getProducts);

// GET /api/products/:id (Obtener un producto por ID)
router.get('/:id', getProductById);

// POST /api/products (Crear nuevo producto - requiere autenticación)
router.post('/', protect, addProduct);

// PUT /api/products/:id (Actualizar producto - requiere autenticación)
router.put('/:id', protect, updateProduct);

// DELETE /api/products/:id (Eliminar producto - requiere autenticación)  
router.delete('/:id', protect, deleteProduct);

export default router;