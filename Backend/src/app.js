// src/app.js
import express from 'express';
import Routes from './routes/auth.routes.js'; 

const app = express();

// Middleware
app.use(express.json());

// Rutas (Endpoints)
// Conecta las rutas de autenticación bajo el prefijo /api/auth
app.use('/api/auth', Routes);

// Conecta las rutas de productos bajo el prefijo /api
// Esto creará rutas como /api/product y /api/products
app.use('/api', Routes); // <--- CORRECCIÓN

// Exporta la aplicación para ser utilizada por server.js
export default app;