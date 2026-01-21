import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { formatResponse } from "@/utils/format";
import { WritingAPI } from "@/api/WritingTaskTwoAPI";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { getWritingTaskTwoFeedback } from "@/api/AIAPI";
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
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const { mutate: saveResult } = useSavePracticeResult();
  const [userSubmittedText, setUserSubmittedText] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await WritingAPI.getTaskTwoQuestions();
        setQuestions(data);
        setIsLoadingQuestions(false);
      } catch (err) {
        setQuestionsError(
          err instanceof Error ? err.message : "Unknown error occurred"
        );
        setIsLoadingQuestions(false);
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
      getWritingTaskTwoFeedback(formData.text, questions[currentQuestionIndex]),
    onError: (error) => toast.error(error.message),
    onSuccess: (data) => {
      setIA({
        ...ia,
        text: data!,
        response: true,
        loading: false,
      });

      const parsedFeedback = parseAIFeedback(data!);

      saveResult({
        type: "writing",
        task: "task-two",
        question: questions[currentQuestionIndex],
        userResponse: userSubmittedText,
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
    setUserSubmittedText(formData.text);
    mutate(formData);
  };

  const nextQuestion = () => {
    if (questions.length === 0) return;
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    resetExercise();
    reset({ text: "" });
  };

  const prevQuestion = () => {
    if (questions.length === 0) return;
    setCurrentQuestionIndex((prev) =>
      prev === 0 ? questions.length - 1 : prev - 1
    );
    resetExercise();
    reset({ text: "" });
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
        <ol className="list-decimal list-inside space-y-1 text-[#442e14]">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^\d+\.\s/, "")}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc list-inside space-y-1 text-[#442e14]">
          {lines.map((line, i) => (
            <li key={i}>{line.replace(/^(\-|\*)\s/, "")}</li>
          ))}
        </ul>
      );
    }

    return <p className="whitespace-pre-line text-[#442e14]">{content}</p>;
  }

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f4bc3c] mx-auto mb-4" />
          <p className="text-[#7f533b]">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">
              {" "}
              {questionsError} Using default questions.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-[#442e14] mb-2">
            Writing Practice: Task 2 ✍️
          </h1>
          <p className="text-[#7f533b] text-lg">Write an essay</p>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* SECCIÓN DE LA PREGUNTA */}
          <div className="bg-[#f1d49a]/40 p-6 rounded-2xl border border-[#f1d49a]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#f4bc3c] rounded-full flex items-center justify-center text-[#442e14] font-black text-sm">
                {currentQuestionIndex + 1}
              </div>
              <h2 className="text-lg font-bold text-[#442e14]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
            </div>

            {/* Instrucciones del examen */}
            <div className="bg-[#f4bc3c]/20 border border-[#f4bc3c]/40 p-3 rounded-xl mb-4 flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[#442e14]">
                <span className="font-bold">⏱️ Time:</span>
                <span>40 min</span>
              </div>
              <div className="w-px h-4 bg-[#f4bc3c]/40"></div>
              <div className="flex items-center gap-2 text-sm text-[#442e14]">
                <span className="font-bold">📝 Min words:</span>
                <span>250</span>
              </div>
            </div>

            {/* Pregunta */}
            <div className="bg-white/80 p-4 rounded-xl mb-4">
              <p className="text-[#442e14] whitespace-pre-line leading-relaxed">
                {questions[currentQuestionIndex]}
              </p>
            </div>

            {/* Key points */}
            <div className="bg-white/60 p-4 rounded-xl mb-6">
              <h4 className="font-bold text-[#442e14] text-sm mb-2 flex items-center gap-2">
                <span>✓</span> Key points to cover:
              </h4>
              <ul className="text-sm text-[#7f533b] space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#f4bc3c] mt-0.5">•</span>
                  <span>Clear introduction with thesis statement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f4bc3c] mt-0.5">•</span>
                  <span>Well-developed body paragraphs with examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f4bc3c] mt-0.5">•</span>
                  <span>Conclusion summarizing main points</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f4bc3c] mt-0.5">•</span>
                  <span>Formal academic tone throughout</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prevQuestion}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#f4bc3c] text-[#442e14] font-bold rounded-full hover:scale-105 transition shadow"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </button>

              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#f4bc3c] text-[#442e14] font-bold rounded-full hover:scale-105 transition shadow"
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* FORMULARIO O LOADING */}
          {!ia.loading && !ia.response && (
            <div className="bg-white border-2 border-[#f1d49a] p-6 rounded-2xl">
              <div className="mb-5 space-y-3">
                <label
                  className="text-sm uppercase font-bold text-[#442e14]"
                  htmlFor="text"
                >
                  📝 Your Essay:
                </label>
                <textarea
                  id="text"
                  placeholder="Write your essay here..."
                  rows={12}
                  className="w-full p-4 border-2 border-[#f1d49a] rounded-xl resize-none focus:outline-none focus:border-[#f4bc3c] transition text-[#442e14]"
                  {...register("text", {
                    required: "El texto es obligatorio",
                  })}
                />
                {errors.text && (
                  <ErrorMessage>{errors.text.message}</ErrorMessage>
                )}
              </div>

              <button
                type="button"
                onClick={handleSubmit(handleChangePassword)}
                className="bg-[#f4bc3c] w-full py-3 px-6 text-[#442e14] uppercase font-black hover:scale-105 cursor-pointer transition rounded-full shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={ia.loading}
              >
                Get AI Feedback
              </button>
            </div>
          )}

          {/* SPINNER */}
          {ia.loading && (
            <div className="bg-[#f1d49a]/30 border-2 border-[#f1d49a] rounded-2xl flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f4bc3c] mx-auto mb-4" />
                <p className="text-lg font-bold text-[#442e14]">
                  Processing your essay...
                </p>
                <p className="text-sm text-[#7f533b] mt-2">
                  AI is analyzing your writing
                </p>
              </div>
            </div>
          )}

          {/* PLACEHOLDER cuando hay respuesta */}
          {!ia.loading && ia.response && (
            <div className="bg-[#f1d49a]/20 border-2 border-dashed border-[#f4bc3c] rounded-2xl p-6 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#f4bc3c] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  ✅
                </div>
                <p className="text-[#442e14] font-bold mb-2">
                  Feedback received!
                </p>
                <p className="text-sm text-[#7f533b]">
                  Scroll down to see your results
                </p>
              </div>
            </div>
          )}
        </div>

        {/* MOSTRAR RESPUESTA DE IA */}
        {!ia.loading && ia.text && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xl">
                🤖
              </div>
              <h2 className="text-2xl font-black text-[#442e14]">
                AI Feedback & Analysis
              </h2>
            </div>

            {sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-[#f9f8f6] border-2 border-[#f1d49a] p-6 rounded-2xl"
              >
                <h3 className="font-black text-lg mb-3 text-[#f4bc3c] flex items-center gap-2">
                  <span className="w-6 h-6 bg-[#f4bc3c] text-[#442e14] rounded-full flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </span>
                  {section[0]}
                </h3>
                <div className="text-[#442e14]">
                  {renderContent(section.slice(1).join("\n"))}
                </div>
              </div>
            ))}

            {/* Botón para nueva práctica */}
            <div className="bg-[#f1d49a]/40 border-2 border-[#f4bc3c] rounded-2xl p-6 text-center">
              <p className="text-[#442e14] font-bold mb-4">
                Ready for another practice?
              </p>
              <button
                onClick={() => {
                  resetExercise();
                  reset({ text: "" });
                }}
                className="bg-[#f4bc3c] text-[#442e14] font-black px-8 py-3 rounded-full hover:scale-105 transition shadow-md"
              >
                Start New Practice →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
