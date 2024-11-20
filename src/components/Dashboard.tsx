import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css"; // Asegúrate de incluir un archivo CSS para estilos

function Dashboard() {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    // Cargar los datos del usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="dashboard">
      <h1>BIENVENIDOS</h1>
      {user ? (
        <div className="container-grid">
          <Link to="/becas" className="card">
            <img
              src="../../public/images/imagesDashboard/becaDashboard.png"
              alt="Becas"
            />
            <h2>Becas</h2>
          </Link>
          <Link to="/programas" className="card">
            <img
              src="../../public/images/imagesDashboard/programasDashboard.png"
              alt="Programas"
            />
            <h2>Programas</h2>
          </Link>
          <Link to="/centro-de-estudios" className="card">
            <img
              src="../../public/images/imagesDashboard/universidadDashboard.png"
              alt="Centros De Estudios"
            />
            <h2>Centros De Estudios</h2>
          </Link>
        </div>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
}

export default Dashboard;
