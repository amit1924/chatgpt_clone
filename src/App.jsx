import React, { useState, useEffect, useRef } from "react";
import gptLogo from "./assets/chatgptLogo.svg";
import { Plus, LogOut, Menu, X, Send } from "lucide-react";
import userIcon from "./assets/user-icon.png";
import gptImageIcon from "./assets/chatgpt.svg";

const fetchAIResponse = async (message) => {
  const apiKey = import.meta.env.VITE_API_KEY;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: message }] }],
        }),
      }
    );
    const data = await response.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response."
    );
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error fetching response.";
  }
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      setMessages([...messages, { text: userMessage, sender: "user" }]);
      setInputValue("");
      setIsLoading(true);

      const aiResponse = await fetchAIResponse(userMessage);
      setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" }]);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      <button
        className="md:hidden absolute top-4 left-1 z-50 p-2 bg-gray-800 rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      <aside
        className={`fixed min-h-screen md:relative top-0 left-0 h-full w-64 bg-gray-800 p-4 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div>
          <div className="flex items-center gap-2 mb-6">
            <img src={gptLogo} alt="ChatGPT Logo" className="w-8 h-8" />
            <span className="text-lg font-semibold">AI Assistant</span>
          </div>
          <button className="w-full flex items-center gap-2 bg-green-600 p-2 rounded-lg text-white hover:bg-green-700 transition">
            <Plus className="w-5 h-5" /> New Chat
          </button>
        </div>
        <button className="w-full flex items-center gap-2 text-sm p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>

      <main className="flex-1 flex flex-col h-screen">
        <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <img
                  src={gptImageIcon}
                  alt="AI"
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div
                className={`p-3 rounded-lg max-w-[99%] ${
                  message.sender === "user"
                    ? "bg-blue-900 text-white"
                    : "text-white"
                }`}
                dangerouslySetInnerHTML={{
                  __html: message.text
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong class="text-green-400 text-lg">$1</strong>'
                    )
                    .replace(/\n/g, "<br/>"),
                }}
              ></div>
              {message.sender === "user" && (
                <img
                  src={userIcon}
                  alt="User"
                  className="w-6 h-6 rounded-full"
                />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start items-center py-3">
              <div className="typing-indicator flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-100"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        <div className="w-full max-w-2xl mx-auto p-3 bg-gray-800 rounded-lg border border-gray-700 flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Send a message..."
            className="flex-1 bg-transparent outline-none text-white p-2"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 p-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
            disabled={isLoading}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
