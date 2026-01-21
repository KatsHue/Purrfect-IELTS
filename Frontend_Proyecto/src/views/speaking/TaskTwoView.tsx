import { useState, useRef, useEffect } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  MicrophoneIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
import { SpeakingAPI } from "@/api/SpeakingTaskTwoAPI";
import { transcriptionAI } from "@/api/TranscriptionAI";
import {
  getSpeakingTaskTwoFeedback,
  getTaskThreeQuestions,
  getSpeakingTaskThreeFeedback,
} from "@/api/AIAPI";
import { formatResponse } from "@/utils/format";
import { useSavePracticeResult } from "@/hooks/useSavePracticeResult";
import { parseAIFeedback } from "@/utils/parseAIFeedback";

export default function SpeakingView() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [showImproved, setShowImproved] = useState(false);
  //const [improvedText, setImprovedText] = useState("");
  const [improvedText, setImprovedText] = useState<string[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NUEVOS ESTADOS PARA TASK 3
  const [showTaskThree, setShowTaskThree] = useState(false);
  const [taskThreeReady, setTaskThreeReady] = useState(false);
  const [taskThreeQuestions, setTaskThreeQuestions] = useState<string[]>([]);
  const [currentTaskThreeIndex, setCurrentTaskThreeIndex] = useState(0);
  const [taskThreeTranscriptions, setTaskThreeTranscriptions] = useState<
    string[]
  >([]);
  const [taskThreeAudioUrls, setTaskThreeAudioUrls] = useState<string[]>([]);
  //const [taskThreeFeedbacks, setTaskThreeFeedbacks] = useState<any[]>([]);
  const [taskThreeFeedbacks, setTaskThreeFeedbacks] = useState<string[][][]>(
    []
  );
  const [isRecordingTaskThree, setIsRecordingTaskThree] = useState(false);

  // para guardar resultados
  const { mutate: saveResult } = useSavePracticeResult();

  // para trackear el tiempo inicial de grabación
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
          "Describe a person who has inspired you.\nWho this person is\nHow you know him or her\nWhat qualities this person has\nAnd explain why he or she has inspired you",
          "Describe a city or town you enjoyed visiting.\nWhere it is\nWhen you went there\nWhat you did there\nAnd explain why you enjoyed your visit",
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
        const url = URL.createObjectURL(audioBlob);

        if (!showTaskThree) {
          // PROCESAMIENTO TASK 2
          setAudioUrl(url);
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

            const formattedCueCard = questions[currentQuestionIndex].replace(
              /\\n/g,
              "\n"
            );

            const feedback = await getSpeakingTaskTwoFeedback(
              text,
              formattedCueCard
            );

            if (!feedback) {
              throw new Error("No feedback received from AI");
            }

            const safeFeedback = feedback;

            if (safeFeedback.includes("/ Please check the submitted text /")) {
              setTranscription(
                "⚠️ The recording seems unclear or not in English. Try again."
              );
              setIsProcessing(false);
              return;
            }

            const formatted = formatResponse(safeFeedback);
            setImprovedText(formatted);
            setShowImproved(true);

            //  Guardar resultado de Task 2 en la base de datos
            const parsedFeedback = parseAIFeedback(safeFeedback);
            const recordingDuration = recordingStartTime - recordingTime; // Tiempo usado

            saveResult({
              type: "speaking",
              task: "task-two",
              question: formattedCueCard,
              userResponse: text,
              aiFeedback: safeFeedback,
              estimatedBand: parsedFeedback.estimatedBand,
              identifiedErrors: parsedFeedback.identifiedErrors,
              bulletPointsCovered: parsedFeedback.bulletPointsCovered,
              metadata: {
                taskRelevance: parsedFeedback.metadata?.taskRelevance,
                recordingDuration: recordingDuration,
              },
            });

            // GENERA PREGUNTAS PRA LA TASK 3
            const t3Questions = await getTaskThreeQuestions(
              formattedCueCard,
              text
            );
            if (t3Questions && t3Questions.length > 0) {
              setTaskThreeQuestions(t3Questions);
              setTaskThreeReady(true);
            }
          } catch (err) {
            console.error("Error generando transcripción o feedback:", err);
            setTranscription(
              "⚠️ There was an issue processing your audio. Please record again."
            );
          } finally {
            setIsProcessing(false);
          }
        } else {
          // PROCESAMIENTO TASK 3
          setIsRecordingTaskThree(false);

          try {
            setIsProcessing(true);
            const text = await transcriptionAI(audioBlob);

            if (text.trim() === "/ Please check the submitted text /") {
              alert("⚠️ Unable to process audio. Please try again.");
              setIsProcessing(false);
              return;
            }

            // Guardar transcripción y audio
            const newTranscriptions = [...taskThreeTranscriptions];
            newTranscriptions[currentTaskThreeIndex] = text;
            setTaskThreeTranscriptions(newTranscriptions);

            const newUrls = [...taskThreeAudioUrls];
            newUrls[currentTaskThreeIndex] = url;
            setTaskThreeAudioUrls(newUrls);

            // Obtener feedback
            const feedback = await getSpeakingTaskThreeFeedback(
              text,
              taskThreeQuestions[currentTaskThreeIndex],
              questions[currentQuestionIndex]
            );

            if (!feedback) throw new Error("No feedback from AI");

            const safeFeedback = feedback;

            const formatted = formatResponse(safeFeedback);
            const newFeedbacks = [...taskThreeFeedbacks];
            newFeedbacks[currentTaskThreeIndex] = formatted;
            setTaskThreeFeedbacks(newFeedbacks);

            // Guardar resultado de Task 3 en la base de datos
            const parsedFeedback = parseAIFeedback(safeFeedback);
            const recordingDuration = recordingStartTime - recordingTime;

            saveResult({
              type: "speaking",
              task: "task-three",
              question: taskThreeQuestions[currentTaskThreeIndex],
              userResponse: text,
              aiFeedback: safeFeedback,
              estimatedBand: parsedFeedback.estimatedBand,
              identifiedErrors: parsedFeedback.identifiedErrors,
              metadata: {
                taskRelevance: parsedFeedback.metadata?.taskRelevance,
                recordingDuration: recordingDuration,
              },
            });
          } catch (err) {
            console.error("Error en Task 3:", err);
            alert("⚠️ There was an issue processing your audio.");
          } finally {
            setIsProcessing(false);
          }
        }
      };

      mediaRecorderRef.current.start();
      if (!showTaskThree) {
        setIsRecording(true);
      } else {
        setIsRecordingTaskThree(true);
      }
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
      setIsRecordingTaskThree(false);
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
    setImprovedText([]);

    setIsProcessing(false);
    audioChunksRef.current = [];

    setShowTaskThree(false);
    setTaskThreeReady(false);
    setTaskThreeQuestions([]);
    setCurrentTaskThreeIndex(0);
    setTaskThreeTranscriptions([]);
    setTaskThreeAudioUrls([]);
    setTaskThreeFeedbacks([]);
    setIsRecordingTaskThree(false);
  };

  const goToTaskThree = () => {
    setShowTaskThree(true);
  };

  const nextTaskThreeQuestion = () => {
    if (currentTaskThreeIndex < taskThreeQuestions.length - 1) {
      setCurrentTaskThreeIndex(currentTaskThreeIndex + 1);
    }
  };

  const prevTaskThreeQuestion = () => {
    if (currentTaskThreeIndex > 0) {
      setCurrentTaskThreeIndex(currentTaskThreeIndex - 1);
    }
  };

  const playTaskThreeRecording = (index: number) => {
    if (taskThreeAudioUrls[index]) {
      const audio = new Audio(taskThreeAudioUrls[index]);
      audio.play();
    }
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
          <p>Cargando preguntas...</p>
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
          <strong className="font-bold">Sin preguntas disponibles</strong>
          <span className="block sm:inline"> Intente más tarde.</span>
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
            Speaking Practice: Part 2 {showTaskThree && "& Part 3"} 🎤
          </h1>
          <p className="text-[#7f533b] text-lg">
            Long turn & follow-up discussion
          </p>
        </div>

        {/* ===== TASK 2 ===== */}
        {!showTaskThree && (
          <>
            {/* MAIN CONTENT - DOS COLUMNAS */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* QUESTION CARD */}
              <div className="bg-[#f1d49a]/40 p-6 rounded-2xl border border-[#f1d49a]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#f4bc3c] rounded-full flex items-center justify-center text-[#442e14] font-black text-sm">
                    {currentQuestionIndex + 1}
                  </div>
                  <h2 className="text-lg font-bold text-[#442e14]">
                    Part 2 – Question {currentQuestionIndex + 1}/
                    {questions.length}
                  </h2>
                </div>

                {/* Instrucciones del examen */}
                <div className="bg-[#f4bc3c]/20 border border-[#f4bc3c]/40 p-3 rounded-xl mb-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#442e14]">
                    <span className="font-bold">⏱️ Time:</span>
                    <span>1-2 min</span>
                  </div>
                  <div className="w-px h-4 bg-[#f4bc3c]/40"></div>
                  <div className="flex items-center gap-2 text-sm text-[#442e14]">
                    <span className="font-bold">🎯 Task:</span>
                    <span>Long turn</span>
                  </div>
                </div>

                {/* Cue card */}
                <div className="bg-white/80 p-5 rounded-xl mb-4 min-h-[200px] flex items-center">
                  <p className="whitespace-pre-line text-[#442e14] text-lg leading-relaxed">
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

              {/* Grabación */}
              <div className="bg-white border-2 border-[#f1d49a] p-6 rounded-2xl">
                <h2 className="text-xl font-black text-[#442e14] mb-4 flex items-center gap-2">
                  <MicrophoneIcon className="h-6 w-6 text-[#f4bc3c]" />
                  Record Your Answer
                </h2>
                {/* Tips */}
                <div className="bg-[#f1d49a]/40 p-4 rounded-xl mb-6">
                  <h4 className="font-bold text-[#442e14] text-sm mb-2 flex items-center gap-2">
                    <span>✓</span> Tips for your answer:
                  </h4>
                  <ul className="text-sm text-[#7f533b] space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-[#f4bc3c] mt-0.5">•</span>
                      <span>Cover all bullet points</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#f4bc3c] mt-0.5">•</span>
                      <span>Speak for 1-2 minutes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#f4bc3c] mt-0.5">•</span>
                      <span>Use detailed examples</span>
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
                        <span>📝</span> Your transcription:
                      </h3>
                      <p className="whitespace-pre-line text-[#442e14] leading-relaxed">
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
                        Retry
                      </button>
                    </div>
                    <div className="bg-[#f1d49a]/40 p-4 rounded-xl mb-6">
                      <h4 className="font-bold text-[#442e14] text-sm mb-2 flex items-center gap-2">
                        <span>👇</span> Scroll down to see your feedback
                      </h4>
                    </div>
                  </div>
                )}

                {audioUrl && <audio ref={audioRef} src={audioUrl} hidden />}
              </div>
            </div>

            {/* FEEDBACK TASK 2 */}
            {showImproved &&
              Array.isArray(improvedText) &&
              improvedText.length > 0 && (
                <div className="space-y-6 mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xl">
                      🤖
                    </div>
                    <h2 className="text-2xl font-black text-[#442e14]">
                      AI Feedback & Analysis
                    </h2>
                  </div>

                  {improvedText.map((section, idx) => (
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
                </div>
              )}

            {/* TASK 3 */}
            {taskThreeReady && !showTaskThree && (
              <div className="bg-[#f1d49a]/40 border-2 border-[#f4bc3c] rounded-2xl p-6">
                <h3 className="text-xl font-black text-[#442e14] mb-2">
                  🎯 Ready for Part 3?
                </h3>
                <p className="text-[#7f533b] mb-4">
                  Now let's move to follow-up questions.
                </p>
                <button
                  onClick={goToTaskThree}
                  className="w-full py-4 bg-[#f4bc3c] text-[#442e14] rounded-full font-black hover:scale-105 transition shadow"
                >
                  Continue to Part 3 →
                </button>
              </div>
            )}
          </>
        )}

        {/* ===== TASK 3 ===== */}
        {showTaskThree && (
          <>
            {/* MAIN CONTENT - DOS COLUMNAS */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* QUESTION CARD */}
              <div className="bg-[#f1d49a]/40 p-6 rounded-2xl border border-[#f1d49a]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-[#f4bc3c] rounded-full flex items-center justify-center text-[#442e14] font-black text-sm">
                    {currentTaskThreeIndex + 1}
                  </div>
                  <h2 className="text-lg font-bold text-[#442e14]">
                    Part 3 – Question {currentTaskThreeIndex + 1} of{" "}
                    {taskThreeQuestions.length}
                  </h2>
                </div>

                {/* Instrucciones del examen */}
                <div className="bg-[#f4bc3c]/20 border border-[#f4bc3c]/40 p-3 rounded-xl mb-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#442e14]">
                    <span className="font-bold">⏱️ Time:</span>
                    <span>4-5 min total</span>
                  </div>
                  <div className="w-px h-4 bg-[#f4bc3c]/40"></div>
                  <div className="flex items-center gap-2 text-sm text-[#442e14]">
                    <span className="font-bold">🎯 Task:</span>
                    <span>Discussion</span>
                  </div>
                </div>

                {/* Pregunta */}
                <div className="bg-white/80 p-5 rounded-xl mb-4 min-h-[120px] flex items-center">
                  <p className="text-[#442e14] text-lg leading-relaxed">
                    {taskThreeQuestions[currentTaskThreeIndex]}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={prevTaskThreeQuestion}
                    disabled={currentTaskThreeIndex === 0}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#f4bc3c] text-[#442e14] font-bold rounded-full hover:scale-105 transition shadow disabled:opacity-40 disabled:hover:scale-100"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    onClick={nextTaskThreeQuestion}
                    disabled={
                      currentTaskThreeIndex === taskThreeQuestions.length - 1
                    }
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#f4bc3c] text-[#442e14] font-bold rounded-full hover:scale-105 transition shadow disabled:opacity-40 disabled:hover:scale-100"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={resetExercise}
                    className="ml-auto px-4 py-2.5 bg-[#f1d49a] text-[#442e14] font-bold rounded-full hover:bg-[#f1d49a]/70 transition shadow"
                  >
                    Back
                  </button>
                </div>
              </div>

              {/* Grabación TS3 */}
              <div className="bg-white border-2 border-[#f1d49a] p-6 rounded-2xl">
                <h2 className="text-xl font-black text-[#442e14] mb-4 flex items-center gap-2">
                  <MicrophoneIcon className="h-6 w-6 text-[#f4bc3c]" />
                  Record Your Answer
                </h2>

                {/* Tips */}
                <div className="bg-white/60 p-4 rounded-xl mb-6">
                  <h4 className="font-bold text-[#442e14] text-sm mb-2 flex items-center gap-2">
                    <span>✓</span> Tips for your answer:
                  </h4>
                  <ul className="text-sm text-[#7f533b] space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-[#f4bc3c] mt-0.5">•</span>
                      <span>Give detailed explanations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#f4bc3c] mt-0.5">•</span>
                      <span>Discuss abstract concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#f4bc3c] mt-0.5">•</span>
                      <span>Support with examples</span>
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
                ) : !isRecordingTaskThree &&
                  !taskThreeTranscriptions[currentTaskThreeIndex] ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center justify-center gap-3 w-full py-4 bg-[#f4bc3c] text-[#442e14] rounded-full font-black hover:scale-105 transition shadow-md"
                  >
                    <MicrophoneIcon className="h-6 w-6" />
                    Start Recording
                  </button>
                ) : isRecordingTaskThree ? (
                  <div className="space-y-6">
                    <div className="bg-[#f1d49a]/30 p-6 rounded-xl text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="animate-pulse bg-red-500 rounded-full h-4 w-4" />
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
                        <span>📝</span> Your transcription:
                      </h3>
                      <p className="whitespace-pre-line text-[#442e14] leading-relaxed">
                        {taskThreeTranscriptions[currentTaskThreeIndex]}
                      </p>
                    </div>

                    {taskThreeAudioUrls[currentTaskThreeIndex] && (
                      <button
                        onClick={() =>
                          playTaskThreeRecording(currentTaskThreeIndex)
                        }
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f4bc3c] text-[#442e14] font-bold rounded-full hover:scale-105 transition shadow"
                      >
                        <PlayIcon className="h-5 w-5" />
                        Play Recording
                      </button>
                    )}
                    <div className="bg-[#f1d49a]/40 p-4 rounded-xl mb-6">
                      <h4 className="font-bold text-[#442e14] text-sm mb-2 flex items-center gap-2">
                        <span>👇</span> Scroll down to see your feedback
                      </h4>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* FEEDBACK TASK 3 */}
            {taskThreeFeedbacks[currentTaskThreeIndex] &&
              Array.isArray(taskThreeFeedbacks[currentTaskThreeIndex]) && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#f4bc3c] rounded-full flex items-center justify-center text-xl">
                      🤖
                    </div>
                    <h2 className="text-2xl font-black text-[#442e14]">
                      AI Feedback & Analysis
                    </h2>
                  </div>

                  {taskThreeFeedbacks[currentTaskThreeIndex].map(
                    (section, idx) => (
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
                    )
                  )}
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
