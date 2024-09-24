import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import "./TestList.css";
const TestList = () => {
  const [tests, setTests] = useState([]); // Estado para almacenar los tests
  const [loading, setLoading] = useState(true); // Estado para indicar si está cargando
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate(); // Hook para navegar

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await fetch("http://18.229.118.35:3002/api/tests"); // URL de tu API
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
        const data = await response.json();
        setTests(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleTakeTest = (testId) => {
    navigate(`/test/${testId}`); // Navega al componente de test con el ID
  };

  if (loading) {
    return <p>Cargando tests vocacionales...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="test-list-container">
      <h1 className="test-list-title">Listado de Tests Vocacionales</h1>
      <ul className="test-list">
        {tests.map((test) => (
          <li key={test.test_id} className="test-item">
            <h3 className="test-name">{test.test_name}</h3>
            <p className="test-description">{test.description}</p>
            <small className="test-date">
              Fecha de creación:{" "}
              {new Date(test.date_creation).toLocaleDateString()}
            </small>
            <br />
            <button
              className="test-button"
              onClick={() => handleTakeTest(test.test_id)}
            >
              Realizar Test
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestList;
