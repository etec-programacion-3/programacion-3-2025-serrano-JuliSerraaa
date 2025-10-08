// src/routes/auth.routes.js

import { Router } from 'express';
// Importa las funciones específicas del controller
import { register, login } from '../controllers/auth.controller.js'; 

const router = Router();

// Endpoint: POST /api/auth/register
router.post('/register', register);

// Endpoint: POST /api/auth/login
router.post('/login', login);

export default router;