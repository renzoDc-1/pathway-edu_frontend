import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserCRUD.css";

// Definición de tipos
interface Ubigeo {
  id: string;
  name: string;
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  date_of_birth: string;
  gender_id: number;
  role_id: number;
  ubigeo_id: string; // Agregamos el ID del Ubigeo
}

interface NewUser {
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  date_of_birth: string;
  gender_id: number;
  ubigeo_id: string;
  role_id: number;
}

interface CurrentUser {
  role: {
    role_id: number;
    role_name: string;
  };
}

function UserCRUD() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({
    first_name: "",
    last_name: "",
    email: "",
    password_hash: "",
    date_of_birth: "",
    gender_id: 1,
    ubigeo_id: "",
    role_id: 1,
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState<Ubigeo[]>([]);
  const [departments, setDepartments] = useState<Ubigeo[]>([]);
  const [provinces, setProvinces] = useState<Ubigeo[]>([]);
  const [cities, setCities] = useState<Ubigeo[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const currentUser: CurrentUser = {
    role: {
      role_id: 3,
      role_name: "admin",
    },
  };

  useEffect(() => {
    if (currentUser.role.role_id === 1) {
      alert("Acceso denegado. No tienes permisos para gestionar usuarios.");
      navigate("/");
    }
  }, [navigate, currentUser.role.role_id]);

  useEffect(() => {
    fetchUsers();
    fetchCountries();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>(
        `${import.meta.env.VITE_API_GATEWAY}/api/users`
      );
      console.log("Usuarios obtenidos:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get<Ubigeo[]>(
        `${import.meta.env.VITE_API_GATEWAY}/api/ubigeo/countries`
      );
      setCountries(response.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchDepartments = async (countryId: string) => {
    try {
      const response = await axios.get<Ubigeo[]>(
        `${
          import.meta.env.VITE_API_GATEWAY
        }/api/ubigeo/departamentos/${countryId}`
      );
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchProvinces = async (departmentId: string) => {
    try {
      const response = await axios.get<Ubigeo[]>(
        `${
          import.meta.env.VITE_API_GATEWAY
        }/api/ubigeo/provincias/${departmentId}`
      );
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchCities = async (provinceId: string) => {
    try {
      const response = await axios.get<Ubigeo[]>(
        `${import.meta.env.VITE_API_GATEWAY}/api/ubigeo/ciudades/${provinceId}`
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  const createUser = async () => {
    if (
      !newUser.first_name ||
      !newUser.last_name ||
      !newUser.email ||
      !newUser.password_hash ||
      !newUser.date_of_birth
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const userData = {
      ...newUser,
      gender: { gender_id: newUser.gender_id },
      role: { role_id: newUser.role_id },
      ubigeo: { id: newUser.ubigeo_id },
    };

    try {
      console.log("Creando usuario:", userData);
      await axios.post(
        `${import.meta.env.VITE_API_GATEWAY}/api/users`,
        userData
      );
      fetchUsers();
      setNewUser({
        first_name: "",
        last_name: "",
        email: "",
        password_hash: "",
        date_of_birth: "",
        gender_id: 1,
        role_id: 1,
        ubigeo_id: "",
      });
    } catch (error: any) {
      console.error(
        "Error creating user:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Error al crear el usuario. Verifica la consola para más detalles."
      );
    }
  };

  const updateUser = async (id: number) => {
    if (!editingUser) return;

    if (
      !editingUser.first_name ||
      !editingUser.last_name ||
      !editingUser.email ||
      !editingUser.password_hash ||
      !editingUser.date_of_birth
    ) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const updatedUserData = {
      ...editingUser,
      gender: { gender_id: editingUser.gender_id },
      role: { role_id: editingUser.role_id },
    };

    try {
      console.log("Actualizando usuario:", updatedUserData);
      await axios.put(
        `${import.meta.env.VITE_API_GATEWAY}/api/users/${id}`,
        updatedUserData
      );
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      alert(
        "Error al actualizar el usuario. Verifica la consola para más detalles."
      );
    }
  };

  const deleteUser = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_GATEWAY}/api/users/${id}`
        );
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert(
          "Error al eliminar el usuario. Verifica la consola para más detalles."
        );
      }
    }
  };

  return (
    <div className="user-crud">
      <h2>Gestión de Usuarios</h2>

      <div className="create-user">
        <h3>Crear Nuevo Usuario</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={newUser.first_name}
          onChange={(e) =>
            setNewUser({ ...newUser, first_name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Apellido"
          value={newUser.last_name}
          onChange={(e) =>
            setNewUser({ ...newUser, last_name: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={newUser.password_hash}
            onChange={(e) =>
              setNewUser({ ...newUser, password_hash: e.target.value })
            }
          />
          <span
            className="password-eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </span>
        </div>

        <input
          type="date"
          placeholder="Fecha de Nacimiento"
          value={newUser.date_of_birth}
          onChange={(e) =>
            setNewUser({ ...newUser, date_of_birth: e.target.value })
          }
        />
        <select
          value={newUser.gender_id}
          onChange={(e) =>
            setNewUser({ ...newUser, gender_id: parseInt(e.target.value) })
          }
        >
          <option value="1">Masculino</option>
          <option value="2">Femenino</option>
        </select>
        <select
          value={newUser.role_id}
          onChange={(e) =>
            setNewUser({ ...newUser, role_id: parseInt(e.target.value) })
          }
        >
          <option value="1">Estudiante</option>
          <option value="2">Profesor</option>
          <option value="3">Admin</option>
        </select>
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            fetchDepartments(e.target.value);
            setNewUser({ ...newUser, ubigeo_id: "" }); // Reset Ubigeo
          }}
        >
          <option value="">Seleccionar País</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
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
        <select
          value={selectedProvince}
          onChange={(e) => {
            setSelectedProvince(e.target.value);
            fetchCities(e.target.value);
            setNewUser({ ...newUser, ubigeo_id: "" }); // Reset Ubigeo
          }}
        >
          <option value="">Seleccionar Provincia</option>
          {provinces.map((province) => (
            <option key={province.id} value={province.id}>
              {province.name}
            </option>
          ))}
        </select>
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
        <button onClick={createUser}>Crear Usuario</button>
      </div>

      <div className="user-list">
        <h3>Lista de Usuarios</h3>
        <ul>
          {users.map((user) => (
            <li key={user.user_id}>
              {editingUser && editingUser.user_id === user.user_id ? (
                <div>
                  <input
                    type="text"
                    value={editingUser.first_name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        first_name: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={editingUser.last_name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        last_name: e.target.value,
                      })
                    }
                  />
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                  />
                  <div className="password-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={editingUser.password_hash}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          password_hash: e.target.value,
                        })
                      }
                    />
                    <span
                      className="password-eye"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      👁️
                    </span>
                  </div>
                  <input
                    type="date"
                    value={editingUser.date_of_birth}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                  {currentUser.role.role_id === 3 && (
                    <select
                      value={editingUser.role_id}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role_id: parseInt(e.target.value),
                        })
                      }
                    >
                      <option value="1">Estudiante</option>
                      <option value="2">Profesor</option>
                      <option value="3">Admin</option>
                    </select>
                  )}
                  <button onClick={() => updateUser(user.user_id)}>
                    Guardar
                  </button>
                  <button onClick={() => setEditingUser(null)}>Cancelar</button>
                </div>
              ) : (
                <div>
                  <span>
                    {user.first_name} {user.last_name} - {user.email}
                  </span>
                  <button onClick={() => setEditingUser(user)}>Editar</button>
                  <button onClick={() => deleteUser(user.user_id)}>
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default UserCRUD;
