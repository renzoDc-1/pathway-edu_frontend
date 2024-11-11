import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TestComponent.css";
import { useParams } from "react-router-dom";
import Modal from "./ModalResultTest";
import { DEFAULT_USER_ID } from "../config/constants"; // Importar la constante global

function TestComponent() {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const [userId, setUserId] = useState(DEFAULT_USER_ID); // Usar la constante aquí

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserId(user.id || DEFAULT_USER_ID); // Usar la constante en caso de que no haya un ID
    }

    axios
      .get(`${import.meta.env.VITE_API_GATEWAY}/api/tests/all/${testId}`)
      .then((response) => {
        setTest(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener el test:", error);
      });
  }, [testId]);

  const handleAnswerChange = (questionId, answerId) => {
    setResponses({
      ...responses,
      [questionId]: answerId,
    });
  };

  const handleSubmit = () => {
    const data = {
      userId: userId,
      testId: test.test_id,
      responses: Object.keys(responses).map((questionId) => ({
        question_id: questionId,
        answer_id: responses[questionId],
      })),
    };

    axios
      .post(
        import.meta.env.VITE_API_GATEWAY + "/api/user-test-results/submit",
        data
      )
      .then((response) => {
        setResult(response.data);
        setModalVisible(true);
      })
      .catch((error) => {
        console.error("Error al enviar respuestas:", error);
      });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (!test) return <div>Cargando test...</div>;

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
