// src/models/products.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js'; // Importa la instancia de conexión
import User from './user.js'; // <--- 1. IMPORTA EL MODELO DE USUARIO

const Product = sequelize.define('Products', {
  productId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  // ... (productName, productType, price se mantienen igual)
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  productType: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true, // <-- RECOMENDACIÓN: Quita 'unique: true' de aquí. No quieres que solo pueda existir UN producto de tipo "Ropa".
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  
  // --- 2. AÑADIR ESTE CAMPO ---
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Referencia al modelo User
      key: 'id',   // Referencia a la columna 'id' de la tabla 'users'
    },
  },
  // ------------------------------

}, {
  tableName: 'Products',
  timestamps: true,
});

// --- 3. DEFINIR LA ASOCIACIÓN (Opcional pero recomendado) ---
// Un usuario puede tener muchos productos
User.hasMany(Product, { foreignKey: 'userId' });
// Un producto pertenece a un solo usuario
Product.belongsTo(User, { foreignKey: 'userId' });
// -----------------------------------------------------------

// Exporta el modelo
export default Product;