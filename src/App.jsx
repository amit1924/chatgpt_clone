// import React, { useState, useEffect, useRef } from "react";
// import gptLogo from "./assets/chatgptLogo.svg";
// import {
//   Plus,
//   LogOut,
//   Menu,
//   X,
//   Send,
//   Trash2,
//   Sun,
//   Cloud,
//   CloudRain,
//   CloudLightning,
//   Snowflake,
//   CloudDrizzle,
// } from "lucide-react";
// import userIcon from "./assets/working.png";
// import gptImageIcon from "./assets/chatgpt.svg";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import DOMPurify from "dompurify";
// import { TbHttpDelete } from "react-icons/tb";
// import { PiChatThin } from "react-icons/pi";

// const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// // Weather API URL
// const API_URL =
//   "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// // Fetch weather data
// const fetchWeather = async (city) => {
//   try {
//     const response = await fetch(
//       `${API_URL}${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
//     );

//     if (response.ok) {
//       const data = await response.json();
//       console.log("Weather data:", data);
//       const weatherDescription = data.weather[0].description;
//       const temp = Math.round(data.main.temp);
//       const humidity = data.main.humidity;
//       const windSpeed = data.wind.speed;

//       // Map weather conditions to icons
//       const weatherIcons = {
//         "clear sky": "sun",
//         "few clouds": "cloud",
//         "scattered clouds": "cloud",
//         "broken clouds": "cloud",
//         "shower rain": "cloud-rain",
//         "light intensity drizzle": "cloud-rain",
//         rain: "cloud-rain",
//         thunderstorm: "cloud-lightning",
//         snow: "snowflake",
//         mist: "cloud-drizzle",
//       };

//       const weatherIcon =
//         weatherIcons[weatherDescription.toLowerCase()] || "cloud";

//       // Create a message to display
//       const weatherMessage = `The weather in ${data.name} is ${weatherDescription}. The temperature is ${temp}°C with a humidity of ${humidity}%. Wind speed is ${windSpeed} km/h.`;

//       // Return the weather message and icon
//       return { weatherMessage, weatherIcon };
//     } else {
//       console.error("Weather API response not OK:", response.status);
//       return { weatherMessage: "City not found", weatherIcon: null };
//     }
//   } catch (error) {
//     console.error("Error fetching weather:", error);
//     return {
//       weatherMessage: "Sorry, I couldn't fetch the weather information.",
//       weatherIcon: null,
//     };
//   }
// };

// // Fetch AI response
// const fetchAIResponse = async (
//   message,
//   imageData = null,
//   mimeType = "image/png"
// ) => {
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
//                   mimeType: mimeType,
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
//   const inputRef = useRef(null);

//   useEffect(() => {
//     try {
//       const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
//       setHeading(!(savedMessages && savedMessages.length > 0));
//     } catch (error) {
//       console.error("Error parsing localStorage:", error);
//       localStorage.removeItem("chatMessages");
//     }
//   }, []);

//   useEffect(() => {
//     if (messages.length > 50) {
//       setMessages(messages.slice(-50));
//     }
//     localStorage.setItem("chatMessages", JSON.stringify(messages));
//   }, [messages]);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     const handleFocus = () => {
//       window.scrollTo(0, 0);
//     };

//     const inputElement = inputRef.current;
//     if (inputElement) {
//       inputElement.addEventListener("focus", handleFocus);
//     }

//     return () => {
//       if (inputElement) {
//         inputElement.removeEventListener("focus", handleFocus);
//       }
//     };
//   }, []);

//   // const handleSendMessage = async () => {
//   //   if (inputValue.trim()) {
//   //     const userMessage = inputValue.trim();
//   //     setMessages((prev) => [
//   //       ...prev,
//   //       { text: userMessage, sender: "user", image: null },
//   //     ]);
//   //     setInputValue("");
//   //     setIsLoading(true);
//   //     setHeading(false);

//   //     // Check if the user's message is related to weather
//   //     if (
//   //       userMessage
//   //         .toLowerCase()
//   //         .includes("what is the weather || what is the temperature")
//   //     ) {
//   //       const city = userMessage.split("in")[1]?.trim() || "London"; // Default to London if no city is specified
//   //       const { weatherMessage, weatherIcon } = await fetchWeather(city);
//   //       setMessages((prev) => [
//   //         ...prev,
//   //         { text: weatherMessage, sender: "ai", image: null, weatherIcon },
//   //       ]);
//   //     } else {
//   //       const aiResponse = await fetchAIResponse(userMessage, image);
//   //       setMessages((prev) => [
//   //         ...prev,
//   //         { text: aiResponse, sender: "ai", image: null },
//   //       ]);
//   //     }
//   //     setIsLoading(false);
//   //   }
//   // };

//   ///////
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

//       // Regex to match weather-related queries with multiple prepositions
//       const weatherRegex =
//         /what is the (weather|temperature)( in | of | at )?(.*)?/i;
//       const match = userMessage.match(weatherRegex);

//       if (match) {
//         const [, type, , city] = match; // Destructure the regex match
//         const cityName = city?.trim() || "London"; // Default to London if no city is specified

//         const { weatherMessage, weatherIcon } = await fetchWeather(cityName);
//         setMessages((prev) => [
//           ...prev,
//           { text: weatherMessage, sender: "ai", image: null, weatherIcon },
//         ]);
//       } else {
//         const aiResponse = await fetchAIResponse(userMessage, image);
//         setMessages((prev) => [
//           ...prev,
//           { text: aiResponse, sender: "ai", image: null },
//         ]);
//       }
//       setIsLoading(false);
//     }
//   };
//   const handleImageUpload = async (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = async () => {
//         const imageData = reader.result;
//         const mimeType = file.type;

//         setImage(imageData);
//         setMessages((prev) => [
//           ...prev,
//           {
//             text: "Image uploaded, now analyzing...",
//             sender: "ai",
//             image: null,
//           },
//         ]);

//         const description = await fetchAIResponse(
//           "Describe this image.",
//           imageData,
//           mimeType
//         );

//         if (!description) {
//           setMessages((prev) => [
//             ...prev,
//             {
//               text: "I couldn't generate a response.",
//               sender: "ai",
//               image: null,
//             },
//           ]);
//           return;
//         }

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
//         className="md:hidden fixed top-4 left-1 z-50 p-2 bg-gray-900 rounded-lg"
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
//           <div className="flex flex-col gap-5">
//             <button className="w-full flex items-center gap-2 p-2 rounded-lg text-white hover:bg-green-700 transition">
//               <Plus className="w-5 h-5" /> New Chat
//             </button>

//             <button
//               onClick={handleClearChat}
//               className="w-full flex items-center gap-1  p-2 rounded-lg  transition"
//             >
//               <TbHttpDelete className="text-4xl" color="green" />
//               <PiChatThin className="text-2xl" color="green" />
//             </button>
//             <button className="w-full flex items-center gap-2 text-sm p-2 rounded-lg  hover:bg-gray-600 transition">
//               <LogOut className="w-4 h-4" /> Logout
//             </button>
//           </div>
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

//         <div className="flex-1 w-full max-w-2xl mx-auto overflow-y-auto p-4 space-y-4 chat-container">
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
//                 {message.weatherIcon && (
//                   <div className="mb-2">
//                     {message.weatherIcon === "sun" && (
//                       <Sun className="w-6 h-6 text-yellow-500" />
//                     )}
//                     {message.weatherIcon === "cloud" && (
//                       <Cloud className="w-6 h-6 text-red-500" />
//                     )}
//                     {message.weatherIcon === "cloud-rain" && (
//                       <CloudRain className="w-6 h-6 text-blue-500" />
//                     )}
//                     {message.weatherIcon === "cloud-lightning" && (
//                       <CloudLightning className="w-6 h-6 text-slate-400" />
//                     )}
//                     {message.weatherIcon === "snowflake" && (
//                       <Snowflake className="w-6 h-6 text-slate-100" />
//                     )}
//                     {message.weatherIcon === "cloud-drizzle" && (
//                       <CloudDrizzle className="w-6 h-6 text-sky-400" />
//                     )}
//                   </div>
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
//             ref={inputRef}
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
import {
  Plus,
  LogOut,
  Menu,
  X,
  Send,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudDrizzle,
  CloudSun,
  Cloudy,
  CloudFog,
  CloudSnow,
} from "lucide-react";
import userIcon from "./assets/working.png";
import gptImageIcon from "./assets/chatgpt.svg";
import { GoogleGenerativeAI } from "@google/generative-ai";
import DOMPurify from "dompurify";
import { TbHttpDelete } from "react-icons/tb";
import { PiChatThin } from "react-icons/pi";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Weather API URL
const API_URL =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Map weather conditions to icons and colors
const weatherIcons = {
  "clear sky": { icon: Sun, color: "text-yellow-400" }, // Yellow for sun
  "few clouds": { icon: CloudSun, color: "text-gray-400" }, // Gray for partly cloudy
  "scattered clouds": { icon: CloudSun, color: "text-gray-400" }, // Gray for scattered clouds
  "broken clouds": { icon: Cloudy, color: "text-gray-500" }, // Darker gray for broken clouds
  "overcast clouds": { icon: Cloudy, color: "text-gray-600" }, // Dark gray for overcast
  "shower rain": { icon: CloudRain, color: "text-blue-400" }, // Blue for rain
  "light intensity drizzle": { icon: CloudDrizzle, color: "text-blue-300" }, // Light blue for drizzle
  rain: { icon: CloudRain, color: "text-blue-500" }, // Darker blue for rain
  thunderstorm: { icon: CloudLightning, color: "text-purple-500" }, // Purple for thunderstorms
  snow: { icon: Snowflake, color: "text-sky-200" }, // Light blue for snow
  mist: { icon: CloudFog, color: "text-gray-300" }, // Light gray for mist
  fog: { icon: CloudFog, color: "text-gray-300" }, // Light gray for fog
  "light snow": { icon: CloudSnow, color: "text-sky-300" }, // Light blue for light snow
  "heavy snow": { icon: Snowflake, color: "text-sky-100" }, // Very light blue for heavy snow
};

// Fetch weather data
const fetchWeather = async (city) => {
  try {
    const response = await fetch(
      `${API_URL}${city}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Weather data:", data);
      const weatherDescription = data.weather[0].description;
      const temp = Math.round(data.main.temp);
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;

      // Get the weather icon and color
      const { icon: weatherIcon, color: weatherIconColor } = weatherIcons[
        weatherDescription.toLowerCase()
      ] || { icon: Cloud, color: "text-gray-400" };

      // Create a message to display
      const weatherMessage = `The weather in ${data.name} is ${weatherDescription}. The temperature is ${temp}°C with a humidity of ${humidity}%. Wind speed is ${windSpeed} km/h.`;

      // Return the weather message, icon, and color
      return { weatherMessage, weatherIcon, weatherIconColor };
    } else {
      console.error("Weather API response not OK:", response.status);
      return {
        weatherMessage: "City not found",
        weatherIcon: null,
        weatherIconColor: null,
      };
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    return {
      weatherMessage: "Sorry, I couldn't fetch the weather information.",
      weatherIcon: null,
      weatherIconColor: null,
    };
  }
};

// Fetch AI response
// const fetchAIResponse = async (
//   message,
//   imageData = null,
//   mimeType = "image/png"
// ) => {
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
//                   mimeType: mimeType,
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

const fetchAIResponse = async (
  message,
  imageData = null,
  mimeType = "image/png"
) => {
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
                  mimeType: mimeType,
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
    throw error; // Re-throw the error to handle it in the calling function
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
    try {
      const savedMessages = JSON.parse(localStorage.getItem("chatMessages"));
      setHeading(!(savedMessages && savedMessages.length > 0));
    } catch (error) {
      console.error("Error parsing localStorage:", error);
      localStorage.removeItem("chatMessages");
    }
  }, []);

  useEffect(() => {
    if (messages.length > 50) {
      setMessages(messages.slice(-50));
    }
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleFocus = () => {
      window.scrollTo(0, 0);
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

      // Regex to match weather-related queries with multiple prepositions
      const weatherRegex =
        /what is the (weather|temperature)( in | of | at )?(.*)?/i;
      const match = userMessage.match(weatherRegex);

      if (match) {
        const [, type, , city] = match; // Destructure the regex match
        const cityName = city?.trim() || "London"; // Default to London if no city is specified

        const { weatherMessage, weatherIcon, weatherIconColor } =
          await fetchWeather(cityName);
        setMessages((prev) => [
          ...prev,
          {
            text: weatherMessage,
            sender: "ai",
            image: null,
            weatherIcon,
            weatherIconColor,
          },
        ]);
      } else {
        const aiResponse = await fetchAIResponse(userMessage, image);
        setMessages((prev) => [
          ...prev,
          { text: aiResponse, sender: "ai", image: null },
        ]);
      }
      setIsLoading(false);
    }
  };

  // const handleImageUpload = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = async () => {
  //       const imageData = reader.result;
  //       const mimeType = file.type;

  //       setImage(imageData);
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           text: "Image uploaded, now analyzing...",
  //           sender: "ai",
  //           image: null,
  //         },
  //       ]);

  //       const description = await fetchAIResponse(
  //         "Describe this image.",
  //         imageData,
  //         mimeType
  //       );

  //       if (!description) {
  //         setMessages((prev) => [
  //           ...prev,
  //           {
  //             text: "I couldn't generate a response.",
  //             sender: "ai",
  //             image: null,
  //           },
  //         ]);
  //         return;
  //       }

  //       setMessages((prev) => [
  //         ...prev,
  //         { text: description, sender: "ai", image: imageData },
  //       ]);
  //     };

  //     setHeading(false);
  //     reader.readAsDataURL(file);
  //   }
  // };

  ///
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate the file type
      const supportedFormats = ["image/jpeg", "image/png", "image/webp"];
      if (!supportedFormats.includes(file.type)) {
        setMessages((prev) => [
          ...prev,
          {
            text: "Please upload a valid image file (JPEG, PNG, or WebP).",
            sender: "ai",
            image: null,
          },
        ]);
        return;
      }

      // Validate the file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setMessages((prev) => [
          ...prev,
          {
            text: "Image is too large. Please upload an image smaller than 5MB.",
            sender: "ai",
            image: null,
          },
        ]);
        return;
      }

      setIsLoading(true); // Start loading

      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result;
        const mimeType = file.type;

        // Compress the image if necessary
        const compressedImageData = await compressImage(imageData, mimeType);

        setImage(compressedImageData);
        setMessages((prev) => [
          ...prev,
          {
            text: "Image uploaded, now analyzing...",
            sender: "ai",
            image: null,
          },
        ]);

        try {
          const description = await fetchAIResponse(
            "Describe this image.",
            compressedImageData,
            mimeType
          );

          if (!description) {
            setMessages((prev) => [
              ...prev,
              {
                text: "I couldn't generate a response.",
                sender: "ai",
                image: null,
              },
            ]);
            return;
          }

          setMessages((prev) => [
            ...prev,
            { text: description, sender: "ai", image: compressedImageData },
          ]);
        } catch (error) {
          console.error("Error analyzing image:", error);
          setMessages((prev) => [
            ...prev,
            {
              text: "Sorry, I couldn't analyze the image. Please try again.",
              sender: "ai",
              image: null,
            },
          ]);
        } finally {
          setIsLoading(false); // Stop loading
        }
      };

      setHeading(false);
      reader.readAsDataURL(file);
    }
  };

  const compressImage = async (
    imageData,
    mimeType,
    maxWidth = 800,
    quality = 0.8
  ) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageData;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate new dimensions
        const scale = Math.min(maxWidth / img.width, 1);
        const width = img.width * scale;
        const height = img.height * scale;

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert the canvas to a data URL with reduced quality
        canvas.toBlob(
          (blob) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          },
          mimeType,
          quality
        );
      };

      img.onerror = (error) => reject(error);
    });
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
          <div className="flex flex-col gap-5">
            <button className="w-full flex items-center gap-2 p-2 rounded-lg text-white hover:bg-green-700 transition">
              <Plus className="w-5 h-5" /> New Chat
            </button>

            <button
              onClick={handleClearChat}
              className="w-full flex items-center gap-1  p-2 rounded-lg  transition"
            >
              <TbHttpDelete className="text-4xl" color="green" />
              <PiChatThin className="text-2xl" color="green" />
            </button>
            <button className="w-full flex items-center gap-2 text-sm p-2 rounded-lg  hover:bg-gray-600 transition">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
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
                {message.weatherIcon && (
                  <div className="mb-2">
                    {React.createElement(message.weatherIcon, {
                      className: `w-6 h-6 ${message.weatherIconColor}`, // Apply the color
                    })}
                  </div>
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
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-paperclip"
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
