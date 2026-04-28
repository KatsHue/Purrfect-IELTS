import { useEffect, useState, useRef } from "react";
 
const WORDS = [
  { word: "CURIOUS",  phonetic: "/ˈkjʊəriəs/",  colors: ["blue","teal","coral","blue","amber","teal","coral"] },
  { word: "BRIGHT",   phonetic: "/braɪt/",        colors: ["purple","coral","blue","amber","teal","purple"] },
  { word: "EXPLORE",  phonetic: "/ɪkˈsplɔːr/",   colors: ["teal","blue","purple","coral","blue","amber","teal"] },
  { word: "FLUENT",   phonetic: "/ˈfluːənt/",     colors: ["blue","teal","amber","coral","blue","teal"] },
  { word: "ACHIEVE",  phonetic: "/əˈtʃiːv/",      colors: ["amber","coral","blue","teal","purple","blue","coral"] },
  { word: "LEARN",    phonetic: "/lɜːrn/",         colors: ["teal","blue","coral","amber","purple"] },
];
 
const TIPS = [
  { text: "Practice 10 min/day",  color: "bg-blue-400" },
  { text: "Think in English",     color: "bg-teal-400" },
  { text: "Listen actively",      color: "bg-orange-400" },
  { text: "Read out loud",        color: "bg-violet-400" },
  { text: "Don't fear mistakes",  color: "bg-amber-400" },
];
 
const STAGES = [
  "Loading your lessons...",
  "Preparing vocabulary...",
  "Setting up exercises...",
  "Almost ready!",
];
 
const COLOR_MAP: { [key: string]: string } = {
  blue:   "bg-blue-100   border-blue-300   text-blue-900",
  teal:   "bg-teal-100   border-teal-300   text-teal-900",
  amber:  "bg-amber-100  border-amber-300  text-amber-900",
  coral:  "bg-orange-100 border-orange-300 text-orange-900",
  purple: "bg-violet-100 border-violet-300 text-violet-900",
};
 
function LetterBox({ letter, color, delay } : { letter: string, color: string, delay: number }) {
  const [visible, setVisible] = useState(false);
 
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
 
  return (
    <div
      className={`
        w-12 h-14 rounded-xl border-2 flex items-center justify-center
        text-2xl font-medium select-none
        transition-all duration-300
        ${COLOR_MAP[color] ?? COLOR_MAP.blue}
        ${visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-6 scale-75"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {letter}
    </div>
  );
}
 
export default function Loading({ onComplete } : { onComplete?: () => void }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [phoneticVisible, setPhoneticVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const progressRef = useRef(0);
  const stageRef = useRef(0);
 
  const currentWord = WORDS[wordIdx];
 
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIdx((i) => (i + 1) % WORDS.length);
      setPhoneticVisible(false);
    }, 2400);
    return () => clearInterval(wordInterval);
  }, []);
 
  useEffect(() => {
    setPhoneticVisible(false);
    const t = setTimeout(
      () => setPhoneticVisible(true),
      currentWord.word.length * 70 + 200
    );
    return () => clearTimeout(t);
  }, [wordIdx]);
 
  useEffect(() => {
    const progInterval = setInterval(() => {
      const increment = Math.floor(Math.random() * 8 + 4);
      progressRef.current = Math.min(100, progressRef.current + increment);
      setProgress(progressRef.current);
 
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        stageRef.current = 0;
        setStageIdx(0);
        onComplete?.();
        return;
      }
 
      if (progressRef.current > 82 && stageRef.current < 3) { stageRef.current = 3; setStageIdx(3); }
      else if (progressRef.current > 55 && stageRef.current < 2) { stageRef.current = 2; setStageIdx(2); }
      else if (progressRef.current > 25 && stageRef.current < 1) { stageRef.current = 1; setStageIdx(1); }
    }, 600);
    return () => clearInterval(progInterval);
  }, [onComplete]);
 
  return (
    <div className="flex flex-col items-center justify-center gap-10 py-14 px-6 min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100">
 
      <div className="flex flex-col items-center gap-4">
        <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
          word of the moment
        </span>
 
        <div className="flex gap-2 items-end h-16">
          {currentWord.word.split("").map((ch, i) => (
            <LetterBox
              key={`${wordIdx}-${i}`}
              letter={ch}
              color={currentWord.colors[i % currentWord.colors.length]}
              delay={i * 70}
            />
          ))}
        </div>
 
        <span
          className={`text-sm italic text-gray-400 transition-opacity duration-500 ${
            phoneticVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentWord.phonetic}
        </span>
      </div>
 
      <div className="w-full max-w-sm flex flex-col gap-3">
        <div className="w-full h-1.5 bg-[#442e14] rounded-full overflow-hidden border border-[#442e14]">
          <div
            className="h-full bg-[#f4bc3c] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#442e14]">{STAGES[stageIdx]}</span>
          <span className="text-xs font-medium text-[#442e14]">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
 
      <div className="flex flex-wrap gap-2 justify-center max-w-sm">
        {TIPS.map((tip, i) => (
          <div
            key={tip.text}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs bg-[#f4bc3c] text-[#442e14]"
            style={{
              animation: "fadeUp 0.5s ease both",
              animationDelay: `${i * 100}ms`,
            }}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tip.color}`} />
            {tip.text}
          </div>
        ))}
      </div>
 
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}