import { useState, useEffect, useRef } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { sendMessageToChatbot } from "../../api/ChatBotAPI";
import ReactMarkdown from "react-markdown";

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    setMessages([
      {
        sender: "bot",
        text: "¡Purr, Purr! Hola, soy Purry 😺. Estoy aquí para ayudarte con el IELTS General Training. ¿Sobre qué sección quieres saber: Listening, Reading, Writing o Speaking? O prefieres consejos para mejorar tus resultados.",
      },
    ]);
  };

  const typeBotMessage = (fullText: string) => {
    let index = 0;
    const interval = setInterval(() => {
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg?.sender === "bot" && lastMsg.text !== fullText) {
          const newMsg = { sender: "bot", text: fullText.slice(0, index + 1) };
          return [...prev.slice(0, -1), newMsg];
        }
        return prev;
      });
      index++;
      if (index >= fullText.length) clearInterval(interval);
    }, 25);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const botReply = await sendMessageToChatbot(input);
    setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
    typeBotMessage(botReply);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-[#FFF9E5] shadow-lg rounded-2xl w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#f9c418] text-black p-3 rounded-t-2xl font-semibold">
            <span>Purry 😺</span>
            <button
              onClick={() => {
                setIsOpen(false);
                setMessages([]);
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] break-words ${
                  msg.sender === "user"
                    ? "bg-[#fce28c] text-black self-end ml-auto text-right"
                    : "bg-[#FFF7C0] text-black self-start"
                }`}
              >
                <ReactMarkdown
                  components={{
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-1" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="list-disc ml-4" {...props} />
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t flex bg-[#FFEB99]">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-1 text-sm focus:outline-none"
              placeholder="Escribe algo..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-[#f9c418] text-black rounded-lg px-3 py-1 hover:bg-[#FFCC33]"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleOpen}
          className="bg-[#f9c418] text-black rounded-full p-4 shadow-lg hover:bg-[#FFCC33]"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
