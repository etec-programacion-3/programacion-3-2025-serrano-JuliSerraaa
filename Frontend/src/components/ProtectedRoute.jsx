import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// 1. Este componente es un "Envoltorio" (Wrapper).
//    Recibe 'children', que será la página que queremos proteger (ej: Productos).
function ProtectedRoute({ children }) {
  
  // 2. Llama a nuestro hook 'useAuth' para obtener el estado del token.
  const { token } = useAuth(); 

  // 3. La lógica de protección (Cumple el criterio de "rutas privadas")
  if (!token) {
    // 4. Si NO hay token (usuario no logueado),
    //    usa el componente 'Navigate' para redirigir forzosamente al login.
    //    'replace' evita que pueda volver atrás con el botón del navegador.
    return <Navigate to="/login" replace />;
  }

  // 5. Si HAY token, simplemente renderiza los 'children' (la página solicitada).
  return children;
}

export default ProtectedRoute;