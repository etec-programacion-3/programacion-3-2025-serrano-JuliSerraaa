// src/models/message.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';
import User from './user.js';
import Conversation from './conversation.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, // Usamos TEXT para mensajes más largos
    allowNull: false,
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Conversation,
      key: 'id',
    },
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  // Opcional: para marcar si el mensaje fue leído
  // read: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false,
  // }
}, {
  tableName: 'messages',
  timestamps: true
});

// --- ASOCIACIONES ---

// El mensaje pertenece a un remitente (Usuario)
Message.belongsTo(User, { foreignKey: 'senderId', as: 'Sender' });

// El mensaje pertenece a una conversación
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });

// Una conversación PUEDE TENER muchos mensajes
Conversation.hasMany(Message, { foreignKey: 'conversationId' });

export default Message;