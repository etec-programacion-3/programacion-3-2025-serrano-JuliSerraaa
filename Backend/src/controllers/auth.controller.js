// src/controllers/auth.controller.js

import User from '../models/user.js'; // Importa el modelo de usuario
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET; // Usamos la variable de entorno

// --- REGISTER (REGISTRO DE USUARIO) ---
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario con ese email ya existe.' });
    }

    // 2. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Crear el nuevo usuario en la DB
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 4. Generar Token de Autenticación (Opcional en Register, pero útil)
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '1d', // Expira en 1 día
    });

    // 5. Respuesta exitosa
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor durante el registro.' });
  }
};

// --- LOGIN (INICIO DE SESIÓN) ---
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Usar un mensaje genérico por seguridad (para no revelar si existe el email)
      return res.status(400).json({ message: 'Credenciales inválidas (email o password incorrectos).' });
    }

    // 2. Comparar la contraseña hasheada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas (email o password incorrectos).' });
    }

    // 3. Generar Token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    // 4. Respuesta exitosa
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: { id: user.id, username: user.username, email: user.email },
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor durante el inicio de sesión.' });
  }
};