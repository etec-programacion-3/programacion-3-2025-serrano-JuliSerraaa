// src/routes/auth.routes.js

import { Router } from 'express';
// Importa las funciones específicas del controller
import { register, login } from '../controllers/auth.controller.js';
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.middleware.js';

// --- AÑADIR ESTA LÍNEA ---
import { 
  createConversation, 
  getUserConversations, 
  sendMessage, 
  getConversationMessages 
} from '../controllers/conversation.controller.js';
// -----------------------------

const router = Router();

// =========================================================
// RUTAS DE REGISTRO Y LOGIN
// =========================================================

// Endpoint: POST /register
router.post('/register', register);

// Endpoint: POST /login
router.post('/login', login);

// =========================================================
// RUTAS DE PRODUCTOS
// =========================================================
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/product', protect, addProduct);
router.put('/products/:id', protect, updateProduct);
router.delete('/products/:id', protect, deleteProduct);

// =========================================================
// RUTAS DE CONVERSACIONES Y MENSAJES (NUEVAS)
// =========================================================

// POST /api/auth/conversations (Crear o encontrar conversación)
router.post('/conversations', protect, createConversation);

// GET /api/auth/conversations (Obtener mis conversaciones)
router.get('/conversations', protect, getUserConversations);

// POST /api/auth/conversations/:id/messages (Enviar mensaje a una conversación)
router.post('/conversations/:id/messages', protect, sendMessage);

// GET /api/auth/conversations/:id/messages (Obtener mensajes de una conversación)
router.get('/conversations/:id/messages', protect, getConversationMessages);
// ---------------------------------------------------------

export default router;