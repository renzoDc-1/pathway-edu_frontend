import React, { useEffect, useState } from "react";
import axios from "axios";
import './TestComponent.css';

function TestComponent() {
  const [test, setTest] = useState(null);
  const [responses, setResponses] = useState({});

  //llamada a API
  useEffect(() => {
    //axios.get("http://localhost:3000/api/v2/tests/all/3a377535-49be-4e4e-96d1-461365fc93bf")
    axios.get("http://18.229.118.35:3002/api/tests/all/125a02c5-3778-4a0e-b6ff-bcca05c1d4a9")
      .then(response => {
        setTest(response.data);
      })
      .catch(error => {
        console.error("Error al obtener el test:", error);
      });
  }, []);
//manejo de respuestas
  const handleAnswerChange = (questionId, answerId) => {
    setResponses({
      ...responses,
      [questionId]: answerId
    });
  };
//envio de respuestas
  const handleSubmit = () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const data = {
      userId: userId,
      testId: test.test_id,
      responses: Object.keys(responses).map(questionId => ({
        question_id: questionId,
        answer_id: responses[questionId]
      }))
    };
    console.log("Enviando al backend:", JSON.stringify(data, null, 2));

    //axios.post("http://localhost:3000/api/v2/user-test-results/submit", data)
    axios.post("http://15.228.39.0:3000/api/v2/user-test-results/submit", data)
      .then(response => {
        console.log("Resultados guardados:", response.data);
      })
      .catch(error => {
        console.error("Error al enviar respuestas:", error);
      });
  };

  if (!test) return <div>Cargando test...</div>;
//renderizado
  return (
    <div className="test-container">
      <h1>{test.test_name}</h1>
      <p>{test.description}</p>
      {test.questions.map((question) => (
        <div key={question.question_id}>
          <h3>{question.question_text}</h3>
          {question.answers.map((answer) => (
            <label key={answer.answer_id}>
              <input
                type="radio"
                name={`question-${question.question_id}`}
                value={answer.answer_id}
                onChange={() => handleAnswerChange(question.question_id, answer.answer_id)}
              />
              {answer.answer_text}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Enviar Respuestas</button>
    </div>
  );
}

export default TestComponent;
