// src/config/config.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path'; 
// AÑADIR esta importación:
import { fileURLToPath } from 'url'; // <--- NUEVA IMPORTACIÓN

dotenv.config();

// Obtenemos el directorio actual (import.meta.url es la forma ES Modules de obtenerlo)
// REEMPLAZAR la línea:
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// POR estas dos líneas:
const __filename = fileURLToPath(import.meta.url); // Convierte la URL a una ruta de archivo
const __dirname = path.dirname(__filename); // Obtiene el directorio de la ruta del archivo

const DB_DIALECT = process.env.DB_DIALECT || 'sqlite'; 
const DB_STORAGE_RELATIVE = process.env.DB_STORAGE || 'data/database.sqlite';

// ... (El resto del archivo se mantiene igual)

// Construimos la ruta ABSOLUTA para el archivo de almacenamiento. 
const DB_STORAGE_ABSOLUTE = path.resolve(__dirname, '..', '..', DB_STORAGE_RELATIVE);
// ...

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