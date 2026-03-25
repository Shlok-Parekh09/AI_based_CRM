import { useState, useRef, useEffect } from "react";
import { SparklesIcon, SendIcon } from "../components/Icons";

export default function AIAgent() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "agent",
      text: "Hi there! I'm your Sales AI Assistant. I can help you draft emails, summarize account histories, or find contact details. What would you like to do today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = { id: Date.now(), role: "user", text: inputValue };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");

    // Simulate AI response (we'll replace this with backend API call later)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: "agent",
        text: "I am a UI mockup right now! Once we build the Python backend, I will connect to real CRM data and answer this for you.",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const suggestions = [
    "Draft a follow-up email to Brian Halligan",
    "Summarize my interactions with Avataar Corp",
    "List all unassigned high-value leads",
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 text-orange-600">
          <SparklesIcon />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">Sales Copilot</h2>
          <p className="text-xs text-gray-500">Always active and ready to help</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm shadow-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 hide-scrollbar">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => setInputValue(suggestion)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your AI agent anything..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-700 transition-colors"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
}