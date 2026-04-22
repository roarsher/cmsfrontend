
import React, { useState, useRef, useEffect, useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

// ── Quick action chips based on login state + role ────────────────────────────
const QUICK_ACTIONS_LOGGED_OUT = [
  { label: "🏛 About BCE",         msg: "Tell me about Bhagalpur College of Engineering" },
  { label: "📋 Admission process",  msg: "How to get admission in BCE Bhagalpur?" },
  { label: "💰 Fee structure",      msg: "What is the fee structure of BCE Bhagalpur?" },
  { label: "📞 Contact",           msg: "What are the contact details of BCE Bhagalpur?" },
  { label: "🏆 Cutoff / Ranking",  msg: "What is the cutoff and ranking of BCE Bhagalpur?" },
];

const QUICK_ACTIONS_STUDENT = [
  { label: "📊 My attendance",     msg: "What is my current attendance percentage?" },
  { label: "🏆 My marks",         msg: "Show me my marks and CGPA" },
  { label: "🗓 Today's routine",   msg: "What are my classes today?" },
  { label: "📢 Latest notices",    msg: "Show me the latest notices" },
  { label: "📝 Online test",       msg: "Is there any online test or Google Form test available?" },
  { label: "⚠️ Low attendance",    msg: "Which subjects have my attendance below 75%?" },
  { label: "💰 Fee status",        msg: "Tell me about fee payment" },
  { label: "🌐 Check result",      msg: "How do I check my semester result?" },
];

const QUICK_ACTIONS_TEACHER = [
  { label: "🗓 My classes today",  msg: "What are my classes scheduled for today?" },
  { label: "📢 Latest notices",   msg: "Show me the latest college notices" },
  { label: "👥 My students",      msg: "Tell me about marking attendance for my students" },
  { label: "📝 Add marks",        msg: "How do I add marks for students?" },
];

// ── Typing animation hook ─────────────────────────────────────────────────────
const useTypingEffect = () => {
  const [typingId, setTypingId] = useState(null);
  const startTyping = (fullText, onUpdate, onDone) => {
    if (typingId) clearInterval(typingId);
    let i = 0;
    const id = setInterval(() => {
      i++;
      onUpdate(fullText.slice(0, i));
      if (i >= fullText.length) { clearInterval(id); onDone?.(); }
    }, 12);
    setTypingId(id);
  };
  useEffect(() => () => { if (typingId) clearInterval(typingId); }, [typingId]);
  return { startTyping };
};

// ─────────────────────────────────────────────────────────────────────────────
const AiHelpdesk = () => {
  const { user } = useContext(AuthContext);
  const navigate  = useNavigate();
  const { startTyping } = useTypingEffect();

  const [isOpen, setIsOpen]     = useState(false);
  const [message, setMessage]   = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  const inputRef   = useRef(null);

  const quickActions = !user
    ? QUICK_ACTIONS_LOGGED_OUT
    : user.role === "teacher"
    ? QUICK_ACTIONS_TEACHER
    : QUICK_ACTIONS_STUDENT;

  // Init welcome message based on auth state
  useEffect(() => {
    const welcome = user
      ? `👋 Hello **${user.name}**! I'm BCE Assistant.\n\nI can answer questions about your **attendance, marks, today's classes, notices**, and anything about **BCE Bhagalpur**.\n\nWhat would you like to know?`
      : `🏛 Welcome to **BCE Bhagalpur AI Assistant**!\n\nI can help you with:\n- 📋 Admission process & eligibility\n- 💰 Fee structure\n- 🏆 Cutoff & rankings\n- 📞 Contact details\n\nFor **attendance, marks, routine** — please login first.\n\nHow can I help you?`;
    setChatHistory([{ sender: "ai", text: welcome, id: Date.now() }]);
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [chatHistory, isLoading, isOpen]);

  const sendMessage = async (text) => {
    const msg = (text || message).trim();
    if (!msg || isLoading || isTyping) return;

    // Special handling — online test
    if (msg.toLowerCase().includes("online test") || msg.toLowerCase().includes("google form")) {
      const testMsg = user
        ? `📝 **Online Tests / Google Form Tests**\n\nYour teacher will share Google Form links for online tests.\n\nCheck the **Notices** section for test links posted by your teacher or admin.\n\n👉 [Go to Dashboard](/${user.role})`
        : `Please **login first** to see your online test links.\n\n👉 [Login here](/login)`;
      setChatHistory(prev => [
        ...prev,
        { sender: "user", text: msg, id: Date.now() },
        { sender: "ai", text: testMsg, id: Date.now() + 1 },
      ]);
      setMessage("");
      return;
    }

    const userMsgId = Date.now();
    const aiMsgId   = Date.now() + 1;

    setChatHistory(prev => [...prev, { sender: "user", text: msg, id: userMsgId }]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await API.post("/ai/chat", {
        message: msg,
        userId:  user?._id || null,
        role:    user?.role || null,
      });

      setIsLoading(false);
      setChatHistory(prev => [...prev, { sender: "ai", text: "", id: aiMsgId }]);
      setIsTyping(true);

      setTimeout(() => {
        startTyping(
          res.data.reply,
          (partial) => setChatHistory(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: partial } : m)),
          () => setIsTyping(false)
        );
      }, 200);

    } catch (e) {
      setIsLoading(false);
      setChatHistory(prev => [...prev, {
        sender: "ai",
        text: "⚠️ I'm having trouble connecting. Please try again.",
        id: aiMsgId,
      }]);
    }
  };

  const clearChat = () => {
    const welcome = user
      ? `👋 Hello **${user.name}**! How can I help you?`
      : `🏛 Welcome! How can I help you with BCE Bhagalpur?`;
    setChatHistory([{ sender: "ai", text: welcome, id: Date.now() }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end gap-3">

      {/* Chat window */}
      {isOpen && (
        <div className="w-[370px] h-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          style={{ animation: "slideUp 0.2s ease" }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-slate-900 font-black text-sm shadow">
                BCE
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">BCE Assistant</p>
                <p className="text-slate-400 text-xs">Bhagalpur College of Engineering</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearChat} title="Clear chat"
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition">
                🔄
              </button>
              <button onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition text-lg">
                ✕
              </button>
            </div>
          </div>

          {/* Login prompt banner */}
          {!user && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
              <p className="text-xs text-yellow-700 font-semibold">Login to check attendance, marks & more</p>
              <button onClick={() => { navigate("/login"); setIsOpen(false); }}
                className="text-xs bg-yellow-500 text-white px-3 py-1 rounded-full font-bold hover:bg-yellow-600 transition">
                Login →
              </button>
            </div>
          )}

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
            {chatHistory.map((chat) => (
              <div key={chat.id} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                {chat.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-yellow-400 font-black text-xs mr-2 mt-1 shrink-0">
                    B
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  chat.sender === "user"
                    ? "bg-slate-800 text-white rounded-tr-sm"
                    : "bg-white text-slate-700 rounded-tl-sm border border-slate-100"
                }`}>
                  {chat.sender === "ai" ? (
                    <div className="prose prose-sm max-w-none text-slate-700 [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{chat.text}</ReactMarkdown>
                    </div>
                  ) : chat.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 ml-9">
                <div className="bg-white rounded-2xl px-4 py-3 flex gap-1 shadow-sm border border-slate-100">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick action chips */}
          <div className="px-3 py-2 border-t border-slate-100 bg-white">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {quickActions.map((a, i) => (
                <button key={i} onClick={() => sendMessage(a.msg)}
                  disabled={isLoading || isTyping}
                  className="shrink-0 text-xs bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-600 px-3 py-1.5 rounded-full font-semibold transition disabled:opacity-50 whitespace-nowrap">
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-2 px-3 py-3 border-t border-slate-100 bg-white">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={user ? "Ask about attendance, marks..." : "Ask about BCE Bhagalpur..."}
              disabled={isLoading || isTyping}
              className="flex-1 bg-slate-100 text-slate-800 text-sm px-4 py-2.5 rounded-2xl outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-slate-400 disabled:opacity-60 transition"
            />
            <button onClick={() => sendMessage()} disabled={isLoading || isTyping || !message.trim()}
              className="w-10 h-10 bg-slate-800 text-white rounded-2xl flex items-center justify-center hover:bg-slate-700 disabled:opacity-50 transition shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button onClick={() => setIsOpen(o => !o)}
        className="w-14 h-14 bg-slate-800 hover:bg-slate-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ animation: isOpen ? "none" : "pulse 2s infinite" }}>
        {isOpen
          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <span className="text-2xl">💬</span>
        }
      </button>

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(30,41,59,0.4); } 50% { box-shadow: 0 0 0 12px rgba(30,41,59,0); } }
        .scrollbar-hide::-webkit-scrollbar { display:none; }
        .scrollbar-hide { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  );
};

export default AiHelpdesk;