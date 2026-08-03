import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "../axios";
import AppContext from "../Context/Context";
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const QUICK_PROMPTS = [
  "What laptops do you have?",
  "Show me headphones under ₹5000",
  "What's in stock?",
  "Recommend a mobile phone",
];

const CHAT_CONVERSATION_KEY = "shopgrid_chat_conversation_id";

const getOrCreateConversationId = () => {
  const existingId = window.localStorage.getItem(CHAT_CONVERSATION_KEY);
  if (existingId) {
    return existingId;
  }

  const newId =
    window.crypto?.randomUUID?.() ??
    `chat_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(CHAT_CONVERSATION_KEY, newId);
  return newId;
};

const BotMessage = ({ message }) => (
  <div className="d-flex align-items-start gap-2 mb-3">
    <div
      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
      style={{
        width: "32px",
        height: "32px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontSize: "0.7rem",
        color: "#fff",
        fontWeight: "bold",
      }}
    >
      AI
    </div>
    <div
      className="px-3 py-2 rounded-lg"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        fontSize: "0.875rem",
        lineHeight: "1.5",
        color: "var(--text-primary)",
        maxWidth: "85%",
        borderRadius: "4px 12px 12px 12px",
      }}
    >
      {message}
    </div>
  </div>
);

const UserMessage = ({ message }) => (
  <div className="d-flex justify-content-end mb-3">
    <div
      className="px-3 py-2"
      style={{
        background: "var(--accent-primary)",
        color: "#fff",
        fontSize: "0.875rem",
        lineHeight: "1.5",
        maxWidth: "85%",
        borderRadius: "12px 4px 12px 12px",
      }}
    >
      {message}
    </div>
  </div>
);

const TypingIndicator = () => (
  <div className="d-flex align-items-start gap-2 mb-3">
    <div
      className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
      style={{
        width: "32px",
        height: "32px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontSize: "0.7rem",
        color: "#fff",
        fontWeight: "bold",
      }}
    >
      AI
    </div>
    <div
      className="px-3 py-2 rounded-lg d-flex align-items-center gap-1"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        borderRadius: "4px 12px 12px 12px",
        minHeight: "38px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "var(--text-muted)",
            display: "inline-block",
            animation: `chatBotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  </div>
);

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [conversationId] = useState(() => getOrCreateConversationId());
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your ShopGrid AI assistant 🛍️\nAsk me anything about our products, availability, or recommendations!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const query = (text || input).trim();
    if (!query || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.get(`/chat/ask`, {
        params: {
          message: query,
          conversationId,
        },
      });
      setMessages((prev) => [...prev, { role: "bot", text: response.data }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I couldn't reach the server. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const chatWidth = isExpanded ? "420px" : "360px";
  const chatHeight = isExpanded ? "600px" : "480px";

  return (
    <>
      {/* Bouncing dot indicator when closed */}
      <style>{`
        @keyframes chatBotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chatBotPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      {/* Floating Trigger Button */}
      <div
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          zIndex: 1200,
        }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                boxShadow: "0 8px 25px rgba(102,126,234,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "chatBotPulse 2s ease-in-out infinite",
              }}
              title="Chat with AI Assistant"
            >
              <FiMessageSquare size={24} />
              {hasUnread && (
                <span
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    border: "2px solid white",
                  }}
                />
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "fixed",
                bottom: "28px",
                right: "28px",
                width: chatWidth,
                height: chatHeight,
                borderRadius: "16px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                zIndex: 1200,
                transition: "width 0.2s ease, height 0.2s ease",
              }}
            >
              {/* Chat Header */}
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "#fff",
                    fontWeight: "bold",
                    border: "2px solid rgba(255,255,255,0.4)",
                  }}
                >
                  AI
                </div>
                <div className="flex-grow-1">
                  <div style={{ color: "#fff", fontWeight: "600", fontSize: "0.9rem" }}>
                    ShopGrid AI Assistant
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>
                    Powered by Gemini • Always online
                  </div>
                </div>
                <div className="d-flex gap-1">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "none",
                      color: "#fff",
                      borderRadius: "6px",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    title={isExpanded ? "Minimize" : "Expand"}
                  >
                    {isExpanded ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "none",
                      color: "#fff",
                      borderRadius: "6px",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    title="Close"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px",
                  scrollbarWidth: "thin",
                  scrollbarColor: "var(--border-color) transparent",
                }}
              >
                {messages.map((msg, i) =>
                  msg.role === "bot" ? (
                    <BotMessage key={i} message={msg.text} />
                  ) : (
                    <UserMessage key={i} message={msg.text} />
                  )
                )}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 2 && !isLoading && (
                <div
                  style={{
                    padding: "0 12px 8px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                    flexShrink: 0,
                  }}
                >
                  {QUICK_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      style={{
                        fontSize: "0.75rem",
                        padding: "4px 10px",
                        borderRadius: "50px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div
                style={{
                  padding: "12px",
                  borderTop: "1px solid var(--border-color)",
                  display: "flex",
                  gap: "8px",
                  flexShrink: 0,
                  background: "var(--bg-card)",
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about products, stock, prices..."
                  rows={1}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    resize: "none",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "0.875rem",
                    background: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                    outline: "none",
                    fontFamily: "inherit",
                    lineHeight: "1.4",
                  }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background:
                      !input.trim() || isLoading
                        ? "var(--border-color)"
                        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    border: "none",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: !input.trim() || isLoading ? "not-allowed" : "pointer",
                    flexShrink: 0,
                    alignSelf: "flex-end",
                  }}
                >
                  <FiSend size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ChatBot;
