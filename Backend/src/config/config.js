// src/config/config.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path'; // <--- Importamos 'path'

dotenv.config();

// Obtenemos el directorio actual (import.meta.url es la forma ES Modules de obtenerlo)
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const DB_DIALECT = process.env.DB_DIALECT || 'sqlite'; 
const DB_STORAGE_RELATIVE = process.env.DB_STORAGE || 'data/database.sqlite';

// Construimos la ruta ABSOLUTA para el archivo de almacenamiento. 
// Esto es CRUCIAL para SQLite. Si el directorio 'data' no existe, Node lo creará.
const DB_STORAGE_ABSOLUTE = path.resolve(__dirname, '..', '..', DB_STORAGE_RELATIVE);


// Crea la instancia de Sequelize
const sequelize = new Sequelize({
  dialect: DB_DIALECT,
  storage: DB_STORAGE_ABSOLUTE, // Usamos la ruta absoluta
  logging: false, 
});

/**
 * Función para probar la conexión a la base de datos.
 */
export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(`Conexión a la base de datos SQLite establecida en ${DB_STORAGE_ABSOLUTE}.`);
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1); 
  }
}

// Exporta la instancia por defecto para ser usada en los modelos
export default sequelize;