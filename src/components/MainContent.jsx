import React, { useContext, useState, useEffect, useRef } from "react";
import {
  FaUtensils,
  FaCheese,
  FaCookieBite,
  FaMicrophone,
  FaUserCircle,
} from "react-icons/fa";
import { MdDinnerDining, MdAddPhotoAlternate } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { Context } from "../context/Context";

const languages = [
  { name: "English", code: "en-US" },
  { name: "தமிழ்", code: "ta-IN" },
  { name: "Français", code: "fr-FR" },
  { name: "മലയാളം", code: "ml-IN" },
  { name: "తెలుగు", code: "te-IN" },
  { name: "ಕನ್ನಡ", code: "kn-IN" },
  { name: "हिन्दी", code: "hi-IN" },
];

const MainContent = () => {
  const {
    input,
    setInput,
    recentPrompt,
    showResult,
    loading,
    onSent,
    selectedLanguage,
    setSelectedLanguage, // Add this
  } = useContext(Context);

  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = selectedLanguage;

      recognitionRef.current.onstart = () => setIsListening(true);
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert('Please allow microphone access in browser settings');
        } else if (event.error === 'network') {
          alert('Network error - Check internet connection');
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage;
    }
  }, [selectedLanguage]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.abort();
      recognitionRef.current.start();
    }
  };

  const formatRecipeData = (data) => {
    return data
      .replace(/\n/g, "<br/>")
      .replace(/- /g, "🍴 ")
      .replace(/Ingredients:/g, "🥕 Ingredients:")
      .replace(/Instructions:/g, "📝 Instructions:")
      .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") // Bold text wrapped in **
      .replace(/(Type:)/g, "<b>$1</b>")      // Bold "Type:"
      .replace(/(Duration:)/g, "<b>$1</b>");  // Bold "Duration:"
  };
  

  return (
    <div className="flex-1 min-h-screen pb-[15vh] relative bg-orange-50">
      <div className="flex items-center justify-between text-xl p-5 text-orange-900">
        <div className="flex items-center gap-3">
          <FaUtensils className="text-3xl text-orange-600" />
          <p className="font-bold">ChefGPT</p>
          <select
            className="ml-4 bg-orange-100 px-2 py-1 rounded-md text-sm md:text-base"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <FaUserCircle className="text-3xl" />
      </div>

      <div className="max-w-[900px] mx-auto">
        {!showResult ? (
          <>
            <div className="my-12 text-[56px] text-orange-900 font-semibold p-5">
              <p>
                <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Hello, Chef!
                </span>
              </p>
              <p className="text-orange-700">What's cooking today?</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
              <div className="h-[200px] p-4 bg-orange-100 rounded-lg relative cursor-pointer hover:bg-orange-200">
                <p className="text-orange-900 text-lg">
                  Suggest a 3-course Indian meal
                </p>
                <MdDinnerDining className="text-4xl p-1 absolute bottom-2 right-2 text-orange-600" />
              </div>

              <div className="h-[200px] p-4 bg-orange-100 rounded-lg relative cursor-pointer hover:bg-orange-200">
                <p className="text-orange-900 text-lg">
                  How to make perfect biryani?
                </p>
                <FaCheese className="text-4xl p-1 absolute bottom-2 right-2 text-orange-600" />
              </div>

              <div className="h-[200px] p-4 bg-orange-100 rounded-lg relative cursor-pointer hover:bg-orange-200">
                <p className="text-orange-900 text-lg">
                  Vegan South Indian recipes
                </p>
                <FaCookieBite className="text-4xl p-1 absolute bottom-2 right-2 text-orange-600" />
              </div>

              <div className="h-[200px] p-4 bg-orange-100 rounded-lg relative cursor-pointer hover:bg-orange-200">
                <p className="text-orange-900 text-lg">
                  Quick 30-minute Indian snacks
                </p>
                <FaUtensils className="text-4xl p-1 absolute bottom-2 right-2 text-orange-600" />
              </div>
            </div>
          </>
        ) : (
          <div className="py-0 px-[5%] max-h-[70vh] overflow-y-scroll scrollbar-hidden">
            <div className="my-10 mx-0 flex items-center gap-5">
              <FaUserCircle className="text-3xl text-orange-600" />
              <p className="text-lg font-[400] leading-[1.8] text-orange-900">
                {input}
              </p>
            </div>

            <div className="flex items-start gap-5">
              <FaUtensils className="text-3xl text-orange-600" />

              {loading ? (
                <div className="w-full flex flex-col gap-2">
                  <hr className="rounded-md border-none bg-orange-200 bg-gradient-to-r from-orange-400 via-orange-100 to-orange-400 p-4 animate-scroll-bg" />
                  <hr className="rounded-md border-none bg-orange-200 bg-gradient-to-r from-orange-400 via-orange-100 to-orange-400 p-4 animate-scroll-bg" />
                  <hr className="rounded-md border-none bg-orange-200 bg-gradient-to-r from-orange-400 via-orange-100 to-orange-400 p-4 animate-scroll-bg" />
                </div>
              ) : (
                <div
                  className="text-lg font-[400] leading-[1.8] text-orange-900"
                  dangerouslySetInnerHTML={{
                    __html: formatRecipeData(recentPrompt),
                  }}
                ></div>
              )}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 w-full max-w-[900px] px-5 mx-auto mt-5">
          <div className="flex items-center justify-between gap-20 bg-orange-100 py-2 px-5 rounded-full">
            <input
              type="text"
              placeholder="Ask ChefGPT anything about cooking..."
              className="flex-1 bg-transparent border-none outline-none p-2 text-lg text-orange-900 placeholder-orange-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSent(input, selectedLanguage)}
            />

            <div className="flex gap-4 items-center">
              <MdAddPhotoAlternate className="text-2xl cursor-pointer text-orange-600 hover:text-orange-700 transition-colors" />
              <FaMicrophone
                className={`text-2xl cursor-pointer ${
                  isListening ? "text-orange-700 animate-pulse" : "text-orange-600"
                } hover:text-orange-700 transition-colors`}
                onClick={handleMicClick}
              />
              {input && (
                <IoMdSend
                  onClick={() => onSent(input, selectedLanguage)}
                  className="text-2xl cursor-pointer text-orange-600 hover:text-orange-700 transition-colors"
                />
              )}
            </div>
          </div>

          <p className="text-sm my-4 mx-auto text-center font-[500] text-orange-700">
            ChefGPT may suggest regional variations - verify ingredients based on local availability.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;