import React from "react";

const Modal = ({ isVisible, onClose, result }) => {
  if (!isVisible) return null; // Si el modal no es visible, no se muestra

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>¡Test Completado!</h2>
        <p>Resultado: {result.area.area_name}</p>
        <p>Test: {result.test.test_name}</p>
        <p>{result.area.description}</p>
        <p>
          Fecha de finalización:{" "}
          {new Date(result.completion_date).toLocaleString()}
        </p>
        <button onClick={onClose} style={modalStyles.button}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

// Estilos básicos para el modal
const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "500px",
    width: "100%",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Modal;
