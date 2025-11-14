// src/controllers/purchase.controller.js
import Purchase from '../models/purchase.js';
import Product from '../models/products.js';
import Conversation from '../models/conversation.js';
import Message from '../models/message.js';
import { Op } from 'sequelize';

/**
 * CREAR COMPRA SIMPLIFICADA
 */
export const createPurchase = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { productId } = req.body;

    console.log('Iniciando compra - Buyer:', buyerId, 'Product:', productId);

    // 1. Validar producto
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // 2. Verificar que no sea el propio producto
    if (product.userId === buyerId) {
      return res.status(400).json({ message: 'No puedes comprar tu propio producto' });
    }

    // 3. Crear registro de compra
    const purchase = await Purchase.create({
      buyerId,
      productId,
      sellerId: product.userId,
      amount: product.price,
      status: 'completed'
    });

    console.log('Compra creada:', purchase.id);

    // 4. Buscar o crear conversación
    let conversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { [Op.and]: [{ user1Id: buyerId }, { user2Id: product.userId }] },
          { [Op.and]: [{ user1Id: product.userId }, { user2Id: buyerId }] }
        ]
      }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        user1Id: buyerId,
        user2Id: product.userId
      });
      console.log('Conversación creada:', conversation.id);
    } else {
      console.log('Conversación existente:', conversation.id);
    }

    // 5. Enviar mensaje automático de compra
    await Message.create({
      conversationId: conversation.id,
      senderId: buyerId,
      content: `¡Hola! Acabo de comprar tu producto "${product.productName}" por $${product.price}. ¿Podemos coordinar la entrega?`
    });

    console.log('Mensaje automático enviado');

    // 6. Respuesta exitosa
    res.status(201).json({
      message: 'Compra realizada exitosamente',
      purchase: {
        id: purchase.id,
        product: product.productName,
        amount: product.price,
        sellerId: product.userId
      },
      conversation: {
        id: conversation.id
      }
    });

  } catch (error) {
    console.error('Error en compra:', error);
    res.status(500).json({ message: 'Error al procesar la compra' });
  }
};

/**
 * OBTENER COMPRAS DEL USUARIO
 */
export const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await Purchase.findAll({
      where: { 
        [Op.or]: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: [
        { model: Product, attributes: ['productName', 'productType'] },
        { model: User, as: 'Buyer', attributes: ['username'] },
        { model: User, as: 'Seller', attributes: ['username'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error al obtener compras:', error);
    res.status(500).json({ message: 'Error al obtener el historial de compras' });
  }
};