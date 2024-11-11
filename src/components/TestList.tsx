import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TestList.css";

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_GATEWAY}/api/tests`
        );
        setTests(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleTakeTest = (testId) => {
    navigate(`/test/${testId}`);
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
