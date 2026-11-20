"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Inbox,
  Bell,
  Check,
  Trash2,
  RefreshCw,
  Search,
  KeyRound,
  User,
  Send,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  X,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { api } from "../../lib/api";

export default function InboxesPage() {
  const { apiKeys, activeProject, showToast } = useApp();

  // API Key handling: check context, localStorage, or user manual input
  const [apiKey, setApiKey] = useState("");
  const [isEditingKey, setIsEditingKey] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  // Recipient handling: defaults to 'user_1' or saved recipient
  const [recipientId, setRecipientId] = useState("user_1");
  const [recipientInput, setRecipientInput] = useState("user_1");

  // Notifications state
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Filters & search
  const [filterTab, setFilterTab] = useState("all"); // "all" | "unread" | "read"
  const [searchQuery, setSearchQuery] = useState("");

  // Test Notification Modal
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testChannel, setTestChannel] = useState("in_app");
  const [testTitle, setTestTitle] = useState("Welcome to In-App Inbox!");
  const [testBody, setTestBody] = useState("You have a new update in your project dashboard.");
  const [sendingTest, setSendingTest] = useState(false);

  // Load saved API key & recipient from localStorage when activeProject changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedRecipient = localStorage.getItem("gn_inbox_recipient") || "user_1";
    setRecipientId(savedRecipient);
    setRecipientInput(savedRecipient);

    let foundKey = "";
    try {
      const storedKeys = JSON.parse(localStorage.getItem("gn_raw_keys") || "{}");
      if (activeProject && storedKeys[activeProject._id]) {
        foundKey = storedKeys[activeProject._id];
      }
    } catch (_) {}

    // Fallback to in-memory key from creation if available
    if (!foundKey && apiKeys[0]?.rawKey) {
      foundKey = apiKeys[0].rawKey;
    }

    setApiKey(foundKey);
    setKeyInput(foundKey);
  }, [activeProject, apiKeys]);

  // Fetch inbox messages and unread count
  const fetchInbox = useCallback(async () => {
    if (!activeProject) return;
    if (!recipientId.trim()) return;

    setLoadingMsgs(true);
    setErrorMsg(null);

    try {
      // 1. Fetch messages
      const res = await api.inbox.all(apiKey.trim() || undefined, recipientId.trim());
      const list = Array.isArray(res.data) ? res.data : [];
      setMessages(list);

      // 2. Fetch unread count
      try {
        const countRes = await api.inbox.unreadCount(apiKey.trim() || undefined, recipientId.trim());
        setUnreadCount(countRes.data?.unreadCount ?? countRes.unreadCount ?? 0);
      } catch (_) {
        // Fallback local unread calculation if count endpoint fails
        const localUnread = list.filter((m) => !m.read && !m.readAt).length;
        setUnreadCount(localUnread);
      }
    } catch (err) {
      const msg = err.message || "Failed to fetch inbox notifications";
      setErrorMsg(msg);
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  }, [activeProject, apiKey, recipientId]);

  useEffect(() => {
    fetchInbox();
  }, [fetchInbox]);

  // Save manual API Key
  const handleSaveApiKey = (e) => {
    e?.preventDefault();
    const clean = keyInput.trim();
    setApiKey(clean);
    setIsEditingKey(false);
    if (typeof window !== "undefined" && activeProject) {
      try {
        const stored = JSON.parse(localStorage.getItem("gn_raw_keys") || "{}");
        stored[activeProject._id] = clean;
        localStorage.setItem("gn_raw_keys", JSON.stringify(stored));
      } catch (_) {}
    }
    showToast("API key configured", "success");
  };

  // Change Recipient
  const handleSaveRecipient = (e) => {
    e?.preventDefault();
    const clean = recipientInput.trim() || "user_1";
    setRecipientId(clean);
    setRecipientInput(clean);
    if (typeof window !== "undefined") {
      localStorage.setItem("gn_inbox_recipient", clean);
    }
  };

  // Mark single notification as read
  const markRead = async (id) => {
    try {
      // Optimistic update
      setMessages((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));

      await api.inbox.markRead(id, apiKey.trim() || undefined);
      showToast("Marked as read", "success");
    } catch (err) {
      showToast(err.message || "Failed to mark as read", "error");
      fetchInbox();
    }
  };

  // Delete notification
  const remove = async (id) => {
    try {
      setMessages((prev) => prev.filter((n) => n._id !== id));
      await api.inbox.delete(id, apiKey.trim() || undefined);
      showToast("Notification deleted", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete notification", "error");
      fetchInbox();
    }
  };

  // Send a quick test in-app notification
  const handleSendTestNotification = async (e) => {
    e.preventDefault();
    if (!activeProject) {
      showToast("Select a project first", "error");
      return;
    }
    setSendingTest(true);
    try {
      await api.notifications.send({
        projectId: activeProject._id,
        recipientId: recipientId.trim(),
        to: recipientId.trim(),
        title: testTitle.trim(),
        body: testBody.trim(),
        channel: testChannel || "in_app",
      });
      showToast(`Test ${testChannel || "in_app"} notification sent!`, "success");
      setIsTestModalOpen(false);
      // Refetch inbox after a short delay
      setTimeout(() => fetchInbox(), 300);
    } catch (err) {
      showToast(err.message || "Failed to send notification", "error");
    } finally {
      setSendingTest(false);
    }
  };

  // Filter & search notifications
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const isUnread = !msg.read && !msg.readAt;
      if (filterTab === "unread" && !isUnread) return false;
      if (filterTab === "read" && isUnread) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleMatch = (msg.title || "").toLowerCase().includes(q);
      const bodyMatch = (msg.body || "").toLowerCase().includes(q);
      const recipientMatch = (msg.recipientId || "").toLowerCase().includes(q);
      return titleMatch || bodyMatch || recipientMatch;
    });
  }, [messages, filterTab, searchQuery]);

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1400px] w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Inboxes</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-[#71717a] mt-1">
            Real-time in-app notification inbox for your recipients and applications.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsTestModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Send Test In-App Notification</span>
          </button>
          <button
            onClick={fetchInbox}
            disabled={loadingMsgs}
            title="Refresh inbox"
            className="flex items-center space-x-1 px-3 py-1.5 bg-[#141417] border border-[#27272a] rounded-lg text-xs text-[#d4d4d8] hover:bg-[#1f1f23] hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingMsgs ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Configuration Bar: API Key & Recipient ID */}
      <div className="bg-[#0e0e12] border border-[#1f1f23] rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recipient ID Selector */}
          <div>
            <label className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider block mb-1.5">
              Active Recipient ID
            </label>
            <form onSubmit={handleSaveRecipient} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]" />
                <input
                  type="text"
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  placeholder="e.g. user_1"
                  className="w-full pl-9 pr-3 py-1.5 bg-[#141417] border border-[#27272a] rounded-lg text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#27272a] hover:bg-[#3f3f46] text-white text-xs font-medium rounded-lg transition-colors"
              >
                Apply
              </button>
            </form>
            <div className="flex items-center space-x-1.5 mt-2">
              <span className="text-[11px] text-[#71717a]">Quick presets:</span>
              {["user_1", "demo_user", "test_account"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setRecipientInput(preset);
                    setRecipientId(preset);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("gn_inbox_recipient", preset);
                    }
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                    recipientId === preset
                      ? "bg-blue-950/40 border-blue-500/40 text-blue-300"
                      : "bg-[#141417] border-[#27272a] text-[#a1a1aa] hover:text-white"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* API Key Config */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-medium text-[#a1a1aa] uppercase tracking-wider">
                Project API Key Header (x-api-key)
              </label>
              <button
                onClick={() => setIsEditingKey((prev) => !prev)}
                className="text-[11px] text-blue-400 hover:text-blue-300"
              >
                {isEditingKey ? "Cancel" : apiKey ? "Change Key" : "Set Key"}
              </button>
            </div>

            {isEditingKey || !apiKey ? (
              <form onSubmit={handleSaveApiKey} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]" />
                  <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="Enter raw API key (e.g. gn_...)"
                    className="w-full pl-9 pr-3 py-1.5 bg-[#141417] border border-[#27272a] rounded-lg text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#141417] border border-[#27272a] rounded-lg text-xs">
                <div className="flex items-center space-x-2 truncate">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="font-mono text-[#d4d4d8] truncate">
                    {apiKey.length > 12 ? `${apiKey.slice(0, 8)}••••••••` : apiKey}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20">
                  Ready
                </span>
              </div>
            )}
            <p className="text-[11px] text-[#71717a] mt-2">
              Used to authenticate SDK inbox requests with project isolation.
            </p>
          </div>
        </div>
      </div>

      {/* Backend / Auth Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-xs text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-300">Server Response Notice</p>
            <p className="mt-0.5 text-rose-200/90">{errorMsg}</p>
            {errorMsg.toLowerCase().includes("unauthorized") || errorMsg.includes("401") ? (
              <p className="mt-1.5 text-[11px] text-rose-300/80">
                Tip: The inbox router may require both session auth and a valid project API key. Make sure your API key belongs to this project.
              </p>
            ) : null}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {!activeProject ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center bg-[#0a0a0d] border border-[#1f1f23] rounded-xl">
          <Inbox className="w-10 h-10 text-[#27272a] mb-4" />
          <p className="text-sm text-white font-medium mb-1">No project selected</p>
          <p className="text-xs text-[#71717a]">Select a project from the sidebar to view its inboxes.</p>
        </div>
      ) : (
        <>
          {/* Filter Bar & Search */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex p-1 bg-[#121215] border border-[#1f1f23] rounded-lg">
              <button
                onClick={() => setFilterTab("all")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filterTab === "all"
                    ? "bg-[#27272a] text-white shadow-sm"
                    : "text-[#71717a] hover:text-[#d4d4d8]"
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilterTab("unread")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filterTab === "unread"
                    ? "bg-[#27272a] text-white shadow-sm"
                    : "text-[#71717a] hover:text-[#d4d4d8]"
                }`}
              >
                Unread ({messages.filter((m) => !m.read && !m.readAt).length})
              </button>
              <button
                onClick={() => setFilterTab("read")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filterTab === "read"
                    ? "bg-[#27272a] text-white shadow-sm"
                    : "text-[#71717a] hover:text-[#d4d4d8]"
                }`}
              >
                Read ({messages.filter((m) => m.read || m.readAt).length})
              </button>
            </div>

            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#52525b]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#0e0e12] border border-[#27272a] rounded-lg text-xs text-white placeholder-[#52525b] focus:outline-none focus:border-neutral-500"
              />
            </div>
          </div>

          {/* Notifications List */}
          {loadingMsgs ? (
            <div className="flex flex-col items-center justify-center py-20 bg-[#0a0a0d] border border-[#1f1f23] rounded-xl">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-[#71717a]">Fetching notifications for {recipientId}...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-[#0a0a0d] border border-[#1f1f23] rounded-xl text-center p-6">
              <Inbox className="w-10 h-10 text-[#27272a] mb-4" />
              <p className="text-sm text-white font-medium mb-1">
                {searchQuery ? "No matching notifications" : "Inbox is empty"}
              </p>
              <p className="text-xs text-[#71717a] max-w-md">
                {searchQuery
                  ? "Try adjusting your search query or status filter."
                  : `No in-app notifications found for recipient "${recipientId}". Click "Send Test In-App Notification" above to send one now.`}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsTestModalOpen(true)}
                  className="mt-4 px-3 py-1.5 bg-[#141417] hover:bg-[#1f1f23] border border-[#27272a] rounded-lg text-xs text-[#d4d4d8] hover:text-white transition-colors"
                >
                  Send first notification
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#0a0a0d] border border-[#1f1f23] rounded-xl overflow-hidden divide-y divide-[#1f1f23]">
              {filteredMessages.map((msg) => {
                const isUnread = !msg.read && !msg.readAt;
                return (
                  <div
                    key={msg._id}
                    className={`flex items-start justify-between p-4 transition-colors hover:bg-[#121217] ${
                      isUnread ? "bg-blue-950/15" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                      {/* Unread indicator */}
                      <div className="pt-1.5 shrink-0">
                        {isUnread ? (
                          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-transparent" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-white font-medium truncate">
                            {msg.title || "Notification"}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#18181c] border border-[#27272a] text-[#a1a1aa]">
                            {msg.channel || "in_app"}
                          </span>
                          {isUnread ? (
                            <span className="text-[10px] text-blue-400 font-medium">New</span>
                          ) : (
                            <span className="text-[10px] text-[#52525b]">Read</span>
                          )}
                        </div>

                        <p className="text-xs text-[#a1a1aa] mt-1 break-words leading-relaxed">
                          {msg.body || "No content"}
                        </p>

                        {/* Extra Payload / Data if present */}
                        {msg.data && Object.keys(msg.data).length > 0 && (
                          <div className="mt-2 p-2 bg-[#141418] border border-[#27272a]/60 rounded text-[11px] font-mono text-[#a1a1aa] overflow-x-auto max-w-xl">
                            {JSON.stringify(msg.data, null, 2)}
                          </div>
                        )}

                        <div className="flex items-center space-x-3 text-[11px] text-[#52525b] mt-2">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {msg.createdAt
                                ? new Date(msg.createdAt).toLocaleString(undefined, {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                  })
                                : "Recently"}
                            </span>
                          </span>
                          <span>•</span>
                          <span>To: {msg.recipientId}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 ml-4 shrink-0 pt-1">
                      {isUnread && (
                        <button
                          onClick={() => markRead(msg._id)}
                          title="Mark as read"
                          className="p-1.5 text-[#71717a] hover:text-emerald-400 hover:bg-[#1e1e24] rounded transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => remove(msg._id)}
                        title="Delete notification"
                        className="p-1.5 text-[#71717a] hover:text-rose-400 hover:bg-[#1e1e24] rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Send Test In-App Notification Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0e0e12] border border-[#27272a] rounded-xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="text-base font-semibold text-white">Send Test In-App Notification</h3>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="text-[#71717a] hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendTestNotification} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#a1a1aa] block mb-1">Recipient ID</label>
                  <input
                    type="text"
                    required
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141417] border border-[#27272a] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#a1a1aa] block mb-1">Channel</label>
                  <select
                    value={testChannel}
                    onChange={(e) => setTestChannel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#141417] border border-[#27272a] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="in_app">in_app</option>
                    <option value="email">email</option>
                    <option value="sms">sms</option>
                    <option value="push">push</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141417] border border-[#27272a] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs text-[#a1a1aa] block mb-1">Body Content</label>
                <textarea
                  rows={3}
                  required
                  value={testBody}
                  onChange={(e) => setTestBody(e.target.value)}
                  className="w-full px-3 py-2 bg-[#141417] border border-[#27272a] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-[#0d1322] border border-blue-500/20 rounded-lg text-[11px] text-blue-300">
                Channel will be sent as <span className="font-semibold text-white">"{testChannel}"</span> for project{" "}
                <span className="font-semibold text-white">{activeProject?.name || "Active"}</span>.
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingTest}
                  className="flex items-center space-x-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  {sendingTest ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{sendingTest ? "Sending..." : "Send Notification"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
