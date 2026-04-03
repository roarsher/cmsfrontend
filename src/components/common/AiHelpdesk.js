 import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AiHelpdesk = ({ role = "student" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "ai", text: "Hello! I am the BCE Helpdesk. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  // Typing animation function
  const typeMessage = (fullText) => {
    let index = 0;
    let typed = "";

    const interval = setInterval(() => {
      typed += fullText[index];
      index++;

      setChatHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = typed;
        return updated;
      });

      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 15); // typing speed
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    const newHistory = [...chatHistory, { sender: "student", text: userMessage }];
    setChatHistory(newHistory);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(" https://smartcollegemanagementsystem.onrender.com/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, role })
      });

      const data = await response.json();
      if (!response.ok) throw new Error("Server error");

      // Add empty AI message first
      setChatHistory(prev => [...prev, { sender: "ai", text: "" }]);
      setIsLoading(false);

      // Start typing animation
      setTimeout(() => {
        typeMessage(data.reply);
      }, 300);

    } catch (error) {
      setChatHistory(prev => [
        ...prev,
        { sender: "ai", text: "⚠️ Server error. Please try again." }
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000 }}>
      
      {isOpen && (
        <div style={{
          width: "380px",
          height: "500px",
          backgroundColor: "white",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>

          {/* Header */}
          <div style={{
            background: "#007bff",
            color: "white",
            padding: "15px",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between"
          }}>
            🤖 BCE AI Helpdesk
            <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>✖</button>
          </div>

          {/* Chat Area */}
          <div style={{
            flex: 1,
            padding: "15px",
            overflowY: "auto",
            background: "#f5f7fb"
          }}>
            {chatHistory.map((chat, index) => (
              <div key={index} style={{
                textAlign: chat.sender === "student" ? "right" : "left",
                marginBottom: "12px"
              }}>
                <div style={{
                  background: chat.sender === "student" ? "#d1e7dd" : "white",
                  padding: "12px",
                  borderRadius: "18px",
                  maxWidth: "85%",
                  display: "inline-block",
                  fontSize: "14px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                }}>
                  {chat.sender === "ai" ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {chat.text}
                    </ReactMarkdown>
                  ) : (
                    chat.text
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ fontSize: "13px", color: "#888" }}>
                🤖 AI is thinking...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            display: "flex",
            padding: "12px",
            borderTop: "1px solid #eee",
            background: "white"
          }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask anything..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                outline: "none"
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              style={{
                marginLeft: "10px",
                padding: "8px 16px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          background: "#007bff",
          color: "white",
          fontSize: "26px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)"
        }}
      >
        💬
      </button>
    </div>
  );
};

export default AiHelpdesk;
