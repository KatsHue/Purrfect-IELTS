import { useState, useRef } from "react";

export default function AudioDebugComponent() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioInfo, setAudioInfo] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const startRecording = async () => {
    try {
      // Pedir permisos con configuraciones específicas
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          sampleSize: 16,
          channelCount: 1,
        },
      });

      // Verificar qué tipos de audio soporta el navegador
      const mimeTypes = [
        "audio/webm",
        "audio/webm;codecs=opus",
        "audio/mp4",
        "audio/ogg;codecs=opus",
        "audio/wav",
      ];

      const supportedType = mimeTypes.find((type) =>
        MediaRecorder.isTypeSupported(type)
      );
      console.log("🎙️ Tipo de audio soportado:", supportedType);

      const options = supportedType ? { mimeType: supportedType } : {};
      mediaRecorderRef.current = new MediaRecorder(stream, options);

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
          console.log("📦 Chunk recibido:", e.data.size, "bytes");
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log("🛑 Grabación detenida");
        console.log("📦 Total de chunks:", audioChunksRef.current.length);

        const totalSize = audioChunksRef.current.reduce(
          (acc, chunk) => acc + chunk.size,
          0
        );
        console.log("📦 Tamaño total:", totalSize, "bytes");

        const audioBlob = new Blob(audioChunksRef.current, {
          type: supportedType || "audio/webm",
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Información del audio
        setAudioInfo({
          size: audioBlob.size,
          type: audioBlob.type,
          chunks: audioChunksRef.current.length,
          duration: recordingTime,
        });

        console.log("🎵 Audio creado:", {
          size: audioBlob.size,
          type: audioBlob.type,
          url: url,
        });
      };

      mediaRecorderRef.current.start(1000); // Guardar chunks cada segundo
      setIsRecording(true);
      setRecordingTime(0);

      // Timer para mostrar duración
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      console.log("✅ Grabación iniciada con formato:", supportedType);
    } catch (error) {
      console.error("❌ Error al acceder al micrófono:", error);
      alert("No se pudo acceder al micrófono: " + error.message);
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
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = `test-audio-${Date.now()}.webm`;
      a.click();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">🔍 Audio Debug Tool</h1>
        <p className="text-gray-600 mb-6">
          Usa esta herramienta para diagnosticar problemas con la grabación de
          audio
        </p>

        {/* Recording Controls */}
        <div className="space-y-4">
          {!isRecording && !audioUrl && (
            <button
              onClick={startRecording}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a3 3 0 00-3 3v4a3 3 0 006 0V5a3 3 0 00-3-3zm6 7a1 1 0 00-2 0 4 4 0 01-8 0 1 1 0 00-2 0 6 6 0 0012 0z" />
              </svg>
              Start Recording
            </button>
          )}

          {isRecording && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-pulse bg-red-500 rounded-full h-4 w-4"></div>
                <span className="font-mono text-xl">
                  {Math.floor(recordingTime / 60)}:
                  {String(recordingTime % 60).padStart(2, "0")}
                </span>
              </div>
              <button
                onClick={stopRecording}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <rect x="6" y="6" width="8" height="8" rx="1" />
                </svg>
                Stop Recording
              </button>
            </div>
          )}

          {audioUrl && audioInfo && (
            <div className="space-y-4">
              {/* Audio Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  📊 Audio Information
                </h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Size:</strong> {(audioInfo.size / 1024).toFixed(2)}{" "}
                    KB
                  </p>
                  <p>
                    <strong>Type:</strong> {audioInfo.type}
                  </p>
                  <p>
                    <strong>Chunks:</strong> {audioInfo.chunks}
                  </p>
                  <p>
                    <strong>Duration:</strong> {audioInfo.duration}s
                  </p>
                </div>

                {audioInfo.size < 1000 && (
                  <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    ⚠️ <strong>Problema detectado:</strong> El audio es muy
                    pequeño (menos de 1KB). Esto sugiere que no se grabó
                    correctamente.
                  </div>
                )}

                {audioInfo.size >= 1000 && audioInfo.size < 10000 && (
                  <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
                    ⚠️ <strong>Advertencia:</strong> El audio es pequeño.
                    Asegúrate de hablar claramente y cerca del micrófono.
                  </div>
                )}

                {audioInfo.size >= 10000 && (
                  <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                    ✅ El tamaño del audio parece correcto para contener voz.
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <button
                  onClick={playAudio}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.3 3.3A1 1 0 005 4v12a1 1 0 001.3.95l10-6a1 1 0 000-1.9l-10-6a1 1 0 00-1 0z" />
                  </svg>
                  Play Audio
                </button>
                <button
                  onClick={downloadAudio}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Download
                </button>
              </div>

              <button
                onClick={() => {
                  setAudioUrl("");
                  setAudioInfo(null);
                  setRecordingTime(0);
                  audioChunksRef.current = [];
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Record Again
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2">📝 Instrucciones</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Haz clic en "Start Recording"</li>
            <li>Habla claramente durante 3-5 segundos</li>
            <li>Haz clic en "Stop Recording"</li>
            <li>Revisa la información del audio</li>
            <li>
              Reproduce el audio para verificar que se grabó correctamente
            </li>
          </ol>

          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>💡 Tip:</strong> Si el tamaño del audio es menor a 1KB,
            significa que el micrófono no está capturando audio correctamente.
            Verifica los permisos del navegador y la configuración del sistema.
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} hidden />
    </div>
  );
}
