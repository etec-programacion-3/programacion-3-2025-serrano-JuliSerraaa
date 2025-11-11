import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/AxiosConfig.js';
import ProductCard from '../components/ProductCard.jsx';
import '../styles/UserProfilePage.css'; // Importar estilos específicos

/**
 * COMPONENTE: UserProfilePage
 * DESCRIPCIÓN: Página para ver perfiles de usuario y sus productos
 * FUNCIONALIDAD:
 * - Muestra información del usuario (propio o de otros)
 * - Lista los productos publicados por el usuario
 * - Permite navegar a los detalles de cada producto
 */
function UserProfilePage() {
  // ===== HOOKS Y PARÁMETROS =====
  const { userId } = useParams(); // Obtener ID del usuario de la URL (opcional)
  const { user: currentUser } = useAuth(); // Usuario actualmente logueado

  // ===== ESTADOS DEL COMPONENTE =====
  const [profileUser, setProfileUser] = useState(null); // Usuario del perfil
  const [userProducts, setUserProducts] = useState([]); // Productos del usuario
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores

  // Determinar si estamos viendo nuestro propio perfil o el de otro usuario
  const isOwnProfile = !userId || userId === currentUser?.id;
  const targetUserId = userId || currentUser?.id;

  // ===== EFECTO PARA CARGAR DATOS DEL PERFIL =====
  /**
   * HOOK: useEffect
   * DESCRIPCIÓN: Carga los datos del usuario y sus productos
   * DEPENDENCIAS: [targetUserId] - Se ejecuta cuando el ID de usuario objetivo cambia
   */
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Si es el perfil propio, usar datos del contexto
        if (isOwnProfile) {
          setProfileUser(currentUser);
        } else {
          // TODO: Implementar endpoint para obtener datos de usuario por ID
          // Por ahora, mostramos información básica
          setProfileUser({
            id: targetUserId,
            username: `Usuario ${targetUserId}`,
            email: `usuario${targetUserId}@ejemplo.com`
          });
        }

        // LLAMADA A LA API: Obtener productos del usuario
        // Nota: Esto obtiene todos los productos, luego filtramos por usuario
        const response = await apiClient.get('/products');
        const allProducts = response.data;
        
        // Filtrar productos del usuario específico
        const userProducts = allProducts.filter(
          product => product.userId === parseInt(targetUserId)
        );
        
        setUserProducts(userProducts);
        
      } catch (err) {
        setError('Error al cargar el perfil. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    if (targetUserId) {
      fetchProfileData();
    }
  }, [targetUserId, isOwnProfile, currentUser]);

  // ===== RENDERIZADO CONDICIONAL - ESTADOS DE CARGA Y ERROR =====
  
  // ESTADO DE CARGA: Mostrar indicador mientras se cargan los datos
  if (loading) return (
    <div className="user-profile-page">
      <div className="loading">Cargando perfil...</div>
    </div>
  );

  // ESTADO DE ERROR: Mostrar mensaje de error
  if (error) return (
    <div className="user-profile-page">
      <div className="error">{error}</div>
      <Link to="/" className="btn btn-outline">Volver al Catálogo</Link>
    </div>
  );

  return (
    <div className="user-profile-page">
      {/* ===== HEADER DEL PERFIL ===== */}
      <div className="profile-header">
        <Link to="/" className="back-link">
          ← Volver al Catálogo
        </Link>
        
        <div className="profile-card">
          {/* Avatar del usuario */}
          <div className="profile-avatar">
            {profileUser?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          {/* Información del usuario */}
          <div className="profile-info">
            <h1 className="profile-name">
              {profileUser?.username}
              {isOwnProfile && <span className="own-profile-badge">Tu perfil</span>}
            </h1>
            <p className="profile-email">{profileUser?.email}</p>
            <p className="profile-stats">
              <strong>{userProducts.length}</strong> producto{userProducts.length !== 1 ? 's' : ''} publicado{userProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* ===== SECCIÓN DE PRODUCTOS ===== */}
      <div className="profile-products-section">
        <div className="section-header">
          <h2 className="section-title">
            {isOwnProfile ? 'Mis Productos' : `Productos de ${profileUser?.username}`}
          </h2>
          {isOwnProfile && userProducts.length === 0 && (
            <Link to="/products/new" className="btn btn-primary">
              + Crear Primer Producto
            </Link>
          )}
        </div>

        {/* ===== LISTA DE PRODUCTOS ===== */}
        {userProducts.length > 0 ? (
          <div className="user-products-grid">
            {userProducts.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        ) : (
          // ===== ESTADO SIN PRODUCTOS =====
          <div className="no-products">
            <div className="no-products-icon">🛍️</div>
            <h3>
              {isOwnProfile 
                ? 'Aún no has publicado productos' 
                : `${profileUser?.username} no ha publicado productos aún`
              }
            </h3>
            <p className="text-muted">
              {isOwnProfile
                ? 'Comienza a vender creando tu primer producto'
                : 'Vuelve más tarde para ver sus publicaciones'
              }
            </p>
            {isOwnProfile && (
              <Link to="/products/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Crear Primer Producto
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ===== INFORMACIÓN ADICIONAL (solo para perfil propio) ===== */}
      {isOwnProfile && (
        <div className="profile-actions">
          <div className="action-card">
            <h3 className="action-title">Gestiona tu cuenta</h3>
            <p className="action-description">
              Aquí puedes ver y gestionar todos tus productos publicados
            </p>
            <div className="action-buttons">
              <Link to="/products/new" className="btn btn-primary">
                + Nuevo Producto
              </Link>
              <button className="btn btn-outline" disabled>
                Editar Perfil (Próximamente)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfilePage;