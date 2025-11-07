import axios from 'axios';

// 1. Crear una "instancia" de Axios.
//    Usaremos esta instancia 'apiClient' en lugar del 'axios' genérico.
const apiClient = axios.create({
  // 2. baseURL: Define la URL base de tu backend.
  //    Ahora, en lugar de llamar a 'http://localhost:3000/api/auth/login',
  //    solo llamaremos a '/auth/login'.
  baseURL: 'http://localhost:3000/api',
});

// 3. Interceptor de Petición (Request Interceptor)
//    Esto es magia: Este código se ejecuta ANTES de que CUALQUIER petición sea enviada.
apiClient.interceptors.request.use(
  (config) => {
    // 4. Lee el token guardado en localStorage.
    const token = localStorage.getItem('token');
    
    // 5. Si el token existe...
    if (token) {
      // 6. ...lo añade al encabezado 'Authorization' de la petición.
      //    (Cumple el criterio de aceptación de la issue)
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 7. Devuelve la configuración modificada para que la petición continúe.
    return config;
  },
  (error) => {
    // Maneja errores de configuración de la petición
    return Promise.reject(error);
  }
);

// 8. Exporta la instancia configurada para usarla en las páginas.
export default apiClient;