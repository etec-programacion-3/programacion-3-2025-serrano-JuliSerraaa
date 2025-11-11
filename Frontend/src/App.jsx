import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import './styles/App.css'; // Importar estilos CSS globales

/**
 * COMPONENTE: App
 * DESCRIPCIÓN: Componente principal que actúa como layout de la aplicación
 * FUNCIONALIDAD: 
 * - Define la estructura base con barra de navegación y área de contenido
 * - Maneja la navegación y estado de autenticación
 * - Renderiza condicionalmente enlaces según si el usuario está logueado
 */
function App() {
  // Obtener estado de autenticación del contexto
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * MANEJADOR: handleLogout
   * DESCRIPCIÓN: Cierra la sesión del usuario y redirige al login
   */
  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/login'); // Redirige al usuario a la página de login
  };

  /**
   * FUNCIÓN: isActiveRoute
   * DESCRIPCIÓN: Determina si una ruta está activa para resaltarla en la navegación
   * @param {string} path - Ruta a verificar
   * @returns {boolean} - True si la ruta está activa
   */
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="app">
      {/* ===== BARRA DE NAVEGACIÓN ===== */}
      <nav className="navbar">
        <div className="nav-content">
          {/* Logo y enlace a la página principal */}
          <Link 
            to="/" 
            className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
          >
            🛍️ MiEcommerce
          </Link>
          
          {/* Enlaces de navegación - Renderizado condicional según autenticación */}
          <div className="nav-links">
            {token ? (
              <>
                {/* USUARIO LOGUEADO: Muestra enlaces para usuarios autenticados */}
                <Link 
                  to="/" 
                  className={`nav-link ${isActiveRoute('/') ? 'active' : ''}`}
                >
                  Productos
                </Link>
                <Link 
                  to="/products/new" 
                  className={`nav-link ${isActiveRoute('/products/new') ? 'active' : ''}`}
                >
                  Vender
                </Link>
                {/* Información del usuario logueado */}
                <span className="text-muted" style={{ margin: '0 1rem' }}>
                  Hola, {user?.username}
                </span>
                {/* Botón para cerrar sesión */}
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                {/* USUARIO NO LOGUEADO: Muestra enlaces de autenticación */}
                <Link 
                  to="/login" 
                  className={`nav-link ${isActiveRoute('/login') ? 'active' : ''}`}
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1.5rem' }}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== CONTENIDO PRINCIPAL ===== */}
      {/* Outlet: Aquí React Router renderizará el componente de la ruta actual */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;