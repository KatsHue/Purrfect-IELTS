import { useState, useRef, useEffect } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MicrophoneIcon,
  ArrowPathIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
import { SpeakingAPI } from "@/api/SpeakingTaskOneAPI";
import { transcriptionAI } from "@/api/TranscriptionAI";
import { useSavePracticeResult } from "@/hooks/useSavePracticeResult";
import { getSpeakingFeedback } from "@/api/AIAPI";
import { formatResponse } from "@/utils/format";
import { parseAIFeedback } from "@/utils/parseAIFeedback";

export default function SpeakingView() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [showImproved, setShowImproved] = useState(false);
  const [improvedText, setImprovedText] = useState<[string, string][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mutate: saveResult } = useSavePracticeResult();

  const [recordingStartTime, setRecordingStartTime] = useState(120);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await SpeakingAPI.getTaskOneQuestions();
        setQuestions(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setIsLoading(false);
        setQuestions([
          "Describe your favorite vacation destination",
          "What are your career goals for the next 5 years?",
          "Explain a challenging situation you've faced and how you handled it",
        ]);
      }
    };
    fetchQuestions();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioUrl(URL.createObjectURL(audioBlob));
        setIsRecording(false);

        try {
          setIsProcessing(true);
          const text = await transcriptionAI(audioBlob);

          if (text.trim() === "/ Please check the submitted text /") {
            setTranscription("⚠️ Unable to process audio. Please try again.");
            setIsProcessing(false);
            return;
          }

          setTranscription(text);

          const feedback = await getSpeakingFeedback(
            text,
            questions[currentQuestionIndex]
          );

          if (feedback!.includes("/ Please check the submitted text /")) {
            setTranscription(
              "⚠️ The recording seems unclear or not in English. Try again."
            );
            setIsProcessing(false);
            return;
          }

          const formatted = formatResponse(feedback!);
          setImprovedText(formatted);
          setShowImproved(true);

          const parsedFeedback = parseAIFeedback(feedback!);
          const recordingDuration = recordingStartTime - recordingTime; // Tiempo usado

          saveResult({
            type: "speaking",
            task: "task-one",
            question: questions[currentQuestionIndex],
            userResponse: text,
            aiFeedback: feedback!,
            estimatedBand: parsedFeedback.estimatedBand,
            identifiedErrors: parsedFeedback.identifiedErrors,
            metadata: {
              taskRelevance: parsedFeedback.metadata?.taskRelevance,
              recordingDuration: recordingDuration,
            },
          });
        } catch (err) {
          console.error("Error generando transcripción o feedback:", err);
          setTranscription(
            "⚠️ There was an issue processing your audio. Please record again."
          );
        } finally {
          setIsProcessing(false);
        }
      }; 

      mediaRecorderRef.current.start();
      setIsRecording(true);
      audioChunksRef.current = [];

      setRecordingStartTime(120);
      setRecordingTime(120);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Generar versión mejorada
  const generateImprovedVersion = () => {
    // const mockImproved = `Aquí va a ir la versión mejorada de la respuesta anterior:\n\n"${transcription}"\n\nSe mostrarán:\n• las correciones hechas\n• Los cambios\n• Tal vez una explicación`;
    console.log(audioUrl)
    
    setShowImproved(true);
  };

  // Reproducir grabación
  const playRecording = async() => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const text = await transcriptionAI(audioBlob);
      setTranscription(text);
    }
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

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
    setTranscription("");
    setAudioUrl("");
    setRecordingTime(0);
    setShowImproved(false);
    setImprovedText([]);
    setIsProcessing(false);
    audioChunksRef.current = [];
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          ?.getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            {error} Using default questions.
          </span>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
          <strong className="font-bold">No questions available</strong>
          <span className="block sm:inline"> Please try again later.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Speaking Practice </h1>

      {/* Pregunta */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Question {currentQuestionIndex + 1}/{questions.length}
        </h2>
        <p className="text-lg mb-6">{questions[currentQuestionIndex]}</p>

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

      {/* Grabación */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Record Your Answer
        </h2>

        {isProcessing ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Processing your recording...</p>
          </div>
        ) : !isRecording && !transcription ? (
          <button
            onClick={startRecording}
            className="flex items-center justify-center gap-2 w-full py-3 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-700 transition"
          >
            <MicrophoneIcon className="h-5 w-5" />
            Start Recording (Max 2 minutes)
          </button>
        ) : isRecording ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-pulse bg-red-500 rounded-full h-4 w-4"></div>
              <span className="font-mono text-lg">
                {Math.floor(recordingTime / 60)}:
                {String(recordingTime % 60).padStart(2, "0")}
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
            >
              <StopIcon className="h-5 w-5" />
              Stop Recording
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-2">{transcription ? 'Transcripción' : 'Analiza primero tu audio'}</h3>
              <p className="whitespace-pre-line">{transcription ? transcription : ' '}</p>
            </div>

            {audioUrl && (
              <button
                onClick={playRecording}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                <PlayIcon className="h-5 w-5" />
                Play Your Recording
              </button> )}
          </div>
        )}
      </div>
      <audio ref={audioRef} src={audioUrl} hidden /><audio ref={audioRef} src={audioUrl} hidden />
      {/* Sección de Improved Version */}
      {showImproved && (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Improved Version
          </h2>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Original:</h3>
            <p className="mb-4 text-gray-700 whitespace-pre-line">
              {transcription}
            </p>

            <h3 className="font-medium text-blue-800 mb-2">Improved:</h3>
            <p className="text-blue-900 whitespace-pre-line">{improvedText}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetExercise}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Try Again
            </button>
            <button
              onClick={nextQuestion}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              disabled={questions.length <= 1}
            >
              Next Question <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
