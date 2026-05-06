"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot } from "lucide-react";
import { useStore, ChatMessage } from "@/lib/store";
import { streamAIResponse, getQuickReplies } from "@/lib/ai";
import { PILLARS, PillarId } from "@/lib/constants";

export default function ChatPage() {
  const { state, addChatMessage, updateChatMessage } = useStore();
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>(getQuickReplies());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages, isStreaming]);

  // Welcome message
  useEffect(() => {
    if (state.chatMessages.length === 0) {
      const welcome: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Hey ${state.user?.name?.split(" ")[0] || "there"}! 🌿 I'm Ooddle, your personal wellness companion. I'm here to help across all five pillars of health — metabolic, movement, cognition, recovery, and supplements.\n\nWhat would you like to explore today?`,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(welcome);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setInput("");
    setIsStreaming(true);

    const aiMsgId = `ai-${Date.now()}`;
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    addChatMessage(aiMsg);

    const history = state.chatMessages
      .filter((m) => m.content.trim().length > 0)
      .slice(-10)
      .map((m) => ({ role: m.role, content: m.content }));

    let accumulated = "";
    let lastPillar: string | null = null;
    try {
      for await (const chunk of streamAIResponse(trimmed, history, state.user)) {
        if (chunk.type === "meta") {
          lastPillar = chunk.pillar ?? null;
          if (lastPillar) {
            updateChatMessage(aiMsgId, { pillar: lastPillar as PillarId });
          }
        } else if (chunk.type === "text" && chunk.text) {
          accumulated += chunk.text;
          updateChatMessage(aiMsgId, { content: accumulated });
        } else if (chunk.type === "error") {
          updateChatMessage(aiMsgId, {
            content: "Oops, I had a moment there! 😅 Could you try asking me again?",
          });
        }
      }
    } catch {
      updateChatMessage(aiMsgId, {
        content: "Oops, I had a moment there! 😅 Could you try asking me again?",
      });
    } finally {
      setIsStreaming(false);
      setQuickReplies(getQuickReplies(lastPillar));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 48px)",
        background: "var(--surface-1)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: "1px solid var(--border-light)",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          background: "var(--surface-0)",
          borderBottom: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-glow)",
          }}
        >
          <Bot size={20} color="white" />
        </div>
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
            }}
          >
            Ooddle
          </div>
          <div style={{ fontSize: 12, color: "var(--ooddle-primary)", display: "flex", alignItems: "center", gap: 4 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--ooddle-primary)",
              }}
            />
            Online — Multi-Agent Wellness Coach
          </div>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <AnimatePresence>
          {state.chatMessages.map((msg, idx) => {
            const isLast = idx === state.chatMessages.length - 1;
            const isStreamingThis = isStreaming && isLast && msg.role === "assistant";
            const isEmptyStreaming = isStreamingThis && !msg.content;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  gap: 10,
                }}
              >
                {msg.role === "assistant" && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--ooddle-primary), var(--pillar-cognition))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    <Sparkles size={14} color="white" />
                  </div>
                )}

                <div style={{ maxWidth: "75%" }}>
                  {msg.pillar && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 10px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: PILLARS[msg.pillar as PillarId]?.bgColor,
                        color: PILLARS[msg.pillar as PillarId]?.darkColor,
                        fontSize: 11,
                        fontWeight: 600,
                        marginBottom: 6,
                      }}
                    >
                      {PILLARS[msg.pillar as PillarId]?.emoji} {PILLARS[msg.pillar as PillarId]?.name}
                    </div>
                  )}
                  {isEmptyStreaming ? (
                    <div
                      className="chat-bubble-ai"
                      style={{
                        padding: "12px 20px",
                        display: "flex",
                        gap: 6,
                      }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--text-tertiary)",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div
                      className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}
                      style={{
                        padding: "12px 16px",
                        fontSize: 14,
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {msg.content}
                      {isStreamingThis && msg.content && (
                        <motion.span
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={{ display: "inline-block", marginLeft: 2 }}
                        >
                          ▋
                        </motion.span>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-tertiary)",
                      marginTop: 4,
                      textAlign: msg.role === "user" ? "right" : "left",
                      paddingLeft: msg.role === "assistant" ? 4 : 0,
                      paddingRight: msg.role === "user" ? 4 : 0,
                    }}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {!isStreaming && quickReplies.length > 0 && (
        <div
          style={{
            padding: "8px 20px",
            display: "flex",
            gap: 8,
            overflowX: "auto",
            borderTop: "1px solid var(--border-light)",
            background: "var(--surface-0)",
          }}
        >
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => sendMessage(reply)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border-light)",
                background: "var(--surface-1)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-secondary)",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          padding: "14px 20px",
          background: "var(--surface-0)",
          borderTop: "1px solid var(--border-light)",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Ooddle anything about your wellness..."
          disabled={isStreaming}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-light)",
            background: "var(--surface-1)",
            fontSize: 14,
            color: "var(--text-primary)",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isStreaming}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background:
              input.trim() && !isStreaming
                ? "linear-gradient(135deg, var(--ooddle-primary), var(--ooddle-primary-dark))"
                : "var(--border-light)",
            cursor: input.trim() && !isStreaming ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          <Send size={18} color={input.trim() && !isStreaming ? "white" : "var(--text-tertiary)"} />
        </button>
      </form>
    </div>
  );
}
