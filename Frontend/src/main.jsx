import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importación de componentes y contextos
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import CreateProductPage from './pages/CreateProductPage.jsx';
import EditProductPage from './pages/EditProductPage.jsx';
import UserProfilePage from './pages/UserProfilePage.jsx';
import ChatPage from './pages/ChatPage.jsx'; // NUEVO IMPORT
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Punto de entrada de la aplicación React
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider envuelve toda la app para proveer autenticación */}
    <AuthProvider>
      {/* BrowserRouter habilita el enrutamiento en la aplicación */}
      <BrowserRouter>
        {/* Routes define todas las rutas de la aplicación */}
        <Routes>
          {/* Ruta de layout (App) que contiene la barra de navegación y Outlet */}
          <Route path="/" element={<App />}>
            
            {/* RUTAS PÚBLICAS - Accesibles sin autenticación */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* RUTAS PRIVADAS - Requieren autenticación */}
            
            {/* Ruta principal (índice) - Página de productos */}
            <Route
              index
              element={
                <ProtectedRoute>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta para detalles del producto */}
            <Route
              path="products/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta para crear producto */}
            <Route
              path="products/new"
              element={
                <ProtectedRoute>
                  <CreateProductPage />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta para editar producto */}
            <Route
              path="products/edit/:id"
              element={
                <ProtectedRoute>
                  <EditProductPage />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta para perfil de usuario */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            
            {/* Ruta para ver perfil de otros usuarios */}
            <Route
              path="users/:userId"
              element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              }
            />
            
            {/* NUEVA RUTA: Página de chat y mensajería */}
            <Route
              path="chat"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);