import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({
  userName,
  onLogout,
}: {
  userName: string;
  onLogout: () => void;
}) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    onLogout();
    navigate("/"); // Redirige al menú principal
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Cierra el menú al hacer clic fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img
                src="/logoHeader.jpg"
                alt="PathwayEdu Logo"
                width="100"
                height="20"
                className="logo"
              />
            </Link>
          </li>
          <li>
            <Link to="/objetivo">Objetivo</Link>
          </li>
          <li>
            <Link to="/test">Test</Link>
          </li>
          {userName && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>
      </nav>
      {userName ? (
        <div className="user-icon" ref={dropdownRef}>
          <div onClick={toggleDropdown}>
            <img src="https://via.placeholder.com/40" alt="User Icon" />
            <span>{userName}</span>
          </div>
          {isDropdownOpen && (
            <div className="logout-dropdown">
              <ul>
                <li>
                  <Link
                    to="/user-management"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Gestión de usuarios
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Cerrar sesión</button>
                </li>
              </ul>
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
