import React from "react";
import { Navigate } from "react-router-dom";
import "./Home.css";

function DashboardBI() {
  // Obtén el usuario del localStorage
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    // Redirige a login si no hay usuario almacenado
    return <Navigate to="/login" />;
  }

  const user = JSON.parse(storedUser);

  if (user.role.role_id !== 3) {
    // Redirige a login si el user_id no es 3
    console.log(user);
    return <Navigate to="/" />;
  }

  // Renderiza el iframe solo si el user_id es 3
  return (
    <div className="dashboard-bi">
      <iframe
        title="data"
        width="1240"
        height="800"
        src="https://app.powerbi.com/reportEmbed?reportId=e55813ba-62f8-4342-a7a5-e7e7a44cfcc5&autoAuth=true&ctid=717b9a79-1b91-41ab-a6f7-a579b46a9b41"
        style={{ marginTop: "20px", border: "none" }}
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default DashboardBI;
