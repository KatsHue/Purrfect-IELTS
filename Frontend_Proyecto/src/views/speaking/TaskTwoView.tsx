import { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

export default function SpeakingView() {
  // Preguntas de ejemplo
  const questions = [
    "Describe your favorite vacation destination",
    "What are your career goals for the next 5 years?",
    "Explain a challenging situation you've faced and how you handled it",
  ];

  // Estado para la pregunta actual
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Función para cambiar a la siguiente pregunta
  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Speaking Practice
      </h1>

      {/* Sección de Pregunta */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Question {currentQuestionIndex + 1}/{questions.length}
        </h2>
        <p className="text-lg mb-6">{questions[currentQuestionIndex]}</p>

        <button
          onClick={nextQuestion}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Next Question <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
