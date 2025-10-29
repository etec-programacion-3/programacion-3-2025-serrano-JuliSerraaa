// src/controllers/conversation.controller.js

import { Op } from 'sequelize'; // Importa el Operador 'Or'
import Conversation from '../models/conversation.js';
import Message from '../models/message.js';
import User from '../models/user.js'; // Necesario para incluir datos del usuario

// --- 1. CREAR O ENCONTRAR UNA CONVERSACIÓN (POST /conversations) ---
export const createConversation = async (req, res) => {
  const senderId = req.user.id; // Mi ID (del token)
  const { receiverId } = req.body; // ID del otro usuario (del body)

  // Validar que el receiverId existe
  if (!receiverId || receiverId === senderId) {
    return res.status(400).json({ message: 'Se requiere un ID de receptor válido.' });
  }

  try {
    // 1. Buscar si ya existe una conversación (A->B o B->A)
    // Usamos Op.or para buscar ambas combinaciones
    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { [Op.and]: [{ user1Id: senderId }, { user2Id: receiverId }] },
          { [Op.and]: [{ user1Id: receiverId }, { user2Id: senderId }] }
        ]
      }
    });

    // 2. Si no existe, la creamos
    if (!conversation) {
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: receiverId
      });
    }

    // 3. Devolvemos la conversación (ya sea encontrada o creada)
    res.status(200).json(conversation);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar la conversación.' });
  }
};


// --- 2. OBTENER CONVERSACIONES DEL USUARIO (GET /conversations) ---
export const getUserConversations = async (req, res) => {
  const userId = req.user.id; // Mi ID

  try {
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      // Incluimos los datos de los usuarios participantes (excepto sus contraseñas)
      include: [
        { model: User, as: 'User1', attributes: ['id', 'username', 'email'] },
        { model: User, as: 'User2', attributes: ['id', 'username', 'email'] }
      ],
      order: [['updatedAt', 'DESC']] // Opcional: más recientes primero
    });

    res.status(200).json(conversations);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las conversaciones.' });
  }
};


// --- 3. ENVIAR UN MENSAJE (POST /conversations/:id/messages) ---
export const sendMessage = async (req, res) => {
  const senderId = req.user.id; // Mi ID
  const { id: conversationId } = req.params; // ID de la conversación (de la URL)
  const { content } = req.body; // Contenido del mensaje

  if (!content) {
    return res.status(400).json({ message: 'El contenido no puede estar vacío.' });
  }

  try {
    // 1. (Seguridad) Verificar que la conversación existe y que yo soy parte de ella
    const conversation = await Conversation.findByPk(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada.' });
    }

    if (conversation.user1Id !== senderId && conversation.user2Id !== senderId) {
      return res.status(403).json({ message: 'Acción no permitida. No eres parte de esta conversación.' });
    }

    // 2. Crear el mensaje
    const newMessage = await Message.create({
      conversationId: conversationId,
      senderId: senderId,
      content: content
    });
    
    // Opcional: Actualizar el timestamp de la conversación para que aparezca primero
    await conversation.save();

    res.status(201).json(newMessage);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar el mensaje.' });
  }
};


// --- 4. OBTENER MENSAJES DE UNA CONVERSACIÓN (GET /conversations/:id/messages) ---
export const getConversationMessages = async (req, res) => {
  const userId = req.user.id; // Mi ID
  const { id: conversationId } = req.params; // ID de la conversación (de la URL)

  try {
    // 1. (Seguridad) Verificar que soy parte de esta conversación para poder leerla
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada.' });
    }
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      return res.status(403).json({ message: 'Acción no permitida. No puedes leer esta conversación.' });
    }

    // 2. Obtener todos los mensajes de esa conversación
    const messages = await Message.findAll({
      where: { conversationId: conversationId },
      include: [
        // Incluimos datos del remitente
        { model: User, as: 'Sender', attributes: ['id', 'username'] } 
      ],
      order: [['createdAt', 'ASC']] // Más antiguos primero (orden cronológico)
    });

    res.status(200).json(messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los mensajes.' });
  }
};