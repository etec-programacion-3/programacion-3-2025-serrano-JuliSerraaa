import React, { createContext, useState, useContext } from 'react';

// 1. createContext: Crea el "contenedor" global donde vivirá el estado.
const AuthContext = createContext(null);

// 2. AuthProvider: Este es el componente que "proveerá" el estado a toda tu app.
//    Recibe 'children', que es el resto de tu aplicación.
export const AuthProvider = ({ children }) => {
  
  // 3. useState: Este es el estado de autenticación.
  //    Al iniciar, intenta leer el 'token' guardado en localStorage.
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 4. Función de Login: La llamaremos después de que la API responda OK.
  const login = (newToken) => {
    localStorage.setItem('token', newToken); // Guarda el token en el navegador
    setToken(newToken); // Actualiza el estado de React
  };

  // 5. Función de Logout: La llamaremos para cerrar sesión.
  const logout = () => {
    localStorage.removeItem('token'); // Borra el token del navegador
    setToken(null); // Actualiza el estado de React (lo pone en null)
  };

  // 6. 'value': Es el objeto que compartiremos con el resto de la app.
  //    Exponemos el token actual, y las funciones para cambiarlo.
  const value = {
    token,
    login,
    logout,
  };

  // 7. El Proveedor: Envuelve a los 'children' (tu app) y les da acceso al 'value'.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 8. useAuth (Hook personalizado): 
//    En lugar de importar 'useContext' y 'AuthContext' en cada archivo,
//    solo importaremos 'useAuth()' para acceder al contexto. Es más limpio.
export const useAuth = () => {
  return useContext(AuthContext);
};