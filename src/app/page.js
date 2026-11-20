"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Download,
  Send,
  Code2,
  ChevronDown,
  ArrowUpRight,
  Mail,
  Bell,
  Clock,
  ExternalLink,
  X,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Filter,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button, Badge, Card, EmptyState } from "../components/ui";

export default function InboxPage() {
  const searchParams = useSearchParams();
  const channelParam = searchParams.get("channel");
  const isChannelInApp = channelParam === "in_app";

  const {
    notifications,
    setIsSendNotifOpen,
    setIsCodeModalOpen,
    activeProject,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState(isChannelInApp ? "in_app" : "all");
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (isChannelInApp) {
      setChannelFilter("in_app");
    } else {
      setChannelFilter("all");
    }
  }, [isChannelInApp]);

  const filtered = notifications.filter((n) => {
    if (channelFilter !== "all" && n.channel !== channelFilter) {
      return false;
    }
    if (statusFilter !== "all" && n.status && n.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (n.to || "").toLowerCase().includes(q) ||
      (n.recipientId || "").toLowerCase().includes(q) ||
      (n.title || "").toLowerCase().includes(q) ||
      (n.channel || "").toLowerCase().includes(q)
    );
  });

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">
              {isChannelInApp ? "In-App Notification Feed" : "Inbox & Dispatches"}
            </h1>
            <Badge variant="neutral">
              {filtered.length} total
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            {isChannelInApp
              ? "All in-app alerts and notifications delivered to users"
              : "Transactional emails and multi-channel notification events across your project"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCodeModalOpen(true)}
          >
            <Code2 className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
            <span>SDK Snippets</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsSendNotifOpen(true)}
            disabled={!activeProject}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>Send Notification</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111114] p-2.5 rounded-xl border border-[#222227]">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by recipient, email, or title..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2">
          {!isChannelInApp && (
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-[#18181b] border border-[#27272a] text-neutral-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-neutral-500"
            >
              <option value="all">All Channels</option>
              <option value="email">Email</option>
              <option value="in_app">In-App</option>
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#18181b] border border-[#27272a] text-neutral-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-neutral-500"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent / Delivered</option>
            <option value="queued">Queued</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No notifications recorded"
            description="Trigger an email or in-app alert to see real-time dispatch records here."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsSendNotifOpen(true)}
                disabled={!activeProject}
              >
                <Send className="w-3.5 h-3.5 mr-1.5" />
                Send Notification
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1f1f24] text-neutral-400 bg-[#141418]">
                  <th className="py-3 px-4 text-left font-medium">Channel</th>
                  <th className="py-3 px-4 text-left font-medium">Recipient / Destination</th>
                  <th className="py-3 px-4 text-left font-medium">Title / Subject</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-right font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18181b]">
                {filtered.map((n) => {
                  const isEmail = n.channel === "email";
                  return (
                    <tr
                      key={n._id}
                      onClick={() => setSelectedNotif(n)}
                      className="hover:bg-[#141418] transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-md bg-[#18181b] border border-[#27272a] flex items-center justify-center text-neutral-300">
                            {isEmail ? (
                              <Mail className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Bell className="w-3 h-3 text-blue-400" />
                            )}
                          </div>
                          <span className="font-mono text-[11px] text-neutral-400">
                            {n.channel}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-white truncate max-w-xs">
                            {n.to || n.recipientId}
                          </span>
                          {n.to && n.recipientId && n.to !== n.recipientId && (
                            <span className="text-[10px] text-neutral-400 font-mono">
                              id: {n.recipientId}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-300 max-w-sm truncate">
                        {n.title || "—"}
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            n.status === "failed"
                              ? "danger"
                              : n.status === "sent" || n.status === "delivered"
                              ? "success"
                              : "warning"
                          }
                        >
                          {n.status || "delivered"}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right text-neutral-400 font-mono text-[11px]">
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Inspector Drawer for Selected Notification */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#09090b] border-l border-[#1f1f24] h-full flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#1f1f24]">
              <div className="flex items-center space-x-2">
                <Badge variant="info">{selectedNotif.channel}</Badge>
                <span className="text-xs font-semibold text-white">Event Inspector</span>
              </div>
              <button
                onClick={() => setSelectedNotif(null)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 space-y-5 text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Notification ID</label>
                <div className="flex items-center justify-between bg-[#141418] border border-[#27272a] rounded-lg px-3 py-2 font-mono text-[11px] text-white">
                  <span>{selectedNotif._id}</span>
                  <button
                    onClick={() => copy(selectedNotif._id, "id")}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedId === "id" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Recipient Destination</label>
                <div className="bg-[#141418] border border-[#27272a] rounded-lg p-3 space-y-1.5 font-mono text-[11px]">
                  <div className="text-white">To: {selectedNotif.to || selectedNotif.recipientId}</div>
                  <div className="text-neutral-400">Recipient ID: {selectedNotif.recipientId}</div>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Payload / Content</label>
                <div className="bg-[#141418] border border-[#27272a] rounded-lg p-3 space-y-2">
                  <div className="font-semibold text-white">{selectedNotif.title}</div>
                  <div
                    className="text-neutral-300 text-xs max-h-48 overflow-y-auto bg-black/40 p-2.5 rounded border border-[#222227]"
                    dangerouslySetInnerHTML={{ __html: selectedNotif.body || "No body content" }}
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Raw Trace Metadata</label>
                <pre className="p-3 bg-[#111114] border border-[#222227] rounded-lg text-[10px] text-neutral-300 font-mono overflow-x-auto">
                  {JSON.stringify(selectedNotif, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1f1f24] flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedNotif(null)}
              >
                Close Inspector
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
