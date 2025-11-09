import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/AxiosConfig.js';
import '../styles/ProductDetailPage.css'; // Importar estilos específicos

/**
 * COMPONENTE: ProductDetailPage
 * DESCRIPCIÓN: Página que muestra los detalles completos de un producto específico
 * FUNCIONALIDAD:
 * - Obtiene y muestra información detallada del producto
 * - Verifica si el usuario es el propietario para mostrar acciones
 * - Permite eliminar productos (solo para propietarios)
 */
function ProductDetailPage() {
  // ===== HOOKS DE REACT ROUTER =====
  const { id } = useParams(); // Extrae el ID del producto de la URL
  const navigate = useNavigate(); // Hook para navegación programática
  
  // ===== CONTEXTO DE AUTENTICACIÓN =====
  const { user } = useAuth(); // Obtiene información del usuario logueado
  
  // ===== ESTADOS DEL COMPONENTE =====
  const [product, setProduct] = useState(null); // Almacena los detalles del producto
  const [error, setError] = useState(null); // Maneja mensajes de error
  const [loading, setLoading] = useState(true); // Controla estado de carga

  // ===== EFECTO PARA CARGAR DETALLES DEL PRODUCTO =====
  /**
   * HOOK: useEffect
   * DESCRIPCIÓN: Carga los detalles del producto cuando el componente se monta o el ID cambia
   * DEPENDENCIAS: [id] - Se ejecuta cuando el ID del producto en la URL cambia
   */
  useEffect(() => {
    /**
     * FUNCIÓN: fetchProduct
     * DESCRIPCIÓN: Obtiene los detalles de un producto específico desde la API
     */
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // LLAMADA A LA API: Obtener producto por ID
        const response = await apiClient.get(`/products/${id}`);
        
        // Actualizar estado con los detalles del producto
        setProduct(response.data);
      } catch (err) {
        // Manejar errores (producto no encontrado, error de servidor, etc.)
        setError('Producto no encontrado o error al cargar los detalles.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // Dependencia: se ejecuta cuando el ID cambia

  /**
   * MANEJADOR: handleDelete
   * DESCRIPCIÓN: Elimina el producto actual (solo para propietarios)
   * FUNCIONALIDAD:
   * - Muestra confirmación antes de eliminar
   * - Llama a la API para eliminar el producto
   * - Redirige al catálogo después de eliminar
   */
  const handleDelete = async () => {
    // Confirmación para prevenir eliminaciones accidentales
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      try {
        // LLAMADA A LA API: Eliminar producto por ID
        await apiClient.delete(`/products/${id}`);
        
        // Redirigir al catálogo después de eliminar
        navigate('/');
      } catch (err) {
        // Manejar errores de eliminación
        setError('Error al eliminar el producto. Intenta nuevamente.');
      }
    }
  };

  // ===== RENDERIZADO CONDICIONAL - ESTADOS DE CARGA Y ERROR =====
  
  // ESTADO DE CARGA: Mostrar indicador mientras se obtienen los datos
  if (loading) return (
    <div className="product-detail-page">
      <div className="loading">Cargando producto...</div>
    </div>
  );
  
  // ESTADO DE ERROR: Mostrar mensaje de error
  if (error) return (
    <div className="product-detail-page">
      <div className="error">{error}</div>
      <Link to="/" className="btn btn-outline">Volver al Catálogo</Link>
    </div>
  );
  
  // ESTADO SIN PRODUCTO: Producto no encontrado
  if (!product) return (
    <div className="product-detail-page">
      <div className="error">Producto no encontrado.</div>
      <Link to="/" className="btn btn-outline">Volver al Catálogo</Link>
    </div>
  );

  // ===== VERIFICACIÓN DE PROPIEDAD =====
  /**
   * Determina si el usuario actual es el propietario del producto
   * Compara el ID del usuario logueado con el userId del producto
   */
  const isOwner = user && user.id === product.userId;

  return (
    <div className="product-detail-page">
      {/* ===== ENLACE PARA VOLVER ===== */}
      <Link to="/" className="back-link">
        ← Volver al catálogo
      </Link>

      {/* ===== TARJETA DE DETALLES DEL PRODUCTO ===== */}
      <div className="product-detail-card">
        {/* ===== HEADER DEL PRODUCTO ===== */}
        <div className="product-detail-header">
          <h1 className="product-detail-name">{product.productName}</h1>
          <span className="product-detail-type">{product.productType}</span>
        </div>

        {/* ===== PRECIO DESTACADO ===== */}
        <div className="product-detail-price">{product.price}</div>

        {/* ===== INFORMACIÓN DETALLADA DEL PRODUCTO ===== */}
        <div className="product-info">
          <div className="info-item">
            <span className="info-label">Vendedor ID:</span>
            <span className="info-value">{product.userId}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Producto ID:</span>
            <span className="info-value">{product.productId}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Creado:</span>
            <span className="info-value">
              {new Date(product.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* ===== ACCIONES PARA EL PROPIETARIO (RENDERIZADO CONDICIONAL) ===== */}
        {isOwner && (
          <div className="owner-actions">
            {/* Badge que indica que el usuario es el propietario */}
            <div className="owner-badge">
              <span>⭐</span> Eres el propietario de este producto
            </div>
            {/* Botones de acción solo visibles para el propietario */}
            <div className="action-buttons">
              <button 
                onClick={() => navigate(`/products/edit/${product.productId}`)}
                className="btn btn-secondary"
              >
                ✏️ Editar Producto
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
              >
                🗑️ Eliminar Producto
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;