"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, Bot, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "./ui";

export default function AskAnythingModal() {
  const { isAskAnythingOpen, setIsAskAnythingOpen, activeProject } = useApp();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I am your getNotify infrastructure assistant. You can ask me how to configure SMTP, connect Resend, send in-app alerts, or integrate the Node SDK.",
    },
  ]);
  const [input, setInput] = useState("");

  if (!isAskAnythingOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    setTimeout(() => {
      let reply = "To trigger notifications, make sure an active provider is configured in Settings > Providers. Then call `notify.send({ recipientId, to, channel: 'email', title, body })` via the SDK.";
      if (userMsg.toLowerCase().includes("resend")) {
        reply = "For Resend: Go to Settings > Providers, click Add Provider, pick 'Resend', paste your API key (`re_...`), and set your verified sending domain (e.g. notifications@yourdomain.com).";
      } else if (userMsg.toLowerCase().includes("key") || userMsg.toLowerCase().includes("api")) {
        reply = "You can manage your API keys under Developer > API Keys. Secret keys are displayed once upon generation and hashed in the backend database.";
      }
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
      onClick={() => setIsAskAnythingOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-[#111114] border border-[#222227] rounded-xl shadow-elevated overflow-hidden flex flex-col h-[520px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f24]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">getNotify AI Assistant</h3>
          </div>
          <button
            onClick={() => setIsAskAnythingOpen(false)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-white text-black font-medium"
                    : "bg-[#18181b] border border-[#27272a] text-neutral-200"
                }`}
              >
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="w-6 h-6 rounded-md bg-neutral-800 text-neutral-300 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-3 border-t border-[#1f1f24] bg-[#0d0d10] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about setup, webhooks, or SDK..."
            className="flex-1 bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
          />
          <Button type="submit" variant="primary" size="sm">
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
