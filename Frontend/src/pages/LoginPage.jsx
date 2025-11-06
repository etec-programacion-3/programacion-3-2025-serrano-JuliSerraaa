import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiClient from '../api/AxiosConfig.js'; // Usa nuestra instancia de Axios

function LoginPage() {
  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Estado para errores del backend

  // Hooks de React Router y de nuestro Contexto
  const navigate = useNavigate(); // Para redirigir al usuario
  const { login } = useAuth(); // Obtiene la función 'login' de nuestro AuthContext

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setError(null); // Limpia errores antiguos

    try {
      // 1. Llama a la API (Nota: solo '/auth/login', la base ya está en apiClient)
      const response = await apiClient.post('/auth/login', {
        email: email,
        password: password
      });

      // 2. Si la API responde bien, response.data tendrá el token
      const token = response.data.token;
      
      // 3. Llama a la función 'login' de nuestro AuthContext para guardar el token
      login(token);

      // 4. Redirige al usuario a la página principal (Productos)
      navigate('/');

    } catch (err) {
      // 5. Si la API falla (ej: 400 Credenciales inválidas)
      //    Guarda el mensaje de error del backend para mostrarlo
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  // Esto es JSX (HTML dentro de JavaScript)
  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email} // El valor del input está "atado" al estado
            onChange={(e) => setEmail(e.target.value)} // Actualiza el estado al escribir
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {/* Muestra el mensaje de error si 'error' no es nulo */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
}
export default LoginPage;