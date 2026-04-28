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
import { ChevronDoubleDownIcon, ClockIcon, CpuChipIcon, DocumentTextIcon, PencilSquareIcon } from "@heroicons/react/20/solid";
import { SpeechIcon } from "lucide-react";

export default function SpeakingView() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [showImproved, setShowImproved] = useState(false);
  const [improvedText, setImprovedText] = useState<string[][]>([]);
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
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await SpeakingAPI.getTaskOneQuestions();
        setQuestions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setQuestions([
          "Describe your favorite vacation destination",
          "What are your career goals for the next 5 years?",
          "Explain a challenging situation you've faced and how you handled it",
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRecording(false);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioUrl(audioURL);

        try {
          setIsProcessing(true);
          const text = await transcriptionAI(audioBlob);

          if (!text || text.trim() === "/ Please check the submitted text /") {
            setTranscription(
              "The recording seems unclear or not in English. Try again."
            );
            setIsProcessing(false);
            return;
          }

          setTranscription(text);

          const feedback = await getSpeakingFeedback(
            text,
            questions[currentQuestionIndex]
          );
          if (
            !feedback ||
            feedback.includes("/ Please check the submitted text /")
          ) {
            setTranscription(
              "The recording seems unclear or not in English. Try again."
            );
            setIsProcessing(false);
            return;
          }

          const formatted = formatResponse(feedback);
          setImprovedText(formatted);
          setShowImproved(true);

          // Auto-scroll al feedback después de un breve delay
          setTimeout(() => {
            feedbackRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 300);

          const parsedFeedback = parseAIFeedback(feedback);
          const recordingDuration = recordingStartTime - recordingTime;

          saveResult({
            type: "speaking",
            task: "task-one",
            question: questions[currentQuestionIndex],
            userResponse: text,
            aiFeedback: feedback,
            estimatedBand: parsedFeedback.estimatedBand,
            identifiedErrors: parsedFeedback.identifiedErrors,
            metadata: {
              taskRelevance: parsedFeedback.metadata?.taskRelevance,
              recordingDuration,
            },
          });
        } catch (err) {
          console.error("Error processing audio:", err);
          setTranscription(
            "There was an issue processing your audio. Please record again."
          );
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
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
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
    }
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

  const nextQuestion = () => {
    if (!questions.length) return;
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    resetExercise();
  };

  const prevQuestion = () => {
    if (!questions.length) return;
    setCurrentQuestionIndex((prev) =>
      prev === 0 ? questions.length - 1 : prev - 1
    );
    resetExercise();
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

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f4bc3c] mx-auto mb-4" />
          <p className="text-[#7f533b]">Cargando preguntas...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-2xl">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">
              {" "}
              {error}. Using default questions.
            </span>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-[#442e14] mb-2 flex items-center gap-2">
            Speaking Practice: Part 1 <SpeechIcon className="w-12 h-12 text-[#f4bc3c]" />
          </h1>
          <p className="text-[#7f533b] text-lg">
            Interview & General Questions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Preguntas */}
          <div className="bg-[#f1d49a]/40 p-6 rounded-2xl border border-[#f1d49a]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#f4bc3c] rounded-full flex items-center justify-center text-[#442e14] font-black text-sm">
                {currentQuestionIndex + 1}
              </div>
              <h2 className="text-lg font-bold text-[#442e14]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
            </div>

            {/* Instrucciones */}
            <div className="bg-[#f4bc3c]/20 border border-[#f4bc3c]/40 p-3 rounded-xl mb-4 flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-[#442e14]">
                <span className="font-bold flex items-center gap-2"><ClockIcon className="w-4 h-4" /> Time:</span>
                <span>Max 2 min</span>
              </div>
              <div className="w-px h-4 bg-[#f4bc3c]/40"></div>
              <div className="flex items-center gap-2 text-sm text-[#442e14]">
                <span className="font-bold flex items-center gap-2"><PencilSquareIcon className="w-4 h-4" /> Task:</span>
                <span>Speak naturally</span>
              </div>
            </div>

            {/* Pregunta */}
            <div className="bg-white/80 p-4 rounded-xl mb-4 min-h-[120px] flex items-center">
              <p className="text-[#442e14] text-lg leading-relaxed">
                {questions[currentQuestionIndex]}
              </p>
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

          {/* Grabar */}
          <div className="bg-white border-2 border-[#f1d49a] p-6 rounded-2xl">
            <h2 className="text-xl font-black text-[#442e14] mb-4 flex items-center gap-2">
              <MicrophoneIcon className="h-6 w-6 text-[#f4bc3c]" />
              Record Your Answer
            </h2>

            {/* TIPS */}
            <div className="bg-[#f1d49a]/40 p-4 rounded-xl mb-6">
              <h4 className="font-bold text-[#442e14] text-sm mb-2 flex items-center gap-2">
                <span>✓</span> Tips for your answer:
              </h4>
              <ul className="text-sm text-[#7f533b] space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-[#f4bc3c] mt-0.5">•</span>
                  <span>Answer directly and naturally</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f4bc3c] mt-0.5">•</span>
                  <span>Provide examples or details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f4bc3c] mt-0.5">•</span>
                  <span>Keep your tone conversational</span>
                </li>
              </ul>
            </div>

            {isProcessing ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#f4bc3c] mx-auto mb-4" />
                <p className="text-lg font-bold text-[#442e14]">
                  Processing your recording...
                </p>
                <p className="text-sm text-[#7f533b] mt-2">
                  Transcribing and analyzing
                </p>
              </div>
            ) : !isRecording && !transcription ? (
              <button
                onClick={startRecording}
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#f4bc3c] text-[#442e14] rounded-full font-black hover:scale-105 transition shadow-md"
              >
                <MicrophoneIcon className="h-6 w-6" />
                Start Recording
              </button>
            ) : isRecording ? (
              <div className="space-y-6">
                <div className="bg-[#f1d49a]/30 p-6 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="animate-pulse bg-red-500 rounded-full h-4 w-4"></div>
                    <span className="font-mono text-2xl font-black text-[#442e14]">
                      {Math.floor(recordingTime / 60)}:
                      {String(recordingTime % 60).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-sm text-[#7f533b]">
                    Recording in progress...
                  </p>
                </div>
                <button
                  onClick={stopRecording}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-red-500 text-white rounded-full font-black hover:bg-red-600 transition shadow-md"
                >
                  <StopIcon className="h-6 w-6" />
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#f9f8f6] border-2 border-[#f1d49a] p-4 rounded-xl">
                  <h3 className="font-bold text-[#442e14] mb-2 flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5" />
                    Your transcription:
                  </h3>
                  <p className="text-[#442e14] whitespace-pre-line leading-relaxed">
                    {transcription}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {audioUrl && (
                    <button
                      onClick={playRecording}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f4bc3c] text-[#442e14] font-bold rounded-full hover:scale-105 transition shadow"
                    >
                      <PlayIcon className="h-5 w-5" />
                      Play Recording
                    </button>
                  )}
                  <button
                    onClick={resetExercise}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f1d49a] text-[#442e14] font-bold rounded-full hover:bg-[#f1d49a]/70 transition shadow"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Retry
                  </button>
                </div>
                <div className="bg-[#f1d49a]/40 p-4 rounded-xl mb-6">
                  <h4 className="font-bold text-[#442e14] text-sm mb-2 flex items-center gap-2">
                    <ChevronDoubleDownIcon className="w-4 h-4" />
                    Scroll down to see your feedback
                  </h4>
                </div>
              </div>
            )}
          </div>
        </div>

        <audio ref={audioRef} src={audioUrl} hidden />

        {/* Feedback */}
        {showImproved &&
          Array.isArray(improvedText) &&
          improvedText.length > 0 && (
            <div className="space-y-6" ref={feedbackRef}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xl">
                  <CpuChipIcon className="h-5 w-5 text-[#442e14]" />
                </div>
                <h2 className="text-2xl font-black text-[#442e14]">
                  AI Feedback & Analysis
                </h2>
              </div>

              {improvedText.map((section: string[], idx: number) => (
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
                  <p className="whitespace-pre-line text-[#442e14] leading-relaxed">
                    {section.slice(1).join("\n")}
                  </p>
                </div>
              ))}

              {/* Botones */}
              <div className="bg-[#f1d49a]/40 border-2 border-[#f4bc3c] rounded-2xl p-6">
                <p className="text-[#442e14] font-bold mb-4 text-center">
                  Ready to continue?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={resetExercise}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#f1d49a] text-[#442e14] rounded-full hover:bg-[#f1d49a]/70 transition font-bold shadow"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Try Again
                  </button>
                  <button
                    onClick={nextQuestion}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#f4bc3c] text-[#442e14] rounded-full hover:scale-105 transition font-bold shadow"
                    disabled={questions.length <= 1}
                  >
                    Next Question
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
