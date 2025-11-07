import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx'; // Importa nuestro hook

function App() {
  // 1. Obtiene el estado del token y la función de logout del contexto
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // 2. Función para manejar el clic en "Logout"
  const handleLogout = () => {
    logout(); // Llama a la función del contexto
    navigate('/login'); // Redirige al usuario a la página de login
  };

  return (
    <div>
      {/* --- BARRA DE NAVEGACIÓN --- */}
      <nav style={{ padding: '10px', background: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Productos (Inicio)</Link>
        
        {/* 3. Renderizado Condicional: 
              Muestra 'Logout' o 'Login/Register' dependiendo del estado del token.
        */}
        {token ? (
          // Si hay token (usuario logueado)
          <button onClick={handleLogout}>Cerrar Sesión</button>
        ) : (
          // Si NO hay token (usuario no logueado)
          <>
            <Link to="/login" style={{ marginRight: '15px' }}>Login</Link>
            <Link to="/register">Registro</Link>
          </>
        )}
      </nav>
      {/* --- FIN DE LA NAVEGACIÓN --- */}

      <hr />
      
      {/* 4. Outlet (Salida): 
            Aquí es donde React Router renderizará el componente de la 
            ruta actual (LoginPage, RegisterPage, o ProductsPage).
      */}
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;