import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Asegúrate de tener estilos en este archivo

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(null);

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserName(null);

    try {
      const response = await axios.post('http://18.229.118.35:3001/api/users/login', {
        email,
        password,
      });

      // Verificamos el mensaje en la respuesta
      const { message, user } = response.data;

      if (message === "User logged in successfully") {
        // Uso correcto de template literals
        setUserName(`${user.first_name} ${user.last_name}`);
        alert(`Bienvenido, ${user.first_name} ${user.last_name}!`);
        // Aquí podrías redirigir al usuario o almacenar un token
        // Ejemplo: window.location.href = '/dashboard';
      } else if (message === "Invalid credentials") {
        setError('Credenciales inválidas');
      } else {
        setError('Ocurrió un error inesperado');
      }

    } catch (error) {
      console.error('Error al enviar las credenciales:', error);
      setError('Hubo un problema con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {userName && <p className="welcome-message">Bienvenido, {userName}!</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}

export default Login;
