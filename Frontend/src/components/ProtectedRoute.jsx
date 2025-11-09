import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * COMPONENTE: ProtectedRoute
 * DESCRIPCIÓN: Componente de orden superior que protege rutas privadas
 * FUNCIONALIDAD:
 * - Verifica si el usuario está autenticado antes de renderizar el contenido
 * - Redirige al login si no hay token de autenticación
 * PROPS:
 * - children: Componente hijo que se renderizará si el usuario está autenticado
 */
function ProtectedRoute({ children }) {
  // ===== OBTENER ESTADO DE AUTENTICACIÓN =====
  const { token } = useAuth(); // Obtener token del contexto de autenticación

  // ===== LÓGICA DE PROTECCIÓN =====
  
  // Si NO hay token (usuario no autenticado)
  if (!token) {
    /**
     * Redirigir al usuario a la página de login
     * - replace: true evita que la ruta protegida quede en el historial
     * - El usuario no podrá volver atrás a la ruta protegida
     */
    return <Navigate to="/login" replace />;
  }

  // ===== USUARIO AUTENTICADO =====
  // Si hay token, renderizar el componente hijo (contenido protegido)
  return children;
}

export default ProtectedRoute;