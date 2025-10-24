// server.js (Confirmación del orden correcto)

import app from './src/app.js';
import { connectDB } from './src/config/config.js'; // Función que intenta conectar
import User from './src/models/user.js'; // Modelo de usuario
import Product from './src/models/products.js'; //Modelo de productos
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

// Sincronizar modelos con la base de datos
async function syncDatabase() {
  try {
    // Si el archivo SQLite NO existe, esta línea lo CREA antes de crear la tabla 'users'.
    await User.sync({ alter: true });
    await Product.sync({alter: true});
    console.log('Modelos sincronizados con la base de datos (Tablas creadas/actualizadas).');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error.message);
  }
}

// Iniciar el servidor
async function startServer() {

  // 1. Probar la conexión
  await connectDB(); 
  
  // 2. Sincronizar (Crea la DB y las tablas si no existen)
  await await syncDatabase(); 

  app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  });
}

startServer();