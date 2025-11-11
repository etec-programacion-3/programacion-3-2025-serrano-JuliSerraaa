import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css'; // Importar estilos específicos del componente

/**
 * COMPONENTE: ProductCard
 * DESCRIPCIÓN: Componente reutilizable que muestra una tarjeta de producto individual
 * PROPS:
 * - product: Objeto con la información del producto a mostrar
 * FUNCIONALIDAD:
 * - Muestra información básica del producto (nombre, tipo, precio)
 * - Proporciona navegación a la página de detalles del producto
 */
function ProductCard({ product }) {
  return (
    // ===== CONTENEDOR PRINCIPAL DE LA TARJETA =====
    <div className="product-card">
      {/* ===== HEADER DE LA TARJETA ===== */}
      <div className="product-header">
        {/* Nombre del producto */}
        <h3 className="product-name">{product.productName}</h3>
        {/* Tipo/Categoría del producto con estilo de badge */}
        <span className="product-type">{product.productType}</span>
      </div>

      {/* ===== PRECIO DEL PRODUCTO ===== */}
      <div className="product-price">{product.price}</div>

      {/* ===== ACCIONES DE LA TARJETA ===== */}
      <div className="product-actions">
        {/* Botón para ver detalles - Navega a la página de detalles del producto */}
        <Link 
          to={`/products/${product.productId}`} 
          className="btn btn-outline details-btn"
        >
          <span>👁️</span> Ver Detalles
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;