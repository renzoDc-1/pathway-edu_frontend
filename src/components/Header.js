import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/objetivo">Nuestro Objetivo</Link></li>
          <li><Link to="/test">Realizar Test</Link></li>
          <li><Link to="/login">Iniciar Sesión</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
