// src/models/conversation.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';
import User from './user.js'; // Importa User para la asociación

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user1Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  user2Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  tableName: 'conversations',
  timestamps: true,
  indexes: [
    // Índice único compuesto para evitar conversaciones duplicadas (A-B y B-A)
    // Aunque lo manejaremos en la lógica, esto es una buena práctica de DB.
    {
      unique: true,
      fields: ['user1Id', 'user2Id']
    }
  ]
});

// --- ASOCIACIONES ---

// Una conversación pertenece a dos usuarios (con alias)
Conversation.belongsTo(User, { foreignKey: 'user1Id', as: 'User1' });
Conversation.belongsTo(User, { foreignKey: 'user2Id', as: 'User2' });

export default Conversation;