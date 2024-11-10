import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ userName, onLogout }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Estado para mostrar/ocultar el menú
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Ejecuta la función de cierre de sesión
    navigate('/'); // Redirige al menú principal
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen); // Cambia el estado del dropdown
  };

  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/objetivo">Objetivo</Link></li>
          <li><Link to="/test">Test</Link></li>
          {userName && <li><Link to="/dashboard">Dashboard</Link></li>}
        </ul>
      </nav>
      {userName ? (
        <div className="user-icon" onClick={toggleDropdown}>
          <img src="https://via.placeholder.com/40" alt="User Icon" />
          <span>{userName}</span>
          {isDropdownOpen && (
            <div className="logout-dropdown">
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      ) : (
        <div className="button">
          <Link to="/login">
            <button>Iniciar sesión</button>
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;

