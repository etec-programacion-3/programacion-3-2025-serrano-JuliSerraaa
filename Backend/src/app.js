// src/app.js
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
import conversationRoutes from './routes/conversations.routes.js';
import purchaseRoutes from './routes/purchase.routes.js'; // NUEVO
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas (Endpoints) - ORGANIZADAS POR CATEGORÍA
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chat', conversationRoutes);
app.use('/api/purchases', purchaseRoutes); // NUEVA RUTA

// Exporta la aplicación para ser utilizada por server.js
export default app;