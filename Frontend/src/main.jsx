import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Importa todos nuestros componentes y proveedores
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // El guardián

// 2. Renderiza la aplicación
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Envuelve TODA la aplicación en el AuthProvider.
          Ahora, todos los componentes dentro de <BrowserRouter>
          pueden usar el hook 'useAuth()' para saber si el usuario está logueado.
    */}
    <AuthProvider>
      {/* 4. Habilita el enrutamiento */}
      <BrowserRouter>
        {/* 5. Define las rutas */}
        <Routes>
          {/* 6. Ruta de Layout ('App'): 
                Todas las rutas anidadas se renderizarán dentro del <Outlet> de App.jsx
          */}
          <Route path="/" element={<App />}>
            
            {/* Rutas Públicas */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Rutas Privadas */}
            {/* 'index' significa que esta es la ruta para el path '/' (la raíz) */}
            <Route
              index 
              element={
                // 7. Envuelve la página de productos con nuestro Guardián.
                //    Si el usuario no está logueado, 'ProtectedRoute' lo
                //    redirigirá a '/login' en lugar de mostrar 'ProductsPage'.
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            {/* Aquí podrías añadir más rutas protegidas, ej:
            <Route path="chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} /> 
            */}

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);