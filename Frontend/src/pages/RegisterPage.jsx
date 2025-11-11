import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/AxiosConfig.js';
import '../styles/AuthPages.css'; // Importar estilos de autenticación

/**
 * COMPONENTE: RegisterPage
 * DESCRIPCIÓN: Página de registro para nuevos usuarios
 * FUNCIONALIDAD:
 * - Formulario de registro con validación
 * - Creación de nueva cuenta de usuario
 * - Login automático después del registro exitoso
 */
function RegisterPage() {
  // ===== ESTADOS DEL FORMULARIO =====
  const [username, setUsername] = useState(''); // Nombre de usuario
  const [email, setEmail] = useState(''); // Email del usuario
  const [password, setPassword] = useState(''); // Contraseña del usuario
  const [error, setError] = useState(null); // Maneja errores de registro

  // ===== HOOKS Y CONTEXTO =====
  const { login } = useAuth(); // Función login del contexto
  const navigate = useNavigate(); // Navegación programática

  /**
   * MANEJADOR: handleSubmit
   * DESCRIPCIÓN: Procesa el envío del formulario de registro
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página
    setError(null); // Limpiar errores anteriores

    try {
      // ===== LLAMADA A LA API: REGISTRO =====
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password
      });

      // ===== ÉXITO: EXTRAER DATOS Y GUARDAR EN CONTEXTO =====
      const { token, user } = response.data;
      
      // Iniciar sesión automáticamente después del registro
      login(token, user);
      
      // Redirigir a la página principal
      navigate('/');

    } catch (err) {
      // ===== ERROR: MOSTRAR MENSAJE AL USUARIO =====
      setError(err.response?.data?.message || 'Error en el registro. Intenta nuevamente.');
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
            <h1 className="auth-title">Crear Cuenta</h1>
            <p className="auth-subtitle">Únete a nuestra comunidad de compradores y vendedores</p>
          </div>

          {/* ===== FORMULARIO DE REGISTRO ===== */}
          <form onSubmit={handleSubmit} className="auth-form">
            
            {/* CAMPO: NOMBRE DE USUARIO */}
            <div className="auth-form-group">
              <label className="auth-label">Nombre de Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
                placeholder="ej: juanperez"
                required
              />
            </div>

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
              Crear Cuenta
            </button>
          </form>

          {/* ===== PIE DE PÁGINA - ENLACE A LOGIN ===== */}
          <div className="auth-footer">
            <p className="text-muted">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="auth-link">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;