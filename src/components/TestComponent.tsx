import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TestComponent.css";
import { useParams } from "react-router-dom"; // Importar useParams
import Modal from "./Modal"; // Importar el componente Modal

function TestComponent() {
  const { testId } = useParams(); // Captura el testId de la URL
  const [test, setTest] = useState(null);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null); // Estado para el resultado
  const [isModalVisible, setModalVisible] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_GATEWAY}/api/tests/all/${testId}`) // Usa backticks para interpolar la variable testId
      .then((response) => {
        setTest(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener el test:", error);
      });
  }, [testId]); // Añadir testId como dependencia del useEffect

  // Manejo de respuestas
  const handleAnswerChange = (questionId, answerId) => {
    setResponses({
      ...responses,
      [questionId]: answerId,
    });
  };

  // Envío de respuestas
  const handleSubmit = () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const data = {
      userId: userId,
      testId: test.test_id,
      responses: Object.keys(responses).map((questionId) => ({
        question_id: questionId,
        answer_id: responses[questionId],
      })),
    };
    console.log("Enviando al backend:", JSON.stringify(data, null, 2));

    axios
      .post(
        import.meta.env.VITE_API_GATEWAY + "/api/user-test-results/submit",
        data
      )
      .then((response) => {
        console.log("Resultados guardados:", response.data);
        setResult(response.data); // Guardar el resultado en el estado
        setModalVisible(true); // Mostrar el modal
      })
      .catch((error) => {
        console.error("Error al enviar respuestas:", error);
      });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (!test) return <div>Cargando test...</div>;

  // Renderizado
  return (
    <div className="test-container">
      <h1>{test.test_name}</h1>
      <p>{test.description}</p>
      {test.questions.map((question) => (
        <div key={question.question_id}>
          <h3>{question.question_text}</h3>
          {question.answers.map((answer) => (
            <div key={answer.answer_id}>
              <label>
                <input
                  type="radio"
                  name={`question-${question.question_id}`}
                  value={answer.answer_id}
                  onChange={() =>
                    handleAnswerChange(question.question_id, answer.answer_id)
                  }
                />
                {answer.answer_text}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Enviar Respuestas</button>

      {/* Mostrar el Modal solo si hay un resultado */}
      {result && (
        <Modal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          result={result}
        />
      )}
    </div>
  );
}

export default TestComponent;
