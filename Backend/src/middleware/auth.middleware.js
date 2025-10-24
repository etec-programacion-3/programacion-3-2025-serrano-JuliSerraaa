// src/middleware/auth.middleware.js

import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = async (req, res, next) => {
  let token;

  // 1. Verificar si el token viene en el header 'Authorization'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Extraer el token (formato: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token
      const decoded = jwt.verify(token, JWT_SECRET);

      // 4. Buscar el usuario del token en la DB y adjuntarlo a 'req'
      // (excluimos el password de la información adjuntada)
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
         return res.status(401).json({ message: 'Usuario no encontrado.' });
      }

      // 5. Continuar a la siguiente función (el controlador)
      next();

    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'No autorizado, token fallido.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se proporcionó token.' });
  }
};