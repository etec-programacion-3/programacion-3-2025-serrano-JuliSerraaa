import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/AxiosConfig.js';
import '../styles/CreateProductPage.css'; // Importar estilos específicos

/**
 * COMPONENTE: CreateProductPage
 * DESCRIPCIÓN: Página con formulario para crear nuevos productos
 * FUNCIONALIDAD:
 * - Formulario con validación para crear productos
 * - Asocia automáticamente el producto al usuario logueado
 * - Maneja estados de carga y errores
 */
function CreateProductPage() {
  // ===== ESTADOS DEL FORMULARIO =====
  const [productName, setProductName] = useState(''); // Nombre del producto
  const [productType, setProductType] = useState(''); // Tipo/Categoría del producto
  const [price, setPrice] = useState(''); // Precio del producto
  const [error, setError] = useState(null); // Maneja errores del formulario
  const [loading, setLoading] = useState(false); // Controla estado de envío

  // ===== HOOKS Y CONTEXTO =====
  const navigate = useNavigate(); // Hook para navegación
  const { user } = useAuth(); // Información del usuario logueado

  /**
   * MANEJADOR: handleSubmit
   * DESCRIPCIÓN: Procesa el envío del formulario de creación de producto
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del formulario
    setError(null); // Limpiar errores anteriores
    setLoading(true); // Activar estado de carga

    // ===== VALIDACIONES DEL FORMULARIO =====
    
    // Validar que el nombre no esté vacío
    if (!productName.trim()) {
      setError('El nombre del producto es obligatorio.');
      setLoading(false);
      return;
    }

    // Validar que el tipo no esté vacío
    if (!productType.trim()) {
      setError('El tipo de producto es obligatorio.');
      setLoading(false);
      return;
    }

    // Validar que el precio sea un número válido y mayor a 0
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('El precio debe ser un número mayor a 0.');
      setLoading(false);
      return;
    }

    try {
      // ===== LLAMADA A LA API PARA CREAR PRODUCTO =====
      await apiClient.post('/products', {
        productName: productName.trim(), // Limpiar espacios en blanco
        productType: productType.trim(), // Limpiar espacios en blanco
        price: priceValue // Precio convertido a número
      });

      // ===== ÉXITO: REDIRIGIR AL CATÁLOGO =====
      navigate('/');
      
    } catch (err) {
      // ===== ERROR: MOSTRAR MENSAJE AL USUARIO =====
      console.error('Error al crear producto:', err);
      setError(err.response?.data?.message || 'Error al crear el producto. Intenta nuevamente.');
    } finally {
      // ===== FINALMENTE: DESACTIVAR LOADING =====
      setLoading(false);
    }
  };

  return (
    <div className="create-product-page">
      {/* ===== HEADER DE LA PÁGINA ===== */}
      <div className="create-product-header">
        <Link to="/" className="back-link">
          ← Volver al Catálogo
        </Link>
        <h1 className="create-product-title">Crear Nuevo Producto</h1>
        <p className="create-product-subtitle">
          Comparte tu producto con nuestra comunidad
        </p>
      </div>

      {/* ===== FORMULARIO DE CREACIÓN ===== */}
      <form onSubmit={handleSubmit} className="create-product-form">
        
        {/* ===== CAMPO: NOMBRE DEL PRODUCTO ===== */}
        <div className="form-group">
          <label className="form-label">Nombre del Producto</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Ej: iPhone 13 Pro, Zapatillas Running Nike, etc."
            className="form-input"
            required
          />
          <p className="form-help">Un nombre claro y descriptivo para tu producto</p>
        </div>

        {/* ===== CAMPO: TIPO/CATEGORÍA ===== */}
        <div className="form-group">
          <label className="form-label">Tipo/Categoría</label>
          <input
            type="text"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            placeholder="Ej: Electrónica, Ropa, Hogar, Deportes, etc."
            className="form-input"
            required
          />
          <p className="form-help">La categoría principal de tu producto</p>
        </div>

        {/* ===== CAMPO: PRECIO ===== */}
        <div className="form-group">
          <label className="form-label">Precio ($)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ej: 99.99"
            className="form-input"
            required
          />
          <p className="form-help">Precio en dólares estadounidenses</p>
        </div>

        {/* ===== INFORMACIÓN DEL VENDEDOR ===== */}
        <div className="seller-info">
          <div className="seller-info-title">Información del Vendedor</div>
          <div className="seller-details">
            <strong>Usuario:</strong> {user?.username}<br />
            <strong>ID:</strong> {user?.id}
          </div>
        </div>

        {/* ===== MENSAJE DE ERROR ===== */}
        {error && <div className="error">{error}</div>}

        {/* ===== BOTONES DE ACCIÓN ===== */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? '🔄 Creando...' : '🚀 Publicar Producto'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-outline"
          >
            Cancelar
          </button>
        </div>

        {/* ===== INFORMACIÓN ADICIONAL ===== */}
        <div className="form-footer">
          <p className="text-muted">
            Tu producto será visible para todos los usuarios de la comunidad
          </p>
        </div>
      </form>
    </div>
  );
}

export default CreateProductPage;