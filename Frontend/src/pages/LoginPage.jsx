import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/AxiosConfig.js';
import '../styles/AuthPages.css'; // Importar estilos de autenticación

/**
 * COMPONENTE: LoginPage
 * DESCRIPCIÓN: Página de inicio de sesión para usuarios existentes
 * FUNCIONALIDAD:
 * - Formulario de autenticación con validación
 * - Manejo de errores de credenciales
 * - Integración con el contexto de autenticación
 */
function LoginPage() {
  // ===== ESTADOS DEL FORMULARIO =====
  const [email, setEmail] = useState(''); // Email del usuario
  const [password, setPassword] = useState(''); // Contraseña del usuario
  const [error, setError] = useState(null); // Maneja errores de autenticación

  // ===== HOOKS Y CONTEXTO =====
  const navigate = useNavigate(); // Navegación programática
  const { login } = useAuth(); // Función login del contexto

  /**
   * MANEJADOR: handleSubmit
   * DESCRIPCIÓN: Procesa el envío del formulario de login
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página
    setError(null); // Limpiar errores anteriores

    try {
      // ===== LLAMADA A LA API: AUTENTICACIÓN =====
      const response = await apiClient.post('/auth/login', {
        email: email,
        password: password
      });

      // ===== ÉXITO: EXTRAER DATOS Y GUARDAR EN CONTEXTO =====
      const { token, user } = response.data;
      
      // Guardar token y datos del usuario en el contexto y localStorage
      login(token, user);

      // Redirigir a la página principal
      navigate('/');

    } catch (err) {
      // ===== ERROR: MOSTRAR MENSAJE AL USUARIO =====
      // Mensaje genérico por seguridad (no revelar si el email existe)
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    // ===== CONTENEDOR PRINCIPAL DE AUTENTICACIÓN =====
    <div className="auth-page">
      <div className="auth-container">
        
        {/* ===== TARJETA DE AUTENTICACIÓN ===== */}
        <div className="auth-card">
          
          {/* ===== HEADER DE LA TARJETA ===== */}
          <div className="auth-header">
            <h1 className="auth-title">Iniciar Sesión</h1>
            <p className="auth-subtitle">Bienvenido de vuelta a nuestra comunidad</p>
          </div>

          {/* ===== FORMULARIO DE LOGIN ===== */}
          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* CAMPO: EMAIL */}
            <div className="auth-form-group">
              <label className="auth-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                placeholder="tu@email.com"
                required
              />
            </div>

            {/* CAMPO: CONTRASEÑA */}
            <div className="auth-form-group">
              <label className="auth-label">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="••••••••"
                required
              />
            </div>

            {/* ===== MENSAJE DE ERROR ===== */}
            {error && <div className="error">{error}</div>}

            {/* ===== BOTÓN DE ENVÍO ===== */}
            <button type="submit" className="btn btn-primary auth-button">
              Iniciar Sesión
            </button>
          </form>

          {/* ===== PIE DE PÁGINA - ENLACE A REGISTRO ===== */}
          <div className="auth-footer">
            <p className="text-muted">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="auth-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;