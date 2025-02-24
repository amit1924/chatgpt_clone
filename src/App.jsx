// import React, { useState, useEffect, useRef } from "react";
// import gptLogo from "./assets/chatgptLogo.svg";
// import { Plus, LogOut, Menu, X, Send, Trash2 } from "lucide-react";
// import userIcon from "./assets/user-icon.png";
// import gptImageIcon from "./assets/chatgpt.svg";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import DOMPurify from "dompurify";
// import { TbHttpDelete } from "react-icons/tb";
// import { PiChatThin } from "react-icons/pi";

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// const fetchAIResponse = async (message, imageData = null) => {
//   try {
//     const contents = imageData
//       ? [
//           {
//             role: "user",
//             parts: [
//               { text: message },
//               {
//                 inlineData: {
//                   data: imageData.split(",")[1],
//                   mimeType: "image/png",
//                 },
//               },
//             ],
//           },
//         ]
//       : [{ role: "user", parts: [{ text: message }] }];

//     const result = await model.generateContent({ contents });
//     return (
//       result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "I couldn't generate a response."
//     );
//   } catch (error) {
//     console.error("Error fetching AI response:", error);
//     return "Error fetching response.";
//   }
// };

// const App = () => {
//   const [image, setImage] = useState(null);
//   const [heading, setHeading] = useState(true);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [messages, setMessages] = useState(() => {
//     const savedMessages = localStorage.getItem("chatMessages");
//     return savedMessages ? JSON.parse(savedMessages) : [];
//   });
//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
//     setHeading(!(savedMessages && savedMessages.length > 0));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("chatMessages", JSON.stringify(messages));
//   }, [messages]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSendMessage = async () => {
//     if (inputValue.trim()) {
//       const userMessage = inputValue.trim();
//       setMessages((prev) => [
//         ...prev,
//         { text: userMessage, sender: "user", image: null },
//       ]);
//       setInputValue("");
//       setIsLoading(true);
//       setHeading(false);

//       const aiResponse = await fetchAIResponse(userMessage, image);
//       setMessages((prev) => [
//         ...prev,
//         { text: aiResponse, sender: "ai", image: null },
//       ]);
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const imageData = reader.result;
//         setImage(imageData);
//         setMessages((prev) => [
//           ...prev,
//           { text: "Image uploaded. Analyzing...", sender: "ai", image: null },
//         ]);
//         const description = await fetchAIResponse(
//           "Describe this image.",
//           imageData
//         );
//         setMessages((prev) => [
//           ...prev,
//           { text: description, sender: "ai", image: imageData },
//         ]);
//       };
//       setHeading(false);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleClearChat = () => {
//     setMessages([]);
//     setHeading(true);
//     localStorage.removeItem("chatMessages");
//     setImage(null);
//   };

//   const handleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className="bg-gray-900 text-white min-h-screen flex overflow-y-auto overflow-x-hidden">
//       <button
//         className="md:hidden absolute top-4 left-1 z-50 p-2 bg-gray-900 rounded-lg"
//         onClick={handleSidebar}
//       >
//         {isSidebarOpen ? (
//           <X className="w-6 h-6 text-white" />
//         ) : (
//           <Menu className="w-6 h-6 text-white" />
//         )}
//       </button>

//       <aside
//         className={`fixed min-h-screen md:relative top-0 z-20 left-0 h-full w-64 bg-gray-800 p-4 flex flex-col justify-between transition-transform duration-300 ${
//           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0`}
//       >
//         <div>
//           <div className="flex items-center gap-2 mb-6 ml-7 md:ml-0">
//             <img src={gptLogo} alt="ChatGPT Logo" className="w-8 h-8" />
//             <span className="text-lg font-semibold">AI Assistant</span>
//           </div>
//           <button className="w-full flex items-center gap-2 p-2 rounded-lg text-white hover:bg-green-700 transition">
//             <Plus className="w-5 h-5" /> New Chat
//           </button>
//         </div>
//         <div className="flex flex-col gap-2">
//           <button
//             onClick={handleClearChat}
//             className="w-full flex items-center gap-2  p-2 rounded-lg  transition"
//           >
//             <TbHttpDelete className="text-4xl" color="green" />
//             <PiChatThin className="text-2xl" color="green" />
//           </button>
//           <button className="w-full flex items-center gap-2 text-sm p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
//             <LogOut className="w-4 h-4" /> Logout
//           </button>
//         </div>
//       </aside>

//       <main className="flex-1 flex flex-col h-screen">
//         {heading && (
//           <h1 className="text-center text-2xl mt-[15rem]">
//             Welcome user,{" "}
//             <span className="text-purple-700 animate-pulse">
//               I am your AI assistant
//             </span>
//           </h1>
//         )}

//         <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto p-4 space-y-4">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex items-start gap-3 ${
//                 message.sender === "user" ? "justify-end" : "justify-start"
//               }`}
//             >
//               {message.sender === "ai" && (
//                 <img
//                   src={gptImageIcon}
//                   alt="AI"
//                   className="w-6 h-6 rounded-full"
//                 />
//               )}
//               <div
//                 className={`p-3 rounded-lg max-w-[99%] ${
//                   message.sender === "user" ? " text-slate-600" : " text-white"
//                 }`}
//               >
//                 {message.image && (
//                   <img
//                     src={message.image}
//                     alt="Uploaded"
//                     className="w-48 h-48 object-cover rounded-lg mb-2"
//                   />
//                 )}
//                 <div
//                   dangerouslySetInnerHTML={{
//                     __html: DOMPurify.sanitize(
//                       message.text
//                         .replace(
//                           /\*\*(.*?)\*\*/g,
//                           '<strong class="text-green-400 text-lg">$1</strong>'
//                         )
//                         .replace(/\n/g, "<br/>")
//                     ),
//                   }}
//                 ></div>
//               </div>
//               {message.sender === "user" && (
//                 <img
//                   src={userIcon}
//                   alt="User"
//                   className="w-6 h-6 rounded-full"
//                 />
//               )}
//             </div>
//           ))}
//           {isLoading && (
//             <div className="flex justify-start items-center py-3">
//               <div className="typing-indicator flex gap-1">
//                 <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
//                 <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-100"></span>
//                 <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></span>
//               </div>
//             </div>
//           )}
//           <div ref={chatEndRef}></div>
//         </div>

//         <div className="w-full max-w-2xl mx-auto p-3 mb-2 bg-gray-800 rounded-lg border border-gray-700 flex items-center sticky bottom-0">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//             placeholder="Send a message..."
//             className="flex-1 bg-transparent outline-none text-white p-2"
//           />
//           <label className="ml-2 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageUpload}
//               className="hidden"
//             />
//             <span>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 stroke-width="2"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 class="lucide lucide-paperclip"
//               >
//                 <path d="M13.234 20.252 21 12.3" />
//                 <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" />
//               </svg>
//             </span>
//           </label>
//           <button
//             onClick={handleSendMessage}
//             className="ml-2 p-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
//             disabled={isLoading}
//           >
//             <Send className="w-5 h-5 text-white" />
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect, useRef } from "react";
import gptLogo from "./assets/chatgptLogo.svg";
import { Plus, LogOut, Menu, X, Send, Trash2 } from "lucide-react";
import userIcon from "./assets/user-icon.png";
import gptImageIcon from "./assets/chatgpt.svg";
import { GoogleGenerativeAI } from "@google/generative-ai";
import DOMPurify from "dompurify";
import { TbHttpDelete } from "react-icons/tb";
import { PiChatThin } from "react-icons/pi";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const fetchAIResponse = async (message, imageData = null) => {
  try {
    const contents = imageData
      ? [
          {
            role: "user",
            parts: [
              { text: message },
              {
                inlineData: {
                  data: imageData.split(",")[1],
                  mimeType: "image/png",
                },
              },
            ],
          },
        ]
      : [{ role: "user", parts: [{ text: message }] }];

    const result = await model.generateContent({ contents });
    return (
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response."
    );
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error fetching response.";
  }
};

const App = () => {
  const [image, setImage] = useState(null);
  const [heading, setHeading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
    setHeading(!(savedMessages && savedMessages.length > 0));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleFocus = () => {
      window.scrollTo(0, 0); // Scroll to the top of the page
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("focus", handleFocus);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener("focus", handleFocus);
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = inputValue.trim();
      setMessages((prev) => [
        ...prev,
        { text: userMessage, sender: "user", image: null },
      ]);
      setInputValue("");
      setIsLoading(true);
      setHeading(false);

      const aiResponse = await fetchAIResponse(userMessage, image);
      setMessages((prev) => [
        ...prev,
        { text: aiResponse, sender: "ai", image: null },
      ]);
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
        setImage(imageData);
        setMessages((prev) => [
          ...prev,
          { text: "Image uploaded. Analyzing...", sender: "ai", image: null },
        ]);
        const description = await fetchAIResponse(
          "Describe this image.",
          imageData
        );
        setMessages((prev) => [
          ...prev,
          { text: description, sender: "ai", image: imageData },
        ]);
      };
      setHeading(false);
      reader.readAsDataURL(file);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setHeading(true);
    localStorage.removeItem("chatMessages");
    setImage(null);
  };

  const handleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex overflow-y-auto overflow-x-hidden">
      <button
        className="md:hidden fixed top-4 left-1 z-50 p-2 bg-gray-900 rounded-lg"
        onClick={handleSidebar}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      <aside
        className={`fixed min-h-screen md:relative top-0 z-20 left-0 h-full w-64 bg-gray-800 p-4 flex flex-col justify-between transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div>
          <div className="flex items-center gap-2 mb-6 ml-7 md:ml-0">
            <img src={gptLogo} alt="ChatGPT Logo" className="w-8 h-8" />
            <span className="text-lg font-semibold">AI Assistant</span>
          </div>
          <button className="w-full flex items-center gap-2 p-2 rounded-lg text-white hover:bg-green-700 transition">
            <Plus className="w-5 h-5" /> New Chat
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleClearChat}
            className="w-full flex items-center gap-2  p-2 rounded-lg  transition"
          >
            <TbHttpDelete className="text-4xl" color="green" />
            <PiChatThin className="text-2xl" color="green" />
          </button>
          <button className="w-full flex items-center gap-2 text-sm p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen">
        {heading && (
          <h1 className="text-center text-2xl mt-[15rem]">
            Welcome user,{" "}
            <span className="text-purple-700 animate-pulse">
              I am your AI assistant
            </span>
          </h1>
        )}

        <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto p-4 space-y-4 chat-container">
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
                  message.sender === "user" ? " text-slate-600" : " text-white"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="w-48 h-48 object-cover rounded-lg mb-2"
                  />
                )}
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      message.text
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong class="text-green-400 text-lg">$1</strong>'
                        )
                        .replace(/\n/g, "<br/>")
                    ),
                  }}
                ></div>
              </div>
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

        <div className="w-full max-w-2xl mx-auto p-3 mb-2 bg-gray-800 rounded-lg border border-gray-700 flex items-center sticky bottom-0">
          <input
            type="text"
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Send a message..."
            className="flex-1 bg-transparent outline-none text-white p-2"
          />
          <label className="ml-2 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-paperclip"
              >
                <path d="M13.234 20.252 21 12.3" />
                <path d="m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486" />
              </svg>
            </span>
          </label>
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
