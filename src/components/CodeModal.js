"use client";

import React, { useState } from "react";
import { X, Copy, Check, Terminal } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button, Badge } from "./ui";

export default function CodeModal() {
  const { isCodeModalOpen, setIsCodeModalOpen, apiKeys, activeProject } = useApp();
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState("node");

  if (!isCodeModalOpen) return null;

  const keyDisplay = apiKeys[0]?.prefix || "gn_live_••••••••";
  const projectId = activeProject?._id || "YOUR_PROJECT_ID";

  const snippets = {
    node: `const res = await fetch('https://api.getnotify.dev/api/v1/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': '${keyDisplay}'
  },
  body: JSON.stringify({
    projectId: '${projectId}',
    recipientId: 'usr_1001',
    to: 'alex@example.com',
    title: 'Hello from getNotify',
    body: '<p>Your notification payload here</p>',
    channel: 'email'
  })
});
const data = await res.json();
console.log(data);`,
    curl: `curl -X POST https://api.getnotify.dev/api/v1/notifications \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${keyDisplay}" \\
  -d '{
    "projectId": "${projectId}",
    "recipientId": "usr_1001",
    "to": "alex@example.com",
    "title": "Transactional Email",
    "body": "<p>Triggered via REST</p>",
    "channel": "email"
  }'`,
    python: `import requests

url = "https://api.getnotify.dev/api/v1/notifications"
headers = {
    "Content-Type": "application/json",
    "X-API-Key": "${keyDisplay}"
}
payload = {
    "projectId": "${projectId}",
    "recipientId": "usr_1001",
    "to": "alex@example.com",
    "title": "Welcome to getNotify",
    "body": "<p>Hello from Python!</p>",
    "channel": "email"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
  };

  const copy = () => {
    navigator.clipboard.writeText(snippets[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
      onClick={() => setIsCodeModalOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-[#111114] border border-[#222227] rounded-xl shadow-elevated overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f24]">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">SDK & API Examples</h3>
          </div>
          <button
            onClick={() => setIsCodeModalOpen(false)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-[#18181b] p-0.5 rounded-lg border border-[#27272a]">
              {["node", "curl", "python"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-md text-xs font-medium uppercase transition-colors ${
                    lang === l ? "bg-[#27272a] text-white" : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <Button variant="outline" size="sm" onClick={copy}>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
              )}
              <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>

          <pre className="p-4 bg-[#09090b] border border-[#222227] rounded-lg text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
            {snippets[lang]}
          </pre>
        </div>
      </div>
    </div>
  );
}
