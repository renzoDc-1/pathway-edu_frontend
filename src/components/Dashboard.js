import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Asegúrate de incluir un archivo CSS para estilos

function Dashboard() {
  const [user, setUser] = useState(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    // Cargar los datos del usuario desde localStorage
    const storedUser = localStorage.getItem('user');
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
            <img src="https://via.placeholder.com/150" alt="Becas" />
            <h2>Becas</h2>
          </Link>
          <Link to="/programas" className="card">
            <img src="https://via.placeholder.com/150" alt="Programas" />
            <h2>Programas</h2>
          </Link>
          <Link to="/talleres" className="card">
            <img src="https://via.placeholder.com/150" alt="Talleres" />
            <h2>Talleres</h2>
          </Link>
          <Link to="/eventos" className="card">
            <img src="https://via.placeholder.com/150" alt="Eventos" />
            <h2>Eventos</h2>
          </Link>
        </div>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </div>
  );
}

export default Dashboard;
