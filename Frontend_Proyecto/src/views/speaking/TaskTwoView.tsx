import { useState, useRef, useEffect } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MicrophoneIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
import { SpeakingTaskTwoAPI } from "@/api/SpeakingTaskTwoAPI";
import { transcriptionAI } from "@/api/TranscriptionAI";
import { getSpeakingTaskTwoFeedback } from "@/api/AIAPI";
import { formatResponse } from "@/utils/format";

export default function SpeakingViewTaskTwo() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [showImproved, setShowImproved] = useState(false);
  const [improvedText, setImprovedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 🔹 Cargar preguntas Task 2 en orden
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await SpeakingTaskTwoAPI.getTaskTwoQuestions(); // endpoint Task 2
        setQuestions(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setIsLoading(false);
        setQuestions([
          {
            mainQuestion: "Describe a person who has inspired you.",
            prompts: [
              "who this person is",
              "how you know him or her",
              "what qualities this person has",
              "and explain why he or she has inspired you",
            ],
          },
          {
            mainQuestion: "Describe a city or town you enjoyed visiting.",
            prompts: [
              "where it is",
              "when you went there",
              "what you did there",
              "and explain why you enjoyed your visit",
            ],
          },
        ]);
      }
    };
    fetchQuestions();
  }, []);

  // 🎙️ Lógica de grabación
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

          // ⚠️ Error si la IA no entendió el audio
          if (text.trim() === "/ Please check the submitted text /") {
            setTranscription("⚠️ Unable to process audio. Please try again.");
            setIsProcessing(false);
            return;
          }

          setTranscription(text);

          const feedback = await getSpeakingTaskTwoFeedback(text);

          // ⚠️ Error si la IA devolvió texto inválido
          if (feedback.includes("/ Please check the submitted text /")) {
            setTranscription(
              "⚠️ The recording seems unclear or not in English. Try again."
            );
            setIsProcessing(false);
            return;
          }

          const formatted = formatResponse(feedback);
          setImprovedText(formatted);
          setShowImproved(true);
        } catch (err) {
          console.error("Error processing audio:", err);
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

  const playRecording = () => {
    if (audioRef.current) audioRef.current.play();
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
    setImprovedText("");
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

  // 🌀 Pantallas de carga / error
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
        <p>Loading Task 2 questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error} Using default data.</span>
        </div>
      </div>
    );
  }

  const current = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Task 2: Cue Cards</h1>

      {/* 🗒️ Cue Card */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Cue Card {currentQuestionIndex + 1}/{questions.length}
        </h2>
        <p className="text-lg font-medium mb-4">{current.mainQuestion}</p>

        <ul className="list-disc list-inside text-gray-700 mb-6">
          {current.prompts.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <div className="flex gap-3">
          <button
            onClick={prevQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </button>

          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            Next <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 🎙️ Grabación */}
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
              <h3 className="font-medium mb-2">Your transcription:</h3>
              <p className="whitespace-pre-line">{transcription}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {audioUrl && (
                <button
                  onClick={playRecording}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto"
                >
                  <PlayIcon className="h-5 w-5" />
                  Play Recording
                </button>
              )}

              <button
                onClick={resetExercise}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <audio ref={audioRef} src={audioUrl} hidden />
      </div>

      {/* ✨ Feedback mejorado */}
      {showImproved && Array.isArray(improvedText) && (
        <div className="space-y-6">
          {improvedText.map((section: string[], idx: number) => (
            <div key={idx} className="p-4 bg-gray-100 rounded-lg shadow">
              <h1 className="font-bold text-lg mb-2 text-yellow-600">
                {section[0]}
              </h1>
              <p className="whitespace-pre-line">
                {section.slice(1).join("\n")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
