import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/AxiosConfig.js';
import ProductCard from '../components/ProductCard.jsx';
import '../styles/ProductsPage.css'; // Importar estilos específicos de esta página

/**
 * COMPONENTE: ProductsPage
 * DESCRIPCIÓN: Página principal que muestra la galería de productos
 * FUNCIONALIDAD:
 * - Obtiene y muestra todos los productos disponibles
 * - Maneja estados de carga y error
 * - Proporciona navegación para crear nuevos productos
 */
function ProductsPage() {
  // ===== ESTADOS DEL COMPONENTE =====
  const [products, setProducts] = useState([]); // Almacena la lista de productos
  const [error, setError] = useState(null); // Maneja mensajes de error
  const [loading, setLoading] = useState(true); // Controla el estado de carga

  // ===== EFECTO PARA CARGAR PRODUCTOS =====
  /**
   * HOOK: useEffect
   * DESCRIPCIÓN: Se ejecuta al montar el componente para cargar los productos
   * DEPENDENCIAS: Array vacío [] = solo se ejecuta una vez al montar
   */
  useEffect(() => {
    /**
     * FUNCIÓN: fetchProducts
     * DESCRIPCIÓN: Obtiene la lista de productos desde la API
     */
    const fetchProducts = async () => {
      try {
        setLoading(true); // Activar indicador de carga
        setError(null); // Limpiar errores anteriores
        
        // LLAMADA A LA API: Obtener todos los productos
        const response = await apiClient.get('/products');
        
        // Actualizar estado con los productos obtenidos
        setProducts(response.data);
      } catch (err) {
        // Manejar errores de la API
        setError('Error al cargar productos. Por favor, intenta nuevamente.');
      } finally {
        // Siempre desactivar el loading, tanto en éxito como en error
        setLoading(false);
      }
    };

    // Ejecutar la función para obtener productos
    fetchProducts();
  }, []); // Array de dependencias vacío = solo al montar

  return (
    <div className="products-page">
      {/* ===== ENCABEZADO DE LA PÁGINA ===== */}
      <div className="products-header">
        <h1 className="products-title">Descubre Productos Increíbles</h1>
        <p className="products-subtitle">
          Encuentra lo que necesitas en nuestra comunidad de compradores y vendedores
        </p>
      </div>

      {/* ===== BOTÓN PARA CREAR PRODUCTO ===== */}
      <Link to="/products/new" className="btn btn-primary create-product-btn">
        <span>+</span> Crear Nuevo Producto
      </Link>

      {/* ===== MENSAJE DE ERROR ===== */}
      {error && <div className="error">{error}</div>}

      {/* ===== CONTENIDO PRINCIPAL - GALERÍA DE PRODUCTOS ===== */}
      {loading ? (
        // ESTADO DE CARGA: Mostrar indicador mientras se obtienen los datos
        <div className="loading">
          <p>Cargando productos...</p>
        </div>
      ) : products.length > 0 ? (
        // ESTADO CON PRODUCTOS: Mostrar grid de productos
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </div>
      ) : (
        // ESTADO VACÍO: No hay productos disponibles
        <div className="products-empty">
          <div className="products-empty-icon">🛍️</div>
          <h3>No hay productos disponibles</h3>
          <p className="text-muted">
            Sé el primero en agregar un producto a nuestra comunidad
          </p>
          <Link to="/products/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Crear Primer Producto
          </Link>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;