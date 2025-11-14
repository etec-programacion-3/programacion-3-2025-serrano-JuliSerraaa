import React, { createContext, useState, useContext } from 'react';

/**
 * CONTEXTO: AuthContext
 * DESCRIPCIÓN: Contexto global para manejar el estado de autenticación
 * FUNCIONALIDAD:
 * - Proporciona estado de autenticación a toda la aplicación
 * - Maneja login, logout y persistencia en localStorage
 * - Expone token y datos del usuario a componentes hijos
 */
const AuthContext = createContext(null);

/**
 * COMPONENTE: AuthProvider
 * DESCRIPCIÓN: Proveedor del contexto que envuelve la aplicación
 * PROPS:
 * - children: Componentes hijos que tendrán acceso al contexto
 */
export const AuthProvider = ({ children }) => {
  // ===== ESTADOS DE AUTENTICACIÓN =====
  
  // Estado para el token JWT - Inicializa desde localStorage si existe
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Estado para los datos del usuario - Inicializa desde localStorage si existe
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  /**
   * FUNCIÓN: login
   * DESCRIPCIÓN: Guarda el token y datos del usuario en el estado y localStorage
   * @param {string} newToken - Token JWT recibido del servidor
   * @param {object} userData - Datos del usuario autenticado
   */
  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken); // Persistir token en localStorage
    localStorage.setItem('user', JSON.stringify(userData)); // Persistir usuario
    setToken(newToken); // Actualizar estado de React
    setUser(userData); // Actualizar estado del usuario
  };

  /**
   * FUNCIÓN: logout
   * DESCRIPCIÓN: Limpia todos los datos de autenticación
   */
  const logout = () => {
    localStorage.removeItem('token'); // Eliminar token del localStorage
    localStorage.removeItem('user'); // Eliminar usuario del localStorage
    setToken(null); // Limpiar estado del token
    setUser(null); // Limpiar estado del usuario
  };

  // ===== VALOR DEL CONTEXTO =====
  // Objeto que contiene todos los datos y funciones disponibles
  const value = {
    token,     // Token JWT actual (null si no hay sesión)
    user,      // Datos del usuario logueado (null si no hay sesión)
    login,     // Función para iniciar sesión
    logout,    // Función para cerrar sesión
  };

  // Renderizar el Provider con el valor del contexto
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * HOOK PERSONALIZADO: useAuth
 * DESCRIPCIÓN: Hook para acceder fácilmente al contexto de autenticación
 * @returns {object} - Objeto con token, user, login y logout
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};