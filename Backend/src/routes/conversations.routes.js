// src/routes/conversations.routes.js
import { Router } from 'express';
import { 
  createConversation, 
  getUserConversations, 
  sendMessage, 
  getConversationMessages 
} from '../controllers/conversation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// =========================================================
// RUTAS DE CONVERSACIONES Y MENSAJES
// =========================================================

// POST /api/chat/conversations (Crear o encontrar conversación)
router.post('/conversations', protect, createConversation);

// GET /api/chat/conversations (Obtener mis conversaciones)
router.get('/conversations', protect, getUserConversations);

// POST /api/chat/conversations/:id/messages (Enviar mensaje a una conversación)
router.post('/conversations/:id/messages', protect, sendMessage);

// GET /api/chat/conversations/:id/messages (Obtener mensajes de una conversación)
router.get('/conversations/:id/messages', protect, getConversationMessages);

export default router;