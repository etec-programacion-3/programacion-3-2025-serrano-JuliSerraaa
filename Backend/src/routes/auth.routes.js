// src/routes/auth.routes.js

import { Router } from 'express';
// Importa las funciones específicas del controller
import { register, login } from '../controllers/auth.controller.js';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js'; // <--- 1. IMPORTA EL MIDDLEWARE

const router = Router();

// Endpoint: POST /register
router.post('/register', register);

// Endpoint: POST /login
router.post('/login', login);

// =========================================================
// RUTAS DE PRODUCTOS CORREGIDAS
// =========================================================

// Endpoint: GET /products (Leer todos - PÚBLICO)
router.get('/products', getProducts);

// Endpoint: GET /products/:id (Leer uno - PÚBLICO)
router.get('/products/:id', getProductById);


// --- RUTAS PROTEGIDAS ---

// Endpoint: POST /product (Crear uno - PROTEGIDO)
router.post('/product', protect, addProduct); // <--- 2. APLICA 'protect'

// Endpoint: PUT /products/:id (Actualizar uno - PROTEGIDO)
router.put('/products/:id', protect, updateProduct); // <--- 3. APLICA 'protect'

// Endpoint: DELETE /products/:id (Eliminar uno - PROTEGIDO)
router.delete('/products/:id', protect, deleteProduct); // <--- 4. APLICA 'protect'


export default router;