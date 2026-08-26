import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";

export default function PassengerChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! Welcome to eBus Lanka. How can I help you find a bus today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoggedInPassenger, setIsLoggedInPassenger] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // මගියා ලොග් වී ඇත්දැයි පරීක්ෂා කිරීම (Token සහ Role එක බැලීම)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole"); // හෝ passenger කෙනෙක්ට වෙනම role එකක් තිබේ නම්

    if (token) {
      setIsLoggedInPassenger(true);
    }
  }, []);

  // මගියා ලොග් වී නැත්නම් විජට් එක පෙන්වන්නේ නැත
  if (!isLoggedInPassenger) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const userMsg = inputMessage;
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInputMessage("");
    setIsSending(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${backendUrl}/api/chat/passenger-chat`, 
        { message: userMsg },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiReply = response.data.reply;
      setMessages(prev => [...prev, { sender: "ai", text: aiReply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { sender: "ai", text: "Sorry, I am having trouble connecting right now." }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
          title="Chat with AI Assistant"
        >
          <FaCommentDots className="text-2xl" />
        </button>
      ) : (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-fadeIn">
          
          {/* Chat Header */}
          <div className="bg-green-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold text-sm">eBus AI Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user" 
                      ? "bg-green-600 text-white rounded-br-none" 
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-500 p-3 rounded-2xl text-xs border border-gray-200 animate-pulse">
                  AI is typing...
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about buses, routes..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={isSending}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition flex items-center justify-center disabled:bg-gray-400"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}