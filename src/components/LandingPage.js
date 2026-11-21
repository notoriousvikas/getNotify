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
  Mail,
  MessageSquare,
  Server,
  Clock,
  Bell,
  Smartphone,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
  ChevronRight,
  Sparkles,
  Cpu,
  Inbox,
  CheckCheck,
  Radio,
} from "lucide-react";
import { Button, Badge, Card } from "./ui";
import { useApp } from "../context/AppContext";
import { LogoIcon } from "./Logo";

export default function LandingPage() {
  const { user } = useApp();
  const [activeCodeTab, setActiveCodeTab] = useState("sms");
  const [copiedId, setCopiedId] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const codeSnippets = {
    sms: {
      title: "Twilio SMS Dispatch",
      desc: "Send programmatic SMS notifications with full delivery tracking",
      filename: "send-sms.ts",
      code: `import { getNotify } from "getnotified";

const notify = new getNotify({
  apiKey: "gnt_live_your_api_key_here",
});

// Outbound SMS via Twilio provider
const result = await notify.sendNotification({
  recipientId: "user_9812",
  channel: "sms",
  to: "+14155552671",
  body: "Your verification code is 849-201. Valid for 10 minutes.",
});

if (result.status === "error") {
  console.error("SMS failed:", result.error.message, result.error.code);
} else {
  console.log("SMS dispatched:", result.data._id);
}`,
    },
    resend: {
      title: "Resend Transactional Email",
      desc: "Blazing fast HTML emails with first-class deliverability",
      filename: "send-resend.ts",
      code: `import { getNotify } from "getnotified";

const notify = new getNotify({
  apiKey: "gnt_live_your_api_key_here",
});

// Deliver via Resend API
const result = await notify.sendNotification({
  recipientId: "user_123",
  channel: "email",
  to: "alex@example.com",
  title: "Your order receipt #9401",
  body: "<h1>Order Confirmed!</h1><p>Your package is on its way.</p>",
});

if (result.status === "success") {
  console.log("Delivered with ID:", result.data._id);
}`,
    },
    smtp: {
      title: "Custom SMTP Email",
      desc: "Route through Gmail, SendGrid, Amazon SES, or private SMTP servers",
      filename: "send-smtp.ts",
      code: `import { getNotify } from "getnotified";

const notify = new getNotify({
  apiKey: "gnt_live_your_api_key_here",
});

// Deliver via your custom SMTP credentials
const result = await notify.sendNotification({
  recipientId: "user_456",
  channel: "email",
  to: "sarah@company.com",
  title: "Monthly Security Audit Report",
  body: "<p>Your company compliance report has been generated.</p>",
});`,
    },
    in_app: {
      title: "In-App User Feed",
      desc: "Instant in-app alerts and notifications with read-state tracking",
      filename: "send-inapp.ts",
      code: `import { getNotify } from "getnotified";

const notify = new getNotify({
  apiKey: "gnt_live_your_api_key_here",
});

// Post an in-app alert with custom payload metadata
const result = await notify.sendNotification({
  recipientId: "user_123",
  channel: "in_app",
  title: "Deployment Finished",
  body: "Project 'production-api' is now live across 12 regions.",
  data: { deploymentId: "dep_9941", env: "production" },
});`,
    },
    schedule: {
      title: "Scheduled Delivery",
      desc: "Queue notifications for future dispatch using ISO 8601 timestamps",
      filename: "schedule-delivery.ts",
      code: `import { getNotify } from "getnotified";

const notify = new getNotify({
  apiKey: "gnt_live_your_api_key_here",
});

// Automatically evaluated by the worker scheduler every minute
const result = await notify.sendNotification({
  recipientId: "user_123",
  channel: "email",
  to: "user@example.com",
  title: "Subscription Renewal Reminder",
  body: "Your annual subscription renews tomorrow.",
  scheduleAt: "2026-12-01T09:00:00.000Z",
});`,
    },
    inbox: {
      title: "In-App Inbox Endpoints",
      desc: "Query notifications, unread counts, and mark alerts as read",
      filename: "inbox-queries.ts",
      code: `import { getNotify } from "getnotified";

const notify = new getNotify({
  apiKey: "gnt_live_your_api_key_here",
});

// Fetch recipient feed & unread counter
const inbox = await notify.getNotifications("user_123");
const unread = await notify.getUnreadCount("user_123");

console.log("Unread alerts:", unread.data);

// Mark the first notification as read
if (inbox.data && inbox.data[0]) {
  await notify.markAsRead(inbox.data[0]._id);
}`,
    },
  };

  const providers = [
    {
      name: "Twilio SMS",
      channel: "SMS",
      description: "Global programmable SMS delivery with carrier verification and delivery receipts.",
      badge: "SMS Active",
      badgeVariant: "warning",
      icon: MessageSquare,
      color: "text-red-400",
      border: "border-red-500/20",
      bg: "bg-red-500/10",
    },
    {
      name: "Resend",
      channel: "Email",
      description: "First-class developer email infrastructure built for modern transactional messaging.",
      badge: "Email Active",
      badgeVariant: "info",
      icon: Zap,
      color: "text-blue-400",
      border: "border-blue-500/20",
      bg: "bg-blue-500/10",
    },
    {
      name: "Custom SMTP",
      channel: "Email",
      description: "Connect any SMTP server — Gmail, Google Workspace, SendGrid, Amazon SES, or Postfix.",
      badge: "Email Active",
      badgeVariant: "success",
      icon: Mail,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
    },
    {
      name: "In-App Feed",
      channel: "In-App",
      description: "Real-time user notification inbox with read markers, badges, and JSON metadata.",
      badge: "In-App Active",
      badgeVariant: "purple",
      icon: Bell,
      color: "text-purple-400",
      border: "border-purple-500/20",
      bg: "bg-purple-500/10",
    },
    {
      name: "Scheduled Delivery",
      channel: "Automated",
      description: "Set ISO timestamps. The background worker checks due alerts every minute.",
      badge: "Worker Ready",
      badgeVariant: "neutral",
      icon: Clock,
      color: "text-amber-400",
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
    },
    {
      name: "Push Channel",
      channel: "Push",
      description: "Accepted payload specification ready for mobile and browser push workers.",
      badge: "Payload Ready",
      badgeVariant: "neutral",
      icon: Smartphone,
      color: "text-indigo-400",
      border: "border-indigo-500/20",
      bg: "bg-indigo-500/10",
    },
  ];

  const features = [
    {
      icon: Layers,
      title: "One Unified Notification SDK",
      desc: "Stop juggling separate SDKs for SMS, email, and in-app alerts. Trigger multi-channel dispatches through one clean TypeScript library: getnotified.",
    },
    {
      icon: Shield,
      title: "API-Key Project Scoping",
      desc: "Each request automatically scopes to your project environment via gnt_live_... keys. Separate development, staging, and production securely.",
    },
    {
      icon: Activity,
      title: "Real-Time Audit & Logs",
      desc: "Inspect every dispatch in real-time. Full history of payload headers, recipient status, timestamps, and delivery provider responses.",
    },
    {
      icon: Code2,
      title: "Zero Try/Catch Boilerplate",
      desc: "Errors are returned as values ({ status: 'error', error: { message, code, statusCode } }). Never crash background workers with uncaught exceptions.",
    },
    {
      icon: Clock,
      title: "Automated Worker Scheduling",
      desc: "Pass scheduleAt with any future ISO timestamp. The getNotify worker queue automatically dispatches notifications when the due time arrives.",
    },
    {
      icon: Inbox,
      title: "Full In-App Inbox API",
      desc: "Retrieve user alerts with notify.getNotifications(), count unread notifications, and mark notifications as read or deleted with notify.inbox.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-neutral-800 flex flex-col">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-[#09090b]/80 backdrop-blur-md border-b border-[#1f1f24]">
        <div className="h-16 px-6 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="group-hover:scale-105 transition-transform">
                <LogoIcon size={32} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                  getNotify
                  <span className="px-1.5 py-0.2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono rounded">
                    v1.0
                  </span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono -mt-0.5">
                  Notification Infrastructure
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-5 text-xs text-neutral-400">
              <a href="#providers" className="hover:text-white transition-colors">
                Providers
              </a>
              <a href="#quickstart" className="hover:text-white transition-colors">
                Interactive SDK
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <Link href="/docs" className="hover:text-white transition-colors flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Documentation</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="https://www.npmjs.com/package/getnotified"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 hover:text-white bg-[#141418] border border-[#27272a] rounded-lg transition-colors font-mono"
            >
              <span>npm: getnotified</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>

            <Link href="/docs">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                <BookOpen className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                Docs
              </Button>
            </Link>

            {user ? (
              <Link href="/overview">
                <Button variant="primary" size="sm">
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-16 px-6 max-w-5xl mx-auto text-center space-y-6">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-blue-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181b] border border-[#27272a] text-neutral-300 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-medium text-white">Full Multi-Channel Support</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400">Twilio SMS, Custom SMTP, Resend & In-App Feed</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Transactional email, SMS, and in-app alerts.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            One unified SDK.
          </span>
        </h1>

        <p className="text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Connect your delivery providers in seconds: <strong className="text-neutral-200">Twilio SMS</strong>,{" "}
          <strong className="text-neutral-200">Resend</strong>, and{" "}
          <strong className="text-neutral-200">Custom SMTP</strong> (Gmail, SendGrid, Amazon SES). Trigger dispatches,
          schedule future notifications, and manage in-app user feeds effortlessly.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <Link href="/overview">
              <Button variant="primary" size="lg">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="lg">
                <span>Start Free (10,000 msgs)</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}

          <Link href="/docs">
            <Button variant="outline" size="lg">
              <BookOpen className="w-4 h-4 mr-2 text-neutral-400" />
              <span>Explore Developer Docs</span>
            </Button>
          </Link>
        </div>

        {/* Quick copy install snippet */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-3 bg-[#111114] border border-[#222227] rounded-xl px-4 py-2 font-mono text-xs text-neutral-300 shadow-sm">
            <span className="text-neutral-500 select-none">$</span>
            <span className="text-white">npm install getnotified</span>
            <button
              onClick={() => copy("npm install getnotified", "install-hero")}
              className="text-neutral-400 hover:text-white transition-colors ml-2 p-1"
              title="Copy install command"
            >
              {copiedId === "install-hero" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── Supported Delivery Providers Grid ── */}
      <section id="providers" className="py-14 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Built-in Providers & Multi-Channel Delivery
          </h2>
          <p className="text-xs text-neutral-400">
            Plug in your existing API keys and mail server credentials. Switch providers without rewriting client code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p, idx) => {
            const Icon = p.icon;
            return (
              <Card
                key={idx}
                className="p-5 border-[#222227] hover:border-neutral-600 transition-all bg-[#111114] flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className={`w-9 h-9 rounded-lg ${p.bg} ${p.border} border flex items-center justify-center ${p.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge variant={p.badgeVariant}>{p.badge}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {p.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#1f1f24] flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>Channel: {p.channel}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Interactive Code Playground & Docs on Landing Page ── */}
      <section id="quickstart" className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="info">SDK Integration Guide</Badge>
              <span className="text-xs text-neutral-400 font-mono">npm install getnotified</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Try It in Code: Multi-Channel Snippets
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Test how SMS, Resend, SMTP, In-App, and scheduling behave with the getNotify SDK.
            </p>
          </div>

          <Link href="/docs">
            <Button variant="outline" size="sm">
              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
              <span>View Complete Docs</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-[#141418] border border-[#222227] rounded-xl mb-3">
          {[
            { id: "sms", label: "Twilio SMS", icon: MessageSquare },
            { id: "resend", label: "Resend Email", icon: Zap },
            { id: "smtp", label: "Custom SMTP", icon: Mail },
            { id: "in_app", label: "In-App Alerts", icon: Bell },
            { id: "schedule", label: "Schedule Delivery", icon: Clock },
            { id: "inbox", label: "In-App Inbox API", icon: Inbox },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeCodeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCodeTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-white text-black shadow-sm font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-[#1f1f24]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-black" : "text-neutral-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Card */}
        <Card className="border-[#27272a] shadow-2xl bg-[#0d0d10]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f24] bg-[#141418]">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-neutral-400 font-mono ml-2">
                {codeSnippets[activeCodeTab].filename}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-neutral-400 hidden sm:inline">
                {codeSnippets[activeCodeTab].desc}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copy(codeSnippets[activeCodeTab].code, `tab-${activeCodeTab}`)}
                className="h-7 text-xs px-2.5"
              >
                {copiedId === `tab-${activeCodeTab}` ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-neutral-400" />
                )}
                <span className="ml-1.5">Copy</span>
              </Button>
            </div>
          </div>

          <pre className="p-5 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed bg-[#09090b]">
            {codeSnippets[activeCodeTab].code}
          </pre>
        </Card>

        {/* SDK Quick Reference Summary on Landing Page */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#111114] border border-[#222227] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>1. Install</span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              Available on npm. Type definitions for TypeScript included out of the box.
            </p>
            <div className="font-mono text-[11px] bg-[#18181b] p-2 rounded border border-[#27272a] text-neutral-300">
              npm install getnotified
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111114] border border-[#222227] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>2. Initialize</span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              API key automatically selects your project environment. No projectId required.
            </p>
            <div className="font-mono text-[11px] bg-[#18181b] p-2 rounded border border-[#27272a] text-neutral-300 truncate">
              const notify = new getNotify(&#123; apiKey &#125;)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111114] border border-[#222227] text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <CheckCheck className="w-4 h-4 text-purple-400" />
              <span>3. Error Safety</span>
            </div>
            <p className="text-neutral-400 text-[11px]">
              Errors returned as values. No need to wrap every dispatch in try/catch blocks.
            </p>
            <div className="font-mono text-[11px] bg-[#18181b] p-2 rounded border border-[#27272a] text-neutral-300 truncate">
              if (result.status === &quot;error&quot;) ...
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Architecture & Features Section ── */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto w-full border-t border-[#1f1f24]">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Badge variant="purple">Developer Architecture</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Everything your notification pipeline needs
          </h2>
          <p className="text-xs text-neutral-400">
            Engineered from day one for speed, multi-tenant isolation, and zero delivery failure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-[#111114] border border-[#222227] space-y-3 hover:border-neutral-700 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white">{feat.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom Call To Action Banner ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center w-full">
        <div className="p-10 rounded-2xl bg-gradient-to-b from-[#141418] to-[#0d0d10] border border-[#27272a] shadow-2xl relative overflow-hidden space-y-5">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Ready to deploy multi-channel notifications?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Get your live API key, configure Resend, SMTP, or Twilio, and start sending messages in under 5 minutes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/login">
              <Button variant="primary" size="lg">
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                <BookOpen className="w-4 h-4 mr-2 text-neutral-400" />
                <span>Read Full Documentation</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-[#1f1f24] bg-[#09090b] py-10 px-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <LogoIcon size={22} />
            <span className="font-semibold text-white">getNotify</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">Twilio SMS • Resend • Custom SMTP • In-App</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/docs" className="hover:text-neutral-300 transition-colors">
              Documentation
            </Link>
            <a
              href="https://www.npmjs.com/package/getnotified"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              npm package
            </a>
            <Link href="/login" className="hover:text-neutral-300 transition-colors">
              Sign In
            </Link>
            <span className="text-neutral-600">© 2026 getNotify</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
