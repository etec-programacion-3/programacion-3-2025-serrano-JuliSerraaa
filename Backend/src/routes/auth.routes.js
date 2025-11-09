// src/routes/auth.routes.js
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// =========================================================
// RUTAS DE REGISTRO Y LOGIN (SOLO AUTENTICACIÓN)
// =========================================================

// Endpoint: POST /api/auth/register
router.post('/register', register);

// Endpoint: POST /api/auth/login  
router.post('/login', login);

// Puedes agregar más rutas de autenticación aquí en el futuro
// Ej: cambiar contraseña, recuperar cuenta, etc.

export default router;