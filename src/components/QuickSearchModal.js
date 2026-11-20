"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Mail, Bell, KeyRound, Server, Webhook, ScrollText, BarChart3, Settings, Users, FolderKanban } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function QuickSearchModal() {
  const router = useRouter();
  const { isSearchOpen, setIsSearchOpen, projects, activeProject, setActiveProject } = useApp();
  const [query, setQuery] = useState("");

  const staticNav = [
    { title: "Overview", href: "/overview", icon: BarChart3, category: "Navigation" },
    { title: "Inbox & Activity", href: "/", icon: Mail, category: "Navigation" },
    { title: "In-App Feed", href: "/?channel=in_app", icon: Bell, category: "Navigation" },
    { title: "Subscribers", href: "/subscribers", icon: Users, category: "Navigation" },
    { title: "Delivery Providers", href: "/settings?tab=providers", icon: Server, category: "Infrastructure" },
    { title: "API Keys", href: "/api-keys", icon: KeyRound, category: "Developer" },
    { title: "Webhooks", href: "/webhooks", icon: Webhook, category: "Developer" },
    { title: "Event Logs", href: "/logs", icon: ScrollText, category: "Developer" },
    { title: "Project Settings", href: "/settings", icon: Settings, category: "Settings" },
  ];

  const filtered = staticNav.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href) => {
    setIsSearchOpen(false);
    setQuery("");
    router.push(href);
  };

  if (!isSearchOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4 font-sans"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-[#111114] border border-[#222227] rounded-xl shadow-elevated overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-[#1f1f24]">
          <Search className="w-4 h-4 text-neutral-400 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to page..."
            className="w-full bg-transparent text-sm text-white placeholder-neutral-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No matching pages or commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleSelect(item.href)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#18181f] text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-medium text-neutral-200 group-hover:text-white">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-[#0d0d10] border-t border-[#1f1f24] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
}
