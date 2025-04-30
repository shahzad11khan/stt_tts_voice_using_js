import axios from 'axios';
import React, { useState } from 'react';

const VoicePage = () => {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");

  const handleChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleClear = () => {
    setAnswer("");
    setQuestion("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      generateAnswer(question);
    }
  };

  const handleSpeak = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setTimeout(() => {
        generateAnswer(transcript);
      }, 2000);
    };

    recognition.start();

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const textToSpeak = answer || question || "Hello, I am your assistant, please ask something.";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };

  const generateAnswer = async (transcriptQuestion) => {
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBNkkgJXShiDC-oNaUp7Y7D_Ueo3S_myeA',
        {
          contents: [{
            parts: [{ text: transcriptQuestion }]
          }]
        }
      );

      const generatedAnswer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedAnswer) {
        setAnswer(generatedAnswer);
        handleSpeak();
      } else {
        setAnswer("Sorry, I couldn't understand that question.");
      }
    } catch (error) {
      console.error('Error generating answer:', error);
      setAnswer("An error occurred while processing your request.");
    }
  };

  return (
    <div className="flex flex-col mx-auto mt-36 w-96 border rounded-lg shadow-md">
      <div className="w-full bg-blue-500 text-white text-center py-3 rounded-t-lg">
        <h3 className="text-lg font-semibold">Chatbot</h3>
      </div>

      <div className="p-5">
        <p className="text-center text-gray-700 mb-3">Let's Chat</p>
        <input
          type="text"
          onChange={handleChange}
          value={question}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <p className="mt-5 p-5 border">
          {answer}
        </p>
      </div>

      <div className="flex flex-wrap justify-center">
        <button onClick={handleSpeak} className="w-36 m-3.5 border bg-blue-500 text-white rounded-xl">
          Speak
        </button>
        <button onClick={() => generateAnswer(question)} className="w-36 m-3.5 border bg-blue-500 text-white rounded-xl">
          Ask
        </button>
        <button onClick={handleClear} className="w-36 m-3.5 border bg-blue-500 text-white rounded-xl">
          Clear
        </button>
      </div>
    </div>
  );
};

export default VoicePage;
 