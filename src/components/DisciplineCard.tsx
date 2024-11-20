// DisciplineCard.js
import React from "react";
import { useHistory } from "react-router-dom";

function DisciplineCard({ icon, label, url }) {
  const history = useHistory();

  const handleClick = () => {
    history.push(url); // Cambia la URL cuando se hace clic
  };

  return (
    <div className="discipline-card" onClick={handleClick}>
      <img src={icon} alt={`${label} icon`} className="discipline-icon" />
      <p className="discipline-label">{label}</p>
    </div>
  );
}

export default DisciplineCard;
