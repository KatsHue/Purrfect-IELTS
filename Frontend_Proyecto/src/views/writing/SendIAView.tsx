import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getResponseIA } from "@/api/AIAPI";
import { useEffect, useState } from "react";
import { formatResponse } from "@/utils/format";
import { WritingAPI } from "@/api/WritingTaskOneAPI";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useSavePracticeResult } from "@/hooks/useSavePracticeResult";
import { parseAIFeedback } from "@/utils/parseAIFeedback";

export type IAForm = {
  text: string;
};

export default function SendIAView() {
  const initialValues: IAForm = {
    text: "",
  };

  const [ia, setIA] = useState({
    text: "",
    response: false,
    loading: false,
  });

  const [sections, setSections] = useState<string[][]>([]);

  // NUEVOS ESTADOS PARA LAS PREGUNTAS
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  // para guardar resultados
  const { mutate: saveResult } = useSavePracticeResult();

  // guardar el texto del usuario
  const [userSubmittedText, setUserSubmittedText] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  // CARGAR PREGUNTAS AL INICIAR
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await WritingAPI.getTaskOneQuestions();
        setQuestions(data);
        setIsLoadingQuestions(false);
      } catch (err) {
        setQuestionsError(
          err instanceof Error ? err.message : "Unknown error occurred"
        );
        setIsLoadingQuestions(false);
        // Preguntas por defecto en caso de error
        setQuestions([
          "Some people think that parents should teach children how to be good members of society. Others believe that school is the place to learn this. Discuss both views and give your own opinion.",
          "In some countries, young people are encouraged to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages for young people who decide to do this.",
        ]);
      }
    };
    fetchQuestions();
  }, []);

  const { mutate } = useMutation({
    mutationFn: (formData: IAForm) =>
      getResponseIA(formData, questions[currentQuestionIndex]),
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      setIA({
        ...ia,
        text: data!,
        response: true,
        loading: false,
      });

      // Guardar resultado en la base de datos
      const parsedFeedback = parseAIFeedback(data!);

      saveResult({
        type: "writing",
        task: "task-one", // Task 1 es para cartas
        question: questions[currentQuestionIndex],
        userResponse: userSubmittedText, // El texto que envió el usuario
        aiFeedback: data!,
        estimatedBand: parsedFeedback.estimatedBand,
        identifiedErrors: parsedFeedback.identifiedErrors,
        bulletPointsCovered: parsedFeedback.bulletPointsCovered,
        metadata: {
          toneType: parsedFeedback.metadata?.toneType,
          taskRelevance: parsedFeedback.metadata?.taskRelevance,
        },
      });
    },
  });

  useEffect(() => {
    if (ia.text) {
      const formatted = formatResponse(ia.text);
      setSections(formatted);
    }
  }, [ia.text]);

  const handleChangePassword = (formData: IAForm) => {
    setIA({ ...ia, loading: true });
    // Guardar el texto del usuario antes de enviarlo
    setUserSubmittedText(formData.text);
    mutate(formData);
  };

  // FUNCIONES PARA NAVEGAR ENTRE PREGUNTAS
  const nextQuestion = () => {
    if (questions.length === 0) return;
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    resetExercise();
  };

  const prevQuestion = () => {
    if (questions.length === 0) return;
    setCurrentQuestionIndex((prev) =>
      prev === 0 ? questions.length - 1 : prev - 1
    );
    resetExercise();
  };

  const resetExercise = () => {
    setIA({
      text: "",
      response: false,
      loading: false,
    });
    setSections([]);
    setUserSubmittedText("");
  };

  function renderContent(content: string) {
    const lines = content.split("\n").filter((line) => line.trim() !== "");

    if (lines.every((l) => /^(\d+\.\s|\-\s|\*\s)/.test(l.trim()))) {
      const isOrdered = lines.every((l) => /^\d+\./.test(l.trim()));
      return isOrdered ? (
        <ol className="list-decimal list-inside space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^\d+\.\s/, "")}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc list-inside space-y-1">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^(\-|\*)\s/, "")}</li>
          ))}
        </ul>
      );
    }

    return <p className="whitespace-pre-line">{content}</p>;
  }

  // MOSTRAR LOADING DE PREGUNTAS
  if (isLoadingQuestions) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  // MOSTRAR ERROR SI HAY
  if (questionsError) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            {questionsError} Using default questions.
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-3xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Writing Practice: Task 1 - Write a letter
        </h1>

        {/* SECCIÓN DE LA PREGUNTA */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Question {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <p className="text-lg mb-6 whitespace-pre-line">
            {questions[currentQuestionIndex]}
          </p>

          <div className="flex gap-3">
            <button
              onClick={prevQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous Question
            </button>

            <button
              onClick={nextQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
            >
              Next Question <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="text">
              Your Letter:
            </label>
            <textarea
              id="text"
              placeholder="Write your letter here..."
              rows={10}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none"
              {...register("text", {
                required: "El texto es obligatorio",
              })}
            />
            {errors.text && <ErrorMessage>{errors.text.message}</ErrorMessage>}
          </div>

          <input
            type="submit"
            value="Get Feedback"
            className={`bg-sky-600 w-full p-3 text-white uppercase font-bold hover:bg-sky-700 cursor-pointer transition-colors rounded-md ${
              ia.loading ? " opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={ia.loading}
          />
        </form>

        {/* spinner */}
        {ia.loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-600">
              Processing your letter...
            </p>
          </div>
        )}

        {/* Mostrar respuesta  */}
        {!ia.loading && ia.text && (
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div key={idx} className="p-4 bg-gray-100 rounded-lg shadow">
                <h1 className="font-bold text-lg mb-2 text-yellow-600">
                  {section[0]}
                </h1>
                {renderContent(section.slice(1).join("\n"))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
