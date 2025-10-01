// src/app.js
import express from 'express';
import authRoutes from './routes/auth.routes.js'; // Importaremos este archivo en el siguiente paso

const app = express();

// Middleware
// 1. Permite a Express parsear JSON en el cuerpo de las peticiones
app.use(express.json());

// Rutas (Endpoints)
// Conecta las rutas de autenticación bajo el prefijo /api/auth
app.use('/api/auth', authRoutes);

// Exporta la aplicación para ser utilizada por server.js
export default app;