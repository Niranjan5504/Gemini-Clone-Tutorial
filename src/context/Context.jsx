import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
  };

  const onSent = async (prompt, language) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response;
    const finalPrompt = `${prompt || input} [${language}]`;

    try {
      if (prompt !== undefined) {
        response = await run(finalPrompt,language );
        setRecentPrompt(response);
        console.log(response)
      } else {
        setPrevPrompt((prev) => [...prev, input]);
        response = await run(finalPrompt, language);
        setRecentPrompt(response);
        console.log(response)
      }


    } catch (error) {
      console.error("API Error:", error);
      setResultData("Error processing your request. Please try again.");
    }

    setLoading(false);
    setInput("");
  };

  const contextValue = {
    input,
    setInput,
    selectedLanguage,
    setSelectedLanguage,
    recentPrompt,
    prevPrompt,
    showResult,
    loading,
    resultData,
    onSent,
    newChat
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;