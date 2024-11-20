import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [disciplines, setDisciplines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_GATEWAY}/api/areas`)
      .then((response) => {
        setDisciplines(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener las áreas:", error);
      });
  }, []);

  const handleDisciplineClick = (area_id) => {
    navigate(`/centro-de-estudios?area=${area_id}`);
  };

  return (
    <div className="home-container">
      <div className="left-column">
        <h2>Encuentra el estudio de tus sueños</h2>
      </div>

      <div className="right-column">
        <img
          src={"/imagen_home.png"}
          alt="Imagen de pantalla principal"
          width="300"
          height="200"
        />
      </div>

      <h2 className="left-aligned-text">Navega por disciplinas</h2>
      <div className="disciplines-grid">
        {disciplines.map((discipline) => (
          <div
            key={discipline.area_id}
            className="discipline-card"
            onClick={() => handleDisciplineClick(discipline.area_id)}
          >
            <img
              src={`/images/disciplines/${discipline.area_name}.svg`}
              alt={`${discipline.area_name} icon`}
              className="discipline-icon"
            />
            <p className="discipline-label">{discipline.area_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
