import axios from 'axios';
import React, { useState, useRef } from 'react';

const VoicePage = () => {
  const [messages, setMessages] = useState([]); 
  const firstTime = useRef(true); 
  const recognitionRef = useRef(null);

  const speakAnswer = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support speech synthesis.");
    }
  };

  const handleSpeak = () => {
    if (firstTime.current) {
      const welcomeText = "I am your assistant, how can I help you?";
      speakAnswer(welcomeText);
      setMessages(prev => [...prev, { type: 'bot', text: welcomeText }]);
      firstTime.current = false;
    }
    startListening();
  };

  const startListening = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setMessages(prev => [...prev, { type: 'user', text: transcript }]);
      await generateAnswer(transcript);
      startListening();
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      startListening();
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleStop = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    recognitionRef.current = null;
  };

  const handleClear = () => {

    setMessages([]);
  };

  const generateAnswer = async (transcriptQuestion) => {
    try {
      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBNkkgJXShiDC-oNaUp7Y7D_Ueo3S_myeA',
        {
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: "You are a sport assistant. Only answer questions related to sport in just one sentence. If it's not about sport, reply: 'Sorry, I can only help with sport-related queries.'"
                }
              ]
            },
            {
              role: "user",
              parts: [
                { text: transcriptQuestion }
              ]
            }
          ]
        }
      );

      const generatedAnswer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedAnswer) {
        setMessages(prev => [...prev, { type: 'bot', text: generatedAnswer }]);
        speakAnswer(generatedAnswer);
      } else {
        const fallback = "Sorry, I couldn't understand that question.";
        setMessages(prev => [...prev, { type: 'bot', text: fallback }]);
      }
    } catch (error) {
      console.error('Error generating answer:', error.response?.data || error.message);
      setMessages(prev => [...prev, { type: 'bot', text: "An error occurred while processing your request." }]);
    }
  };

  return (
    <div className="flex flex-col mx-auto mt-24 w-[400px] h-[500px] border rounded-lg shadow-lg bg-white overflow-hidden">
      <div className="bg-blue-600 text-white text-center py-3">
        <h3 className="text-lg font-bold">Sports Chat Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 "
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
   <div className="flex justify-center text-gray-500 ">
            {messages.length === 0 ? <p>How can I assist you with sports today?</p> : null}
          </div>     
           {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] px-4 py-2 rounded-lg shadow 
              ${msg.type === 'user' ? 'bg-blue-500 text-white self-end ml-auto rounded-xl rounded-bl-none' : 'bg-gray-200 text-gray-900 self-start mr-auto rounded-br-none'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 p-3 border-t bg-gray-50">
        <button onClick={handleSpeak} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Speak</button>
        <button onClick={handleStop} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Stop</button>
        <button onClick={handleClear} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Clear</button>
      </div>
    </div>
  );
};

export default VoicePage;