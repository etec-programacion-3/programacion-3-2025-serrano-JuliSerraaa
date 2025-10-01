// src/models/user.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js'; // Importa la instancia de conexión

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Si planeas usar un carrito, podrías usar un campo JSONB (solo en Postgres)
  // cart: {
  //   type: DataTypes.JSONB,
  //   defaultValue: [],
  // }
}, {
  // Opciones del modelo
  tableName: 'users',
  timestamps: true,
  // Índices para mejorar la búsqueda
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});

// Exporta el modelo
export default User;