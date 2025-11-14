// server.js (Confirmación del orden correcto)

import app from './src/app.js';
import { connectDB } from './src/config/config.js';
import User from './src/models/user.js';
import Product from './src/models/products.js';
import Conversation from './src/models/conversation.js';
import Message from './src/models/message.js';
import Purchase from './src/models/purchase.js'; // NUEVO
// -----------------------------
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 3000;

// Sincronizar modelos con la base de datos
async function syncDatabase() {
  try {
    // Si el archivo SQLite NO existe, esta línea lo CREA antes de crear la tabla 'users'.
    await User.sync({ alter: true });
    await Product.sync({ alter: true });
    await Conversation.sync({ alter: true });
    await Message.sync({ alter: true });
    await Purchase.sync({ alter: true }); // NUEVO
    // -----------------------------
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
  await syncDatabase(); 

  app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
  });
}

startServer();