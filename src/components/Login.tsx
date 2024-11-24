import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setUserName }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    date_of_birth: "",
    gender_id: 1,
    ubigeo_id: "",
    role_id: 1,
  });
  const [countries, setCountries] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_GATEWAY}/api/ubigeo/countries`
      );
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchDepartments = async (countryId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_GATEWAY
        }/api/ubigeo/departamentos/${countryId}`
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchProvinces = async (departmentId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_GATEWAY
        }/api/ubigeo/provincias/${departmentId}`
      );
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_GATEWAY}/api/ubigeo/ciudades/${provinceId}`
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_GATEWAY}/api/users/login`,
        {
          email,
          password,
        }
      );

      const { message, user } = response.data;

      if (message === "User logged in successfully") {
        setUserName(`${user.first_name} ${user.last_name}`);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirm_password) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password_hash: newUser.password,
        date_of_birth: newUser.date_of_birth,
        gender: { gender_id: newUser.gender_id },
        role: { role_id: newUser.role_id },
        ubigeo: { id: newUser.ubigeo_id },
      };

      await axios.post(
        `${import.meta.env.VITE_API_GATEWAY}/api/users`,
        userData
      );
      alert("Cuenta creada exitosamente. Por favor, inicie sesión.");
      setIsRegistering(false); // Cambiar de vuelta a inicio de sesión
    } catch (error) {
      console.error("Error al crear la cuenta:", error);
      setError("Hubo un problema al registrar la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {isRegistering ? (
        <>
          <h2>Crear Cuenta</h2>
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="first_name">Nombre</label>
              <input
                id="first_name"
                type="text"
                value={newUser.first_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, first_name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Apellido</label>
              <input
                id="last_name"
                type="text"
                value={newUser.last_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, last_name: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm_password">Confirmar Contraseña</label>
              <input
                id="confirm_password"
                type="password"
                value={newUser.confirm_password}
                onChange={(e) =>
                  setNewUser({ ...newUser, confirm_password: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="date_of_birth">Fecha de Nacimiento</label>
              <input
                id="date_of_birth"
                type="date"
                value={newUser.date_of_birth}
                onChange={(e) =>
                  setNewUser({ ...newUser, date_of_birth: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Género</label>
              <select
                value={newUser.gender_id}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    gender_id: parseInt(e.target.value),
                  })
                }
              >
                <option value="1">Masculino</option>
                <option value="2">Femenino</option>
              </select>
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select
                value={newUser.role_id}
                onChange={(e) =>
                  setNewUser({ ...newUser, role_id: parseInt(e.target.value) })
                }
              >
                <option value="1">Estudiante</option>
                <option value="2">Profesor</option>
              </select>
            </div>
            <div className="form-group">
              <label>País</label>
              <select
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  fetchDepartments(e.target.value);
                }}
              >
                <option value="">Seleccionar País</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Departamento</label>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  fetchProvinces(e.target.value);
                  setNewUser({ ...newUser, ubigeo_id: "" }); // Reset Ubigeo
                }}
              >
                <option value="">Seleccionar Departamento</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Provincia</label>
              <select
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  fetchCities(e.target.value);
                }}
              >
                <option value="">Seleccionar Provincia</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Ciudad</label>
              <select
                value={newUser.ubigeo_id}
                onChange={(e) =>
                  setNewUser({ ...newUser, ubigeo_id: e.target.value })
                }
              >
                <option value="">Seleccionar Ciudad</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>
            <div class="spacer"></div>
            <button
              type="button"
              className="switch-form-button"
              onClick={() => setIsRegistering(false)}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          </form>
        </>
      ) : (
        <>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleLoginSubmit}>
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
            <div class="spacer"></div>
            <button
              type="button"
              className="switch-form-button"
              onClick={() => setIsRegistering(true)}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
