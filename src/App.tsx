import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Objective from "./components/Objective";
import TestComponent from "./components/TestComponent";
import Login from "./components/Login";
import TestList from "./components/TestList";
import Dashboard from "./components/Dashboard";
import Header from "./components/Header";
import CentroDeEstudios from "./components/CentroDeEstudios";
import UserCRUD from "./components/UserCRUD";
import DashboardBI from "./components/DashboardBI";

function App() {
  useEffect(() => {
    document.title = "PathwayEdu";
  }, []);

  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario
  const [userRoleId, setUserRoleId] = useState(""); // Estado para el rol del usuario

  useEffect(() => {
    // Cargar los datos del usuario desde el localStorage al iniciar la app
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(`${user.first_name} ${user.last_name}`);
      setUserRoleId(user.role_id);
    }
  }, []);

  const handleLogout = () => {
    setUserName(""); // Reinicia el nombre del usuario
    setUserRoleId(""); // Reinicia el rol del usuario
    localStorage.removeItem("user"); // Limpia el localStorage
  };

  return (
    <Router>
      <div className="App">
        <Header
          userName={userName}
          userRoleId={userRoleId}
          onLogout={handleLogout}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/objetivo" element={<Objective />} />
          <Route path="/test" element={<TestList />} />
          <Route path="/test/:testId" element={<TestComponent />} />
          <Route path="/login" element={<Login setUserName={setUserName} />} />
          <Route
            path="/dashboard-bi"
            element={
              localStorage.getItem("user") ? (
                <DashboardBI />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              localStorage.getItem("user") ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/centro-de-estudios" element={<CentroDeEstudios />} />
          <Route path="/user-management" element={<UserCRUD />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
