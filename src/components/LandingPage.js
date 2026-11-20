"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Code2,
  CheckCircle2,
  Terminal,
  Activity,
  Globe,
  Lock,
} from "lucide-react";
import { Button, Badge, Card } from "./ui";

export default function LandingPage() {
  const [activeCodeTab, setActiveCodeTab] = useState("node");

  const codeExamples = {
    node: `import { GetNotify } from '@getnotify/sdk';

const notify = new GetNotify({ apiKey: process.env.GETNOTIFY_API_KEY });

await notify.send({
  recipientId: 'usr_1001',
  to: 'alex@example.com',
  channel: 'email',
  title: 'Your security alert',
  body: '<p>A new sign-in was detected on your account.</p>',
});`,
    curl: `curl -X POST https://api.getnotify.dev/api/v1/notifications \\
  -H "Authorization: Bearer gn_live_••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "recipientId": "usr_1001",
    "to": "alex@example.com",
    "channel": "email",
    "title": "Deployment Successful"
  }'`,
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-neutral-800">
      {/* Top Navbar */}
      <header className="h-16 px-8 flex items-center justify-between border-b border-[#1f1f24] max-w-7xl mx-auto">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-white text-black font-bold flex items-center justify-center text-xs">
            N
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">getNotify</span>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="primary" size="sm">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center space-y-6">
        <Badge variant="purple" className="py-1 px-3 text-xs">
          ⚡ The Modern Notification Engine for Engineers
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Reliable email & in-app alerts at scale.
        </h1>

        <p className="text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Connect Resend, SMTP, and multi-channel workflows. Trigger transactional emails,
          deliver in-app notifications, and audit delivery logs with precision.
        </p>

        <div className="flex items-center justify-center space-x-3 pt-2">
          <Link href="/login">
            <Button variant="primary" size="lg">
              Start Free (10,000 msgs)
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline" size="lg">
              Read Documentation
            </Button>
          </Link>
        </div>
      </section>

      {/* Code Snippet Preview */}
      <section className="pb-24 px-6 max-w-4xl mx-auto">
        <Card className="p-0 border-neutral-700 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f24] bg-[#141418]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-neutral-700" />
              <span className="w-3 h-3 rounded-full bg-neutral-700" />
              <span className="w-3 h-3 rounded-full bg-neutral-700" />
              <span className="text-xs text-neutral-400 font-mono ml-2">send-notification.ts</span>
            </div>

            <div className="flex space-x-1">
              <button
                onClick={() => setActiveCodeTab("node")}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  activeCodeTab === "node" ? "bg-[#27272a] text-white" : "text-neutral-400"
                }`}
              >
                Node.js
              </button>
              <button
                onClick={() => setActiveCodeTab("curl")}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  activeCodeTab === "curl" ? "bg-[#27272a] text-white" : "text-neutral-400"
                }`}
              >
                cURL
              </button>
            </div>
          </div>

          <pre className="p-6 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed bg-[#09090b]">
            {codeExamples[activeCodeTab]}
          </pre>
        </Card>
      </section>
    </div>
  );
}
