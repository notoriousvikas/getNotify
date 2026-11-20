"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ExternalLink, HelpCircle, Activity, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function FooterBar() {
  const { setIsAskAnythingOpen, setIsCodeModalOpen, activeProject } = useApp();

  return (
    <footer className="h-8 bg-[#09090b] border-t border-[#1f1f24] px-4 flex items-center justify-between text-xs text-neutral-400 shrink-0 select-none z-20 font-sans">
      {/* Left side items */}
      <div className="flex items-center space-x-3 text-[11px]">
        <div className="flex items-center space-x-1.5 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-neutral-300 font-medium">All Systems Operational</span>
        </div>

        <span className="text-[#27272a]">•</span>

        <Link
          href="/docs"
          className="hover:text-white flex items-center space-x-1 transition-colors text-neutral-400 hover:underline"
        >
          <span>API Docs</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
        </Link>

        <span className="text-[#27272a]">•</span>

        <button
          onClick={() => setIsCodeModalOpen(true)}
          className="hover:text-white flex items-center space-x-1 transition-colors text-neutral-400"
        >
          <Terminal className="w-3 h-3 text-neutral-400" />
          <span>SDK Snippets</span>
        </button>
      </div>

      {/* Right side items */}
      <div className="flex items-center space-x-3 text-[11px]">
        <span className="text-neutral-400 font-mono hidden sm:inline">
          {activeProject?.name ? `env: ${activeProject.name.toLowerCase()}` : "no project"}
        </span>

        <button
          onClick={() => setIsAskAnythingOpen(true)}
          className="flex items-center space-x-1.5 hover:text-white transition-colors py-0.5 px-2 rounded-md hover:bg-[#141418] text-neutral-400 border border-transparent hover:border-[#27272a]"
        >
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Ask Assistant</span>
        </button>
      </div>
    </footer>
  );
}
