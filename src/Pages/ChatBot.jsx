import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ChatBot = () => {
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
      generateAnswer();
    }
  };

  const generateAnswer = async () => {
    if (!question) {
      alert("Please Enter Question");
    } else {
      const response = await axios({
        method: 'post',
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBNkkgJXShiDC-oNaUp7Y7D_Ueo3S_myeA',
        data: {
          contents: [{
            parts: [{ text: question }]
          }]
        }
      });

      setAnswer(response.data.candidates[0].content.parts[0].text);
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

      <div className="flex">
        <button onClick={generateAnswer} className="w-24 m-3.5 border bg-blue-500 text-white rounded-xl" type="submit">Generate Answer</button>
        <button onClick={handleClear} className="w-24 m-3.5 border bg-blue-500 text-white rounded-xl" type="submit">Clear</button>
        <Link to="/voice-page" className="w-24 m-3.5 p-2 border bg-blue-500 text-white rounded-xl" type="submit">Voice Chat</Link>
      </div>
    </div>
  );
};

export default ChatBot;
