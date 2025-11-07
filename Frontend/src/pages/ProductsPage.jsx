import React, { useState, useEffect } from 'react';
import apiClient from '../api/AxiosConfig.js'; // Usa nuestra instancia de Axios

// Esta es la página que PROTEGEREMOS
function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // 1. useEffect: Este hook se ejecuta *después* de que el componente se renderiza.
  //    El '[]' vacío al final significa "ejecútate solo una vez, al cargar".
  useEffect(() => {
    
    // 2. Definimos una función interna para cargar los productos
    const fetchProducts = async () => {
      try {
        // 3. Llama al endpoint protegido '/products'.
        //    ¡No necesitamos añadir el token! El 'interceptor' de Axios lo hace solo.
        const response = await apiClient.get('/products');
        setProducts(response.data); // Guarda los productos en el estado
      } catch (err) {
        // 4. Si falla (ej: 401 No autorizado, si el token es malo), muestra un error
        setError('Error al cargar productos. ¿Estás seguro de que estás logueado?');
      }
    };

    fetchProducts(); // Llama a la función
  }, []); // El '[]' es crucial

  return (
    <div>
      <h2>Página de Productos (Ruta Privada)</h2>
      <p>Si puedes ver esto, es porque tu JWT es válido.</p>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <h3>Catálogo:</h3>
      <ul>
        {/* 5. Mapea (itera) sobre la lista de productos y los muestra */}
        {products.length > 0 ? (
          products.map((product) => (
            <li key={product.productId}>
              {product.productName} - ${product.price}
            </li>
          ))
        ) : (
          <p>Cargando productos o no hay productos...</p>
        )}
      </ul>
    </div>
  );
}

export default ProductsPage;