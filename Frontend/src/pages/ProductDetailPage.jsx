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
 * - Permite contactar al vendedor o comprar el producto
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
  const [contacting, setContacting] = useState(false); // Estado de contacto con vendedor
  const [purchasing, setPurchasing] = useState(false); // Estado de compra

  // ===== EFECTO PARA CARGAR DETALLES DEL PRODUCTO =====
  useEffect(() => {
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

  /**
   * MANEJADOR: handleContactSeller
   * DESCRIPCIÓN: Inicia una conversación con el vendedor del producto
   */
  const handleContactSeller = async () => {
    if (!product || !user) return;
    
    setContacting(true);
    setError(null);

    try {
      console.log('1. Iniciando contacto con vendedor:', product.userId);
      
      // ===== 1. CREAR CONVERSACIÓN CON EL VENDEDOR =====
      const conversationResponse = await apiClient.post('/chat/conversations', {
        receiverId: product.userId
      });
      
      const conversation = conversationResponse.data;
      console.log('2. Conversación creada:', conversation);

      // ===== 2. ENVIAR MENSAJE AUTOMÁTICO =====
      await apiClient.post(`/chat/conversations/${conversation.id}/messages`, {
        content: `Hola, estoy interesado en tu producto: "${product.productName}"`
      });
      console.log('3. Mensaje automático enviado');

      // ===== 3. REDIRIGIR AL CHAT =====
      navigate('/chat', { 
        state: { 
          conversationId: conversation.id,
          autoSelect: true 
        } 
      });
      console.log('4. Redirigiendo al chat...');

    } catch (err) {
      console.error('Error completo al contactar vendedor:', err);
      setError(err.response?.data?.message || 'Error al contactar al vendedor. Intenta nuevamente.');
    } finally {
      setContacting(false);
    }
  };

  /**
   * MANEJADOR: handlePurchase
   * DESCRIPCIÓN: Realiza la compra del producto y redirige al chat
   */
  const handlePurchase = async () => {
    if (!product || !user) return;
    
    setPurchasing(true);
    setError(null);

    try {
      console.log('1. Iniciando compra del producto:', product.productId);
      
      // ===== 1. CREAR COMPRA =====
      const purchaseResponse = await apiClient.post('/purchases', {
        productId: product.productId
      });
      
      const { purchase, conversation } = purchaseResponse.data;
      console.log('2. Compra creada:', purchase);
      console.log('3. Conversación:', conversation);

      // ===== 2. REDIRIGIR AL CHAT =====
      navigate('/chat', { 
        state: { 
          conversationId: conversation.id,
          autoSelect: true 
        } 
      });
      console.log('4. Redirigiendo al chat...');

    } catch (err) {
      console.error('Error completo en compra:', err);
      setError(err.response?.data?.message || 'Error al procesar la compra. Intenta nuevamente.');
    } finally {
      setPurchasing(false);
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

        {/* ===== ACCIONES PARA COMPRADORES (NO PROPIETARIOS) ===== */}
        {!isOwner && (
          <div className="buyer-actions">
            {/* BOTÓN DE COMPRAR */}
            <div className="purchase-section">
              <button 
                onClick={handlePurchase}
                disabled={purchasing}
                className="btn btn-success purchase-btn"
              >
                {purchasing ? '🔄 Procesando...' : '💰 Comprar Ahora'}
              </button>
              <p className="action-help">
                Compra inmediata - Se iniciará conversación con el vendedor
              </p>
            </div>

            {/* SEPARADOR */}
            <div className="action-separator">
              <span>o</span>
            </div>

            {/* BOTÓN DE CONTACTAR */}
            <div className="contact-section">
              <button 
                onClick={handleContactSeller}
                disabled={contacting}
                className="btn btn-primary contact-seller-btn"
              >
                {contacting ? '🔄 Contactando...' : '💬 Contactar al Vendedor'}
              </button>
              <p className="action-help">
                Solo conversación - Para consultas antes de comprar
              </p>
            </div>
          </div>
        )}

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