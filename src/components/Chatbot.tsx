"use client";

import { useState } from "react";
import { usePathname } from "next/navigation"; 
import "./chatbot.css";

export default function Chatbot() {
  const pathname = usePathname() || ""; 

  // All hooks must be called before any conditional returns
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const hiddenRoutes = [
    "/login",
    "/signup",
    "/reset-password",
    "/forgot-password",
    "/otp-verification",
  ];

  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "This is a sample response!" },
      ]);
    }, 800);
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-button" onClick={() => setIsOpen(true)}>
          <i className="fas fa-comment-dots"></i>
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>Chat with us</span>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} className="chatbot-send">
              <i className="fas fa-microphone"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
