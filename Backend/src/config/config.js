// src/config/config.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
// Nota: Cuando usas 'import', debes usar la extensión .js para importar archivos locales.
// Si dotenv.config() falla, revisa si estás en un entorno de desarrollo.
dotenv.config(); 

// Obtiene las variables de entorno
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_DIALECT = process.env.DB_DIALECT || 'postgres'; 

// Crea la instancia de Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false, 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

/**
 * Función para probar la conexión a la base de datos.
 */
export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    // Opcional: Terminar la aplicación si la conexión a la DB falla
    // process.exit(1); 
  }
}

// Exporta la instancia por defecto para ser usada en los modelos
export default sequelize;