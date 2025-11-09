// src/app.js
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js'; // NUEVO
import conversationRoutes from './routes/conversations.routes.js'; // NUEVO
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas (Endpoints) - ORGANIZADAS POR CATEGORÍA
app.use('/api/auth', authRoutes);        // Solo rutas de autenticación
app.use('/api/products', productRoutes); // Solo rutas de productos  
app.use('/api/chat', conversationRoutes); // Solo rutas de conversaciones

// Exporta la aplicación para ser utilizada por server.js
export default app;