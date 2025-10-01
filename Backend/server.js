// server.js
import app from './src/app.js';
import { connectDB } from './src/config/config.js'; // Importa la función para probar la conexión
import User from './src/models/user.js'; // Importa el modelo
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

// Sincronizar modelos con la base de datos
async function syncDatabase() {
  try {
    // Usamos { force: false } para no borrar la tabla si ya existe.
    // Cambia a { force: true } solo si estás en desarrollo y quieres recrear las tablas.
    await User.sync({ force: false });
    console.log('Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error.message);
  }
}

// Iniciar el servidor
async function startServer() {
  await connectDB();
  await syncDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  });
}

startServer();