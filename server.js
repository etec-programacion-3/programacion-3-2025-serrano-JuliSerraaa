import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes'

const app = express();

// Middleware para habilitar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Importa las rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API escuchando en el puerto ${PORT}`);
});