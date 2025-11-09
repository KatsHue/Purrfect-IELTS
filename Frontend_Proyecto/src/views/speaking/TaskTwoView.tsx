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

export default function SpeakingView() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [showImproved, setShowImproved] = useState(false);
  const [improvedText, setImprovedText] = useState("");
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
  const [taskThreeFeedbacks, setTaskThreeFeedbacks] = useState<any[]>([]);
  const [isRecordingTaskThree, setIsRecordingTaskThree] = useState(false);

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
          // ===== PROCESAMIENTO TASK 2
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

            // ===== GENERA PREGUNTAS PRA LA TASK 3
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
          // ===== PROCESAMIENTO TASK 3
          setIsRecordingTaskThree(false);

          try {
            setIsProcessing(true);
            const text = await transcriptionAI(audioBlob);

            if (text.trim() === "/ Please check the submitted text /") {
              alert("⚠️ Unable to process audio. Please try again.");
              setIsProcessing(false);
              return;
            }

            // ===== Guardar transcripción y audio
            const newTranscriptions = [...taskThreeTranscriptions];
            newTranscriptions[currentTaskThreeIndex] = text;
            setTaskThreeTranscriptions(newTranscriptions);

            const newUrls = [...taskThreeAudioUrls];
            newUrls[currentTaskThreeIndex] = url;
            setTaskThreeAudioUrls(newUrls);

            // ===== Obtener feedback
            const feedback = await getSpeakingTaskThreeFeedback(
              text,
              taskThreeQuestions[currentTaskThreeIndex],
              questions[currentQuestionIndex]
            );

            const formatted = formatResponse(feedback);
            const newFeedbacks = [...taskThreeFeedbacks];
            newFeedbacks[currentTaskThreeIndex] = formatted;
            setTaskThreeFeedbacks(newFeedbacks);
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
    setImprovedText("");
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
      <h1 className="text-3xl font-bold text-gray-800">
        Speaking Practice: Part 2 {showTaskThree && "& Part 3"}
      </h1>

      {/* ===== TASK 2: CUE CARD ===== */}
      {!showTaskThree && (
        <>
          {/* Pregunta */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Part 2 - Question {currentQuestionIndex + 1}/{questions.length}
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

          {/* Grabación Task 2 */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Record Your Answer (1-2 minutes)
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

            {audioUrl && <audio ref={audioRef} src={audioUrl} hidden />}
          </div>

          {/* Feedback Task 2 */}
          {showImproved && Array.isArray(improvedText) && (
            <div className="space-y-6">
              {improvedText.map((section: string[], idx: number) => (
                <div key={idx} className="p-4 bg-gray-100 rounded-lg shadow">
                  <h2 className="font-bold text-lg mb-2 text-yellow-600">
                    {section[0]}
                  </h2>
                  <p className="whitespace-pre-line">
                    {section.slice(1).join("\n")}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Botón para continuar a Task 3 */}
          {taskThreeReady && !showTaskThree && (
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-6 rounded-xl shadow-lg border-2 border-yellow-400">
              <h3 className="text-xl font-bold text-amber-800 mb-3">
                🎯 Ready for Part 3!
              </h3>
              <p className="text-gray-700 mb-4">
                Great job on Part 2! Now let's move on to the follow-up
                discussion questions (Part 3).
              </p>
              <button
                onClick={goToTaskThree}
                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-amber-700 transition shadow-md"
              >
                Continue to Part 3 →
              </button>
            </div>
          )}
        </>
      )}

      {/* TASK 3: FOLLOW-UP QUESTIONS*/}
      {showTaskThree && (
        <>
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl shadow-md border-2 border-yellow-300">
            <h2 className="text-2xl font-bold text-yellow-500 mb-2">
              Part 3 - Follow-up Discussion
            </h2>
            <p className="text-gray-700">
              Now let's discuss some abstract ideas related to your topic.
            </p>
          </div>

          {/* Pregunta actual Task 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Question {currentTaskThreeIndex + 1}/{taskThreeQuestions.length}
            </h3>
            <p className="text-lg mb-6">
              {taskThreeQuestions[currentTaskThreeIndex]}
            </p>

            <div className="flex gap-3">
              <button
                onClick={prevTaskThreeQuestion}
                disabled={currentTaskThreeIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </button>

              <button
                onClick={nextTaskThreeQuestion}
                disabled={
                  currentTaskThreeIndex === taskThreeQuestions.length - 1
                }
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next <ChevronRightIcon className="h-4 w-4" />
              </button>

              <button
                onClick={resetExercise}
                className="ml-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Back
              </button>
            </div>
          </div>

          {/* Grabación Task 3 */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Record Your Answer (30-60 seconds)
            </h2>

            {isProcessing ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p>Processing your recording...</p>
              </div>
            ) : !isRecordingTaskThree &&
              !taskThreeTranscriptions[currentTaskThreeIndex] ? (
              <button
                onClick={startRecording}
                className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition"
              >
                <MicrophoneIcon className="h-5 w-5" />
                Start Recording
              </button>
            ) : isRecordingTaskThree ? (
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
                  <p className="whitespace-pre-line">
                    {taskThreeTranscriptions[currentTaskThreeIndex]}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {taskThreeAudioUrls[currentTaskThreeIndex] && (
                    <button
                      onClick={() =>
                        playTaskThreeRecording(currentTaskThreeIndex)
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto"
                    >
                      <PlayIcon className="h-5 w-5" />
                      Play Recording
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Feedback Task 3 */}
          {taskThreeFeedbacks[currentTaskThreeIndex] &&
            Array.isArray(taskThreeFeedbacks[currentTaskThreeIndex]) && (
              <div className="space-y-6">
                {taskThreeFeedbacks[currentTaskThreeIndex].map(
                  (section: string[], idx: number) => (
                    <div
                      key={idx}
                      className="p-4 bg-amber-50 rounded-lg shadow border border-yellow-200"
                    >
                      <h2 className="font-bold text-lg mb-2 text-amber-800">
                        {section[0]}
                      </h2>
                      <p className="whitespace-pre-line">
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
  );
}
