import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="left-column">
        <h1>============== PathwayEdu ==============</h1>
      </div>
      <div className="right-column">
        <img src={"/imagen_home.png"} alt="Imagen de pantalla principal" />
      </div>
    </div>
  );
}

export default Home;
