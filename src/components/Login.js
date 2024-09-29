import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUserName }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para manejar el envío del formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://54.233.12.246:3000/api/users/login",
        {
          email,
          password,
        }
      );

      const { message, user } = response.data;

      if (message === "User logged in successfully") {
        setUserName(`${user.first_name} ${user.last_name}`);
        localStorage.setItem("user", JSON.stringify(user)); // Guardar datos del usuario en localStorage
        navigate("/dashboard"); // Redirigir al Dashboard
      } else {
        setError("Credenciales inválidas");
      }
    } catch (error) {
      console.error("Error al enviar las credenciales:", error);
      setError("Hubo un problema con el servidor.");
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
        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}

export default Login;
