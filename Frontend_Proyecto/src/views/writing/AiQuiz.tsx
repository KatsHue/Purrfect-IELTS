import { useState, useEffect } from "react";

interface Question {
  title: string;
  statement: string;
  answer: string;
  feedback: string;
}

const AiQuiz = ({ response, reset, handleReset }: { response: string, reset:boolean, handleReset: () => void}) => {
  let questions = parseResponse(response)

  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  )

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if(reset){
      questions = [],
      setUserAnswers(Array(questions.length).fill(""))
      setChecked(false)
    }
    
  }, [reset])

  const handleChange = (value: string, index: number) => {
    const updated = [...userAnswers];
    updated[index] = value
    setUserAnswers(updated)
  }


  return (
    <div className="space-y-6 p-4">
      {questions.map((q, idx) => {
        let userAnswer = userAnswers[idx];
        if(!userAnswer){
          userAnswer = ' '
        }
        const isCorrect =
          checked &&
          userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();

        return (
          <div
            key={idx}
            className={`border rounded-xl p-4 shadow-sm bg-white space-y-2 ${
              checked
                ? isCorrect
                  ? "border-green-500"
                  : "border-red-500"
                : "border-gray-300"
            }`}
          >
            <h2 className="text-lg font-bold">{q.title}</h2>
            <p className="text-base">
              {q.statement.split("___").map((part, i) => (
                <span key={i}>
                  {part}
                  {i < q.statement.split("___").length - 1 && (
                    <input
                      type="text"
                      value={userAnswers[idx] || ""}
                      onChange={(e) => handleChange(e.target.value, idx)}
                      className={`border rounded-md px-2 py-1 mx-1 ${
                        checked
                          ? isCorrect
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Respuesta..."
                    />
                  )}
                </span>
              ))}
            </p>

            {checked && (
              <div className="mt-2 p-2 border-t text-sm">
                <p>
                  ✅ <strong>Respuesta correcta:</strong> {q.answer}
                </p>
                {!isCorrect && <p>💡 {q.feedback}</p>}
              </div>
            )}
          </div>
        );
      })}

      {
        response && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setChecked(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>

              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
              </button>
            
            </div>
          )
      }
      

    </div>
  );
};

/* Parser: obtiene título, enunciado, respuesta y feedback por bloque */
function parseResponse(rawText: string): Question[] {
  return rawText
    .split("|")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const titleMatch = block.match(/\*\*(.*?)\*\*/);
      const answerMatch = block.match(/\*\*\*(.*?)\*\*\*/);
      const feedbackMatch = block.match(/---(.*)/s);

      const title = titleMatch ? titleMatch[1] : "Question";
      const answer = answerMatch ? answerMatch[1].trim() : "";
      const feedback = feedbackMatch ? feedbackMatch[1].trim() : "";

      // Quitar título y respuesta del statement
      let statement = block
        .replace(/\*\*.*?\*\*/, "")
        .replace(/\*\*\*.*?\*\*\*/, "")
        .replace(/---.*/s, "")
        .trim();

      return { title, statement, answer, feedback };
    });
}


export default AiQuiz;
