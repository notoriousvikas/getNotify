"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Sparkles,
  BookOpen,
  ArrowRight,
  MessageSquare,
  Mail,
  Zap,
  Bell,
  Clock,
  Smartphone,
  Shield,
  Layers,
  Search,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle2,
  KeyRound,
  Server,
  ArrowLeft,
  Send,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card } from "../../components/ui";
import { LogoIcon } from "../../components/Logo";

export default function DocsPage() {
  const { user, showToast } = useApp();
  const [copiedId, setCopiedId] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [packageManager, setPackageManager] = useState("npm");

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (showToast) showToast("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const installCommands = {
    npm: "npm install getnotified",
    pnpm: "pnpm add getnotified",
    yarn: "yarn add getnotified",
  };

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "install", title: "Installation" },
    { id: "initialize", title: "Initialization" },
    { id: "providers", title: "Supported Channels & Providers" },
    { id: "send", title: "Send Notifications" },
    { id: "schedule", title: "Schedule Delivery" },
    { id: "trigger-event", title: "Trigger Event Route" },
    { id: "inbox", title: "In-App Inbox API" },
    { id: "errors", title: "Error Handling" },
    { id: "configuration", title: "Configuration Reference" },
    { id: "rest-api", title: "cURL / REST API" },
    { id: "keywords", title: "Readme & Keywords" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-neutral-800 flex flex-col">
      {/* ── Public / Top Navigation Bar (Always visible whether authed or not) ── */}
      <header className="sticky top-0 z-30 bg-[#09090b]/85 backdrop-blur-md border-b border-[#1f1f24] px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="group-hover:scale-105 transition-transform">
                <LogoIcon size={28} />
              </div>
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                getNotify <span className="text-neutral-500 font-normal">/</span> Docs
              </span>
            </Link>
            <Badge variant="info">SDK v1.0</Badge>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <a
              href="https://www.npmjs.com/package/getnotified"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-300 hover:text-white bg-[#141418] border border-[#27272a] rounded-lg transition-colors font-mono"
            >
              <span>getnotified</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>

            {user ? (
              <Link href="/overview">
                <Button variant="primary" size="sm">
                  <span>Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="primary" size="sm">
                  <span>Get API Key</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Area with Sidebar Navigation ── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex gap-8">
        {/* Left Sticky Table of Contents */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search documentation..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#141418] border border-[#27272a] rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>

          <div className="p-3 bg-[#111114] border border-[#222227] rounded-xl space-y-1">
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block px-2 mb-2">
              On this page
            </span>
            {sections
              .filter((s) => s.title.toLowerCase().includes(searchFilter.toLowerCase()))
              .map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-2.5 py-1.5 rounded-md text-xs text-neutral-400 hover:text-white hover:bg-[#18181b] transition-colors"
                >
                  {s.title}
                </a>
              ))}
          </div>

          {/* Quick API Key Pill */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-950/30 to-purple-950/20 border border-blue-500/20 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>Project API Keys</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              API keys start with <code className="text-blue-300 font-mono">gnt_live_...</code> and automatically select
              the active project.
            </p>
            {user ? (
              <Link href="/api-keys">
                <Button variant="secondary" size="sm" className="w-full mt-1">
                  Manage API Keys
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm" className="w-full mt-1">
                  Create Account to Get Key
                </Button>
              </Link>
            )}
          </div>
        </aside>

        {/* Right Documentation Body */}
        <main className="flex-1 max-w-4xl space-y-12">
          {/* Header Introduction */}
          <section id="overview" className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="purple">getNotify JavaScript and TypeScript SDK</Badge>
              <Badge variant="success">Production Ready</Badge>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              getNotify SDK Reference
            </h1>
            <p className="text-sm text-neutral-300 leading-relaxed">
              The SDK sends notification requests to the getNotify backend. It includes helpers for sending and
              scheduling notifications, triggering notification events, and using the in-app inbox endpoints.
            </p>
          </section>

          {/* ── Install Section ── */}
          <section id="install" className="space-y-4 pt-4 border-t border-[#1f1f24]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  Install
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Install the official library via npm, pnpm, or yarn.
                </p>
              </div>

              {/* Package Manager Tabs */}
              <div className="flex bg-[#141418] border border-[#27272a] rounded-lg p-0.5 text-xs">
                {["npm", "pnpm", "yarn"].map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setPackageManager(pm)}
                    className={`px-2.5 py-1 rounded-md font-mono transition-colors ${
                      packageManager === pm
                        ? "bg-[#27272a] text-white font-semibold"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center justify-between bg-[#111114] border border-[#222227] rounded-xl px-4 py-3 font-mono text-xs text-white">
              <span>{installCommands[packageManager]}</span>
              <button
                onClick={() => copy(installCommands[packageManager], "install")}
                className="text-neutral-400 hover:text-white transition-colors p-1"
                title="Copy install command"
              >
                {copiedId === "install" ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </section>

          {/* ── Initialize Section ── */}
          <section id="initialize" className="space-y-4 pt-4 border-t border-[#1f1f24]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" />
                Initialize
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Import <code className="text-emerald-300 font-mono">getNotify</code> and instantiate the client with
                your API key.
              </p>
            </div>

            <Card className="bg-[#0e0e12] border-[#222227]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f24] bg-[#141418] text-xs">
                <span className="font-mono text-neutral-400">client.ts</span>
                <button
                  onClick={() =>
                    copy(
                      `import { getNotify } from "getnotified";\n\nconst notify = new getNotify({\n  apiKey: "gnt_live_your_api_key_here",\n  // Optional. Defaults to https://getnotify-y0ig.onrender.com\n  baseUrl: "https://getnotify-y0ig.onrender.com",\n});`,
                      "init"
                    )
                  }
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === "init" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`import { getNotify } from "getnotified";

const notify = new getNotify({
  apiKey: "gnt_live_your_api_key_here",
  // Optional. Defaults to https://getnotify-y0ig.onrender.com
  baseUrl: "https://getnotify-y0ig.onrender.com",
});`}
              </pre>
            </Card>

            <div className="p-3.5 rounded-xl bg-[#141418] border border-[#222227] text-xs text-neutral-300 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                The API key is required. The backend selects the project associated with that key, so a{" "}
                <code className="text-white font-mono">projectId</code> does not need to be supplied.{" "}
                <code className="text-white font-mono">GetNotify</code> is also exported as a constructor alias.
              </div>
            </div>
          </section>

          {/* ── Supported Channels & Providers ── */}
          <section id="providers" className="space-y-5 pt-4 border-t border-[#1f1f24]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                Supported Channels & Delivery Providers
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                getNotify natively supports multi-channel notification dispatches across email, SMS, and in-app feeds:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Twilio SMS */}
              <div className="p-4 rounded-xl bg-[#111114] border border-red-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <MessageSquare className="w-4 h-4 text-red-400" />
                    <span>Twilio SMS</span>
                  </div>
                  <Badge variant="warning">channel: "sms"</Badge>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Deliver SMS messages to E.164 phone numbers (e.g. <code className="text-neutral-300 font-mono">+14155552671</code>).
                  Configured with your Twilio Account SID, Auth Token, and Twilio-verified sender phone number.
                </p>
              </div>

              {/* Resend */}
              <div className="p-4 rounded-xl bg-[#111114] border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span>Resend Email</span>
                  </div>
                  <Badge variant="info">channel: "email"</Badge>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Transactional emails delivered via Resend API (<code className="text-neutral-300 font-mono">re_...</code>).
                  Supports HTML email bodies and custom From sender headers.
                </p>
              </div>

              {/* Custom SMTP */}
              <div className="p-4 rounded-xl bg-[#111114] border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <Mail className="w-4 h-4 text-emerald-400" />
                    <span>Custom SMTP Email</span>
                  </div>
                  <Badge variant="success">channel: "email"</Badge>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Connect any standard SMTP server (Gmail, Google Workspace, SendGrid, Amazon SES, Postfix) with custom host,
                  port (587, 465), user, and password credentials.
                </p>
              </div>

              {/* In-App Feed */}
              <div className="p-4 rounded-xl bg-[#111114] border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-white text-xs">
                    <Bell className="w-4 h-4 text-purple-400" />
                    <span>In-App Notifications</span>
                  </div>
                  <Badge variant="purple">channel: "in_app"</Badge>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Real-time in-app notification events stored for user dashboards, complete with title, body HTML,
                  unread count, and arbitrary JSON payload data.
                </p>
              </div>
            </div>
          </section>

          {/* ── Send Notifications Section ── */}
          <section id="send" className="space-y-5 pt-4 border-t border-[#1f1f24]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                Send Notifications
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Dispatch notifications using <code className="text-white font-mono">notify.sendNotification(options)</code>.
              </p>
            </div>

            {/* In-App Dispatch */}
            <Card className="bg-[#0e0e12] border-[#222227]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f24] bg-[#141418] text-xs">
                <span className="font-mono text-neutral-400">In-App Notification Dispatch</span>
                <button
                  onClick={() =>
                    copy(
                      `const result = await notify.sendNotification({\n  recipientId: "user_123",\n  channel: "in_app",\n  title: "Welcome!",\n  body: "Thanks for signing up.",\n  data: { source: "signup" },\n});\n\nif (result.status === "error") {\n  console.error(result.error.message, result.error.code);\n} else {\n  console.log(result.data._id);\n}`,
                      "send-inapp"
                    )
                  }
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === "send-inapp" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`const result = await notify.sendNotification({
  recipientId: "user_123",
  channel: "in_app",
  title: "Welcome!",
  body: "Thanks for signing up.",
  data: { source: "signup" },
});

if (result.status === "error") {
  console.error(result.error.message, result.error.code);
} else {
  console.log(result.data._id);
}`}
              </pre>
            </Card>

            {/* Channel Values & Destination Requirements */}
            <div className="p-3.5 rounded-xl bg-[#141418] border border-[#222227] text-xs text-neutral-300 leading-relaxed">
              Supported channel values are <code className="text-white font-mono">in_app</code>,{" "}
              <code className="text-white font-mono">email</code>, <code className="text-white font-mono">sms</code>, and{" "}
              <code className="text-white font-mono">push</code>. Email and SMS requests also require{" "}
              <code className="text-white font-mono">to</code>:
            </div>

            {/* Email Dispatch */}
            <Card className="bg-[#0e0e12] border-[#222227]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f24] bg-[#141418] text-xs">
                <span className="font-mono text-neutral-400">Email Dispatch (Resend or SMTP)</span>
                <button
                  onClick={() =>
                    copy(
                      `await notify.sendNotification({\n  recipientId: "user_123",\n  channel: "email",\n  to: "user@example.com",\n  title: "Your receipt",\n  body: "Your order is confirmed.",\n});`,
                      "send-email"
                    )
                  }
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === "send-email" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`await notify.sendNotification({
  recipientId: "user_123",
  channel: "email",
  to: "user@example.com",
  title: "Your receipt",
  body: "Your order is confirmed.",
});`}
              </pre>
            </Card>

            {/* SMS Dispatch */}
            <Card className="bg-[#0e0e12] border-[#222227]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f24] bg-[#141418] text-xs">
                <span className="font-mono text-neutral-400">SMS Dispatch (Twilio)</span>
                <button
                  onClick={() =>
                    copy(
                      `await notify.sendNotification({\n  recipientId: "user_123",\n  channel: "sms",\n  to: "+14155552671",\n  body: "Your verification code is 849-201.",\n});`,
                      "send-sms"
                    )
                  }
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === "send-sms" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`await notify.sendNotification({
  recipientId: "user_123",
  channel: "sms",
  to: "+14155552671",
  body: "Your verification code is 849-201.",
});`}
              </pre>
            </Card>
          </section>

          {/* ── Schedule Delivery Section ── */}
          <section id="schedule" className="space-y-4 pt-4 border-t border-[#1f1f24]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Schedule Delivery
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Schedule delivery with a date or date-time string:
              </p>
            </div>

            <Card className="bg-[#0e0e12] border-[#222227]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f24] bg-[#141418] text-xs">
                <span className="font-mono text-neutral-400">schedule-delivery.ts</span>
                <button
                  onClick={() =>
                    copy(
                      `await notify.sendNotification({\n  recipientId: "user_123",\n  channel: "in_app",\n  title: "Reminder",\n  scheduleAt: "2026-12-01T09:00:00.000Z",\n});`,
                      "sched"
                    )
                  }
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === "sched" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`await notify.sendNotification({
  recipientId: "user_123",
  channel: "in_app",
  title: "Reminder",
  scheduleAt: "2026-12-01T09:00:00.000Z",
});`}
              </pre>
            </Card>

            <div className="p-3.5 rounded-xl bg-[#141418] border border-[#222227] text-xs text-neutral-300 leading-relaxed">
              The backend's scheduler checks due notifications once per minute.
            </div>
          </section>

          {/* ── Trigger Event Route Section ── */}
          <section id="trigger-event" className="space-y-4 pt-4 border-t border-[#1f1f24]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Trigger Event Route
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Dispatch immediate events via the trigger endpoint.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141418] border border-[#222227] text-xs text-neutral-300 leading-relaxed">
              <code className="text-white font-mono">notify.triggerEvent(payload)</code> calls the backend's{" "}
              <code className="text-white font-mono">/notifications/triggerEvent</code> route; the route accepts the same
              notification fields except <code className="text-white font-mono">scheduleAt</code>.
            </div>

            <Card className="bg-[#0e0e12] border-[#222227]">
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`await notify.triggerEvent({
  recipientId: "user_123",
  channel: "email",
  to: "user@example.com",
  title: "Password Reset Requested",
  body: "<p>Click the link to reset your password.</p>",
});`}
              </pre>
            </Card>
          </section>

          {/* ── In-App Inbox Section ── */}
          <section id="inbox" className="space-y-5 pt-4 border-t border-[#1f1f24]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-400" />
                In-App Inbox
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Query notifications, unread counts, and update read states for in-app alert feeds.
              </p>
            </div>

            <Card className="bg-[#0e0e12] border-[#222227]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f24] bg-[#141418] text-xs">
                <span className="font-mono text-neutral-400">inbox-query.ts</span>
                <button
                  onClick={() =>
                    copy(
                      `const inbox = await notify.getNotifications("user_123");\nif (inbox.status === "error") {\n  console.error(inbox.error.message);\n} else {\n  const unread = await notify.getUnreadCount("user_123");\n  if (unread.status === "success") console.log("Unread:", unread.data);\n\n  const first = inbox.data[0];\n  if (first) {\n    const marked = await notify.markAsRead(first._id);\n    if (marked.status === "error") console.error(marked.error.message);\n  }\n}`,
                      "inbox-1"
                    )
                  }
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === "inbox-1" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`const inbox = await notify.getNotifications("user_123");
if (inbox.status === "error") {
  console.error(inbox.error.message);
} else {
  const unread = await notify.getUnreadCount("user_123");
  if (unread.status === "success") console.log("Unread:", unread.data);

  const first = inbox.data[0];
  if (first) {
    const marked = await notify.markAsRead(first._id);
    if (marked.status === "error") console.error(marked.error.message);
  }
}`}
              </pre>
            </Card>

            <div className="p-3.5 rounded-xl bg-[#141418] border border-[#222227] text-xs text-neutral-300 leading-relaxed">
              The same methods are available under <code className="text-white font-mono">notify.inbox</code>:
            </div>

            <Card className="bg-[#0e0e12] border-[#222227]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f24] bg-[#141418] text-xs">
                <span className="font-mono text-neutral-400">notify.inbox.*</span>
                <button
                  onClick={() =>
                    copy(
                      `await notify.inbox.list("user_123");\nawait notify.inbox.getUnreadCount("user_123");\nawait notify.inbox.markAsRead("notification_id");\nawait notify.inbox.delete("notification_id");`,
                      "inbox-2"
                    )
                  }
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === "inbox-2" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`await notify.inbox.list("user_123");
await notify.inbox.getUnreadCount("user_123");
await notify.inbox.markAsRead("notification_id");
await notify.inbox.delete("notification_id");`}
              </pre>
            </Card>

            {/* Backend notes callout */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Backend Implementation Notes</span>
              </div>
              <p className="leading-relaxed">
                These methods call the backend's existing inbox routes. The current backend inbox routes do not apply
                API-key project scoping, and its read and unread-count handlers use a{" "}
                <code className="text-white font-mono">read</code> field that is absent from the notification model. The SDK
                cannot correct those server-side behaviors; use these methods with that limitation in mind.
              </p>
              <p className="leading-relaxed">
                The backend accepts <code className="text-white font-mono">push</code> as a channel value, but the current
                worker and scheduler do not have a push delivery handler.
              </p>
            </div>
          </section>

          {/* ── Error Responses Section ── */}
          <section id="errors" className="space-y-4 pt-4 border-t border-[#1f1f24]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Error Responses
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Errors as values: no try/catch wrapping required.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141418] border border-[#222227] text-xs text-neutral-300 leading-relaxed">
              SDK operations return a consistent result object. Errors are returned as values, so you do not need to
              import error classes or wrap each call in <code className="text-white font-mono">try/catch</code>:
            </div>

            <Card className="bg-[#0e0e12] border-[#222227]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f24] bg-[#141418] text-xs">
                <span className="font-mono text-neutral-400">error-handling.ts</span>
                <button
                  onClick={() =>
                    copy(
                      `const result = await notify.sendNotification({\n  recipientId: "user_123",\n  channel: "in_app",\n  title: "Update",\n});\n\nif (result.status === "error") {\n  console.error(result.error.message);\n  console.error(result.error.code);\n  console.error(result.error.statusCode); // present for HTTP errors\n} else {\n  console.log("Sent:", result.data._id);\n}`,
                      "errors"
                    )
                  }
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === "errors" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`const result = await notify.sendNotification({
  recipientId: "user_123",
  channel: "in_app",
  title: "Update",
});

if (result.status === "error") {
  console.error(result.error.message);
  console.error(result.error.code);
  console.error(result.error.statusCode); // present for HTTP errors
} else {
  console.log("Sent:", result.data._id);
}`}
              </pre>
            </Card>
          </section>

          {/* ── Configuration Reference Table ── */}
          <section id="configuration" className="space-y-4 pt-4 border-t border-[#1f1f24]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                Configuration Reference
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Options passed to the <code className="text-white font-mono">new getNotify(options)</code> constructor.
              </p>
            </div>

            <Card className="overflow-hidden border-[#222227]">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#141418] border-b border-[#1f1f24] text-neutral-400 font-mono text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Option</th>
                      <th className="py-2.5 px-4 font-semibold">Type</th>
                      <th className="py-2.5 px-4 font-semibold">Default</th>
                      <th className="py-2.5 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18181b] font-mono text-[11px]">
                    <tr className="hover:bg-[#141418]">
                      <td className="py-2.5 px-4 text-white font-bold">apiKey</td>
                      <td className="py-2.5 px-4 text-neutral-400">string</td>
                      <td className="py-2.5 px-4 text-amber-400">Required</td>
                      <td className="py-2.5 px-4 text-neutral-300 font-sans text-xs">
                        Project API key (<code className="text-blue-300 font-mono">gnt_live_...</code>).
                      </td>
                    </tr>
                    <tr className="hover:bg-[#141418]">
                      <td className="py-2.5 px-4 text-white font-bold">baseUrl</td>
                      <td className="py-2.5 px-4 text-neutral-400">string</td>
                      <td className="py-2.5 px-4 text-neutral-400 truncate max-w-xs">
                        https://getnotify-y0ig.onrender.com
                      </td>
                      <td className="py-2.5 px-4 text-neutral-300 font-sans text-xs">
                        getNotify backend origin.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#141418]">
                      <td className="py-2.5 px-4 text-white font-bold">timeout</td>
                      <td className="py-2.5 px-4 text-neutral-400">number</td>
                      <td className="py-2.5 px-4 text-neutral-400">10000</td>
                      <td className="py-2.5 px-4 text-neutral-300 font-sans text-xs">
                        Request timeout in milliseconds.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#141418]">
                      <td className="py-2.5 px-4 text-white font-bold">headers</td>
                      <td className="py-2.5 px-4 text-neutral-400">Record&lt;string, string&gt;</td>
                      <td className="py-2.5 px-4 text-neutral-400">&#123;&#125;</td>
                      <td className="py-2.5 px-4 text-neutral-300 font-sans text-xs">
                        Additional request headers. The SDK sets <code className="font-mono text-neutral-200">x-api-key</code> from apiKey.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#141418]">
                      <td className="py-2.5 px-4 text-white font-bold">fetch</td>
                      <td className="py-2.5 px-4 text-neutral-400">typeof fetch</td>
                      <td className="py-2.5 px-4 text-neutral-400">globalThis.fetch</td>
                      <td className="py-2.5 px-4 text-neutral-300 font-sans text-xs">
                        Optional custom fetch implementation.
                      </td>
                    </tr>
                    <tr className="hover:bg-[#141418]">
                      <td className="py-2.5 px-4 text-white font-bold">projectId</td>
                      <td className="py-2.5 px-4 text-neutral-400">string</td>
                      <td className="py-2.5 px-4 text-neutral-500">—</td>
                      <td className="py-2.5 px-4 text-neutral-400 font-sans text-xs">
                        Deprecated compatibility option; the backend selects the project from the API key.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* ── Direct REST API / cURL Section ── */}
          <section id="rest-api" className="space-y-4 pt-4 border-t border-[#1f1f24]">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-neutral-300" />
                cURL / Direct REST API
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                For non-Node.js runtimes (Python, Go, Ruby, PHP, shell scripts), trigger dispatches via standard HTTP POST.
              </p>
            </div>

            <Card className="bg-[#0e0e12] border-[#222227]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#1f1f24] bg-[#141418] text-xs">
                <span className="font-mono text-neutral-400">cURL Example</span>
                <button
                  onClick={() =>
                    copy(
                      `curl -X POST https://getnotify-y0ig.onrender.com/notifications \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: gnt_live_your_api_key_here" \\
  -d '{
    "recipientId": "user_123",
    "channel": "email",
    "to": "user@example.com",
    "title": "Welcome to getNotify",
    "body": "<p>Hello from REST API</p>"
  }'`,
                      "curl"
                    )
                  }
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 font-mono text-[11px]"
                >
                  {copiedId === "curl" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
{`curl -X POST https://getnotify-y0ig.onrender.com/notifications \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: gnt_live_your_api_key_here" \\
  -d '{
    "recipientId": "user_123",
    "channel": "email",
    "to": "user@example.com",
    "title": "Welcome to getNotify",
    "body": "<p>Hello from REST API</p>"
  }'`}
              </pre>
            </Card>
          </section>

          {/* ── Readme Keywords Section ── */}
          <section id="keywords" className="space-y-4 pt-4 border-t border-[#1f1f24] pb-12">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-neutral-400" />
                Readme Keywords & npm Registry
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Explore related ecosystem packages on npm:
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { name: "getnotify", url: "https://www.npmjs.com/search?q=keywords:getnotify" },
                { name: "notification", url: "https://www.npmjs.com/search?q=keywords:notification" },
                { name: "sdk", url: "https://www.npmjs.com/search?q=keywords:sdk" },
                { name: "email", url: "https://www.npmjs.com/search?q=keywords:email" },
                { name: "sms", url: "https://www.npmjs.com/search?q=keywords:sms" },
                { name: "push", url: "https://www.npmjs.com/search?q=keywords:push" },
                { name: "in-app", url: "https://www.npmjs.com/search?q=keywords:in-app" },
                { name: "typescript", url: "https://www.npmjs.com/search?q=keywords:typescript" },
              ].map((kw) => (
                <a
                  key={kw.name}
                  href={kw.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#141418] border border-[#27272a] text-xs font-mono text-neutral-300 hover:text-white hover:border-neutral-600 transition-colors flex items-center gap-1.5"
                >
                  <span>{kw.name}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </a>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1f1f24] bg-[#09090b] py-8 px-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <LogoIcon size={22} />
            <span className="font-semibold text-white">getNotify Documentation</span>
          </div>

          <div className="flex items-center space-x-5">
            <Link href="/" className="hover:text-neutral-300 transition-colors">
              Home
            </Link>
            <a
              href="https://www.npmjs.com/package/getnotified"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              npm: getnotified
            </a>
            {user ? (
              <Link href="/overview" className="hover:text-neutral-300 transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className="hover:text-neutral-300 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
