import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Objective from './components/Objective';
import TestComponent from './components/TestComponent';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario

  useEffect(() => {
    // Cargar los datos del usuario desde el localStorage al iniciar la app
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(`${user.first_name} ${user.last_name}`);
    }
  }, []);

  const handleLogout = () => {
    setUserName(""); // Reinicia el nombre del usuario
    localStorage.removeItem('user'); // Limpia el localStorage
  };

  return (
    <Router>
      <div className="App">
        <Header userName={userName} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/objetivo" element={<Objective />} />
          <Route path="/test" element={<TestComponent />} />
          <Route path="/login" element={<Login setUserName={setUserName} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
