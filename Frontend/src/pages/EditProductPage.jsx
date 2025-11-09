import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/AxiosConfig.js';
import '../styles/EditProductPage.css'; // Importar estilos específicos

/**
 * COMPONENTE: EditProductPage
 * DESCRIPCIÓN: Página para editar productos existentes
 * FUNCIONALIDAD:
 * - Carga los datos actuales del producto
 * - Permite modificar nombre, tipo y precio
 * - Valida que el usuario sea el propietario
 * - Actualiza el producto en la base de datos
 */
function EditProductPage() {
  // ===== HOOKS Y PARÁMETROS =====
  const { id } = useParams(); // Obtener ID del producto de la URL
  const navigate = useNavigate(); // Navegación programática
  const { user } = useAuth(); // Información del usuario logueado

  // ===== ESTADOS DEL COMPONENTE =====
  const [product, setProduct] = useState(null); // Datos actuales del producto
  const [formData, setFormData] = useState({ // Datos del formulario
    productName: '',
    productType: '',
    price: ''
  });
  const [error, setError] = useState(null); // Manejo de errores
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [submitting, setSubmitting] = useState(false); // Estado de envío del formulario

  // ===== EFECTO PARA CARGAR DATOS DEL PRODUCTO =====
  /**
   * HOOK: useEffect
   * DESCRIPCIÓN: Carga los datos del producto al montar el componente
   * DEPENDENCIAS: [id] - Se ejecuta cuando el ID del producto cambia
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // LLAMADA A LA API: Obtener producto por ID
        const response = await apiClient.get(`/products/${id}`);
        const productData = response.data;
        
        // Verificar que el usuario es el propietario del producto
        if (user.id !== productData.userId) {
          setError('No tienes permisos para editar este producto.');
          setLoading(false);
          return;
        }
        
        // Guardar datos del producto y actualizar formulario
        setProduct(productData);
        setFormData({
          productName: productData.productName,
          productType: productData.productType,
          price: productData.price.toString()
        });
        
      } catch (err) {
        setError('Error al cargar el producto. Verifica que existe.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user.id]);

  /**
   * MANEJADOR: handleInputChange
   * DESCRIPCIÓN: Actualiza los datos del formulario cuando los campos cambian
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * MANEJADOR: handleSubmit
   * DESCRIPCIÓN: Procesa el envío del formulario de edición
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // ===== VALIDACIONES DEL FORMULARIO =====
    if (!formData.productName.trim()) {
      setError('El nombre del producto es obligatorio.');
      setSubmitting(false);
      return;
    }

    if (!formData.productType.trim()) {
      setError('El tipo de producto es obligatorio.');
      setSubmitting(false);
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      setError('El precio debe ser un número mayor a 0.');
      setSubmitting(false);
      return;
    }

    try {
      // ===== LLAMADA A LA API: ACTUALIZAR PRODUCTO =====
      await apiClient.put(`/products/${id}`, {
        productName: formData.productName.trim(),
        productType: formData.productType.trim(),
        price: priceValue
      });

      // ===== ÉXITO: REDIRIGIR A DETALLES DEL PRODUCTO =====
      navigate(`/products/${id}`);
      
    } catch (err) {
      // ===== ERROR: MOSTRAR MENSAJE AL USUARIO =====
      console.error('Error al actualizar producto:', err);
      setError(err.response?.data?.message || 'Error al actualizar el producto. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // ===== RENDERIZADO CONDICIONAL - ESTADOS DE CARGA Y ERROR =====
  
  // ESTADO DE CARGA: Mostrar indicador mientras se cargan los datos
  if (loading) return (
    <div className="edit-product-page">
      <div className="loading">Cargando producto...</div>
    </div>
  );

  // ESTADO DE ERROR: Mostrar mensaje de error
  if (error) return (
    <div className="edit-product-page">
      <div className="error">{error}</div>
      <Link to="/" className="btn btn-outline">Volver al Catálogo</Link>
    </div>
  );

  return (
    <div className="edit-product-page">
      {/* ===== HEADER DE LA PÁGINA ===== */}
      <div className="edit-product-header">
        <Link to={`/products/${id}`} className="back-link">
          ← Volver a Detalles
        </Link>
        <h1 className="edit-product-title">Editar Producto</h1>
        <p className="edit-product-subtitle">
          Actualiza la información de tu producto
        </p>
      </div>

      {/* ===== FORMULARIO DE EDICIÓN ===== */}
      <form onSubmit={handleSubmit} className="edit-product-form">
        
        {/* ===== CAMPO: NOMBRE DEL PRODUCTO ===== */}
        <div className="form-group">
          <label className="form-label">Nombre del Producto</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
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
            name="productType"
            value={formData.productType}
            onChange={handleInputChange}
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
            name="price"
            step="0.01"
            min="0.01"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Ej: 99.99"
            className="form-input"
            required
          />
          <p className="form-help">Precio en dólares estadounidenses</p>
        </div>

        {/* ===== INFORMACIÓN DEL PRODUCTO ORIGINAL ===== */}
        <div className="original-info">
          <div className="original-info-title">Información Original</div>
          <div className="original-details">
            <p><strong>Nombre original:</strong> {product?.productName}</p>
            <p><strong>Tipo original:</strong> {product?.productType}</p>
            <p><strong>Precio original:</strong> ${product?.price}</p>
            <p><strong>Creado:</strong> {product && new Date(product.createdAt).toLocaleDateString('es-ES')}</p>
          </div>
        </div>

        {/* ===== MENSAJE DE ERROR ===== */}
        {error && <div className="error">{error}</div>}

        {/* ===== BOTONES DE ACCIÓN ===== */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
          >
            {submitting ? '🔄 Actualizando...' : '💾 Guardar Cambios'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(`/products/${id}`)}
            className="btn btn-outline"
          >
            Cancelar
          </button>
        </div>

        {/* ===== INFORMACIÓN ADICIONAL ===== */}
        <div className="form-footer">
          <p className="text-muted">
            Los cambios se aplicarán inmediatamente y serán visibles para todos los usuarios
          </p>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;