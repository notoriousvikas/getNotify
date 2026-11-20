"use client";

import React, { useState } from "react";
import { X, Send, Eye, Code, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button, Badge } from "./ui";

export default function SendEmailModal() {
  const {
    isSendNotifOpen,
    setIsSendNotifOpen,
    sendNotification,
    activeProject,
    providers,
    showToast,
    setIsAddProviderOpen,
    setAddProviderEditTarget,
  } = useApp();

  const openAddProvider = () => {
    setAddProviderEditTarget(null);
    setIsAddProviderOpen(true);
  };

  const [recipientId, setRecipientId] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toPhone, setToPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [channel, setChannel] = useState("email");
  const [body, setBody] = useState(
    "<p>Hello!</p><p>This is a test notification sent via GetNotify infrastructure.</p>"
  );
  const [activeTab, setActiveTab] = useState("edit");
  const [sending, setSending] = useState(false);

  const hasEmailProvider = providers.some(
    (p) => p.isActive && p.channel === "email"
  );

  const hasSmsProvider = providers.some(
    (p) => p.isActive && p.channel === "sms"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recipientId.trim()) {
      showToast("Please provide a recipient ID", "error");
      return;
    }
    if (channel === "email" && !subject.trim()) {
      showToast("Please provide a subject", "error");
      return;
    }
    if (channel === "email" && !toEmail.trim()) {
      showToast("Please provide destination email (To)", "error");
      return;
    }
    if (channel === "sms" && !toPhone.trim()) {
      showToast("Please provide a destination phone number", "error");
      return;
    }
    if (!activeProject) {
      showToast("Select a project first", "error");
      return;
    }
    if (channel === "email" && !hasEmailProvider) {
      showToast(
        "No active email provider configured for this project. Please add Resend or SMTP in Settings > Providers first.",
        "error"
      );
      return;
    }
    if (channel === "sms" && !hasSmsProvider) {
      showToast(
        "No active SMS provider configured for this project. Please add Twilio in Settings > Providers first.",
        "error"
      );
      return;
    }

    setSending(true);
    try {
      await sendNotification({
        recipientId: recipientId.trim(),
        to: channel === "sms" ? toPhone.trim() : toEmail.trim() || undefined,
        title: subject.trim(),
        body,
        channel,
      });
      setIsSendNotifOpen(false);
      setRecipientId("");
      setToEmail("");
      setToPhone("");
      setSubject("");
      setBody("<p>Hello!</p>");
    } catch (err) {
      showToast(err.message || "Failed to send notification", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isSendNotifOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSendNotifOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-[#09090b] border-l border-[#1f1f24] z-50 transition-transform duration-250 ease-out flex flex-col shadow-2xl font-sans ${
          isSendNotifOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f1f24] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4 text-neutral-300" />
            <h3 className="font-semibold text-white text-sm">Send Notification</h3>
          </div>
          <button
            onClick={() => setIsSendNotifOpen(false)}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Warning if no project selected */}
          {!activeProject && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>No project selected. Please choose a project environment first.</span>
            </div>
          )}

          {/* Warning if no email provider configured */}
          {activeProject && channel === "email" && !hasEmailProvider && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2 text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-400">No active email provider</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Connect Resend or SMTP to deliver outgoing transactional emails.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openAddProvider}
                className="px-2.5 py-1 bg-amber-400 text-black font-semibold rounded text-[11px] shrink-0 hover:bg-amber-300 transition-colors"
              >
                Add Provider
              </button>
            </div>
          )}

          {/* Warning if no SMS provider configured */}
          {activeProject && channel === "sms" && !hasSmsProvider && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2 text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-400">No active SMS provider</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    Connect Twilio to deliver outgoing SMS messages.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={openAddProvider}
                className="px-2.5 py-1 bg-amber-400 text-black font-semibold rounded text-[11px] shrink-0 hover:bg-amber-300 transition-colors"
              >
                Add Provider
              </button>
            </div>
          )}

          <form id="send-email-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block font-medium text-neutral-300 mb-1.5">
                  Recipient ID *
                </label>
                <input
                  type="text"
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="e.g. usr_1001"
                  required
                  className="w-full bg-[#141418] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-300 mb-1.5">Channel</label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full bg-[#141418] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-500"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="in_app">In-App</option>
                </select>
              </div>
            </div>

            {channel === "email" && (
              <div>
                <label className="block font-medium text-neutral-300 mb-1.5">
                  Destination Email (To) *
                </label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  required={channel === "email"}
                  className="w-full bg-[#141418] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                />
              </div>
            )}

            {channel === "sms" && (
              <div>
                <label className="block font-medium text-neutral-300 mb-1.5">
                  Destination Phone (To) *
                </label>
                <input
                  type="tel"
                  value={toPhone}
                  onChange={(e) => setToPhone(e.target.value)}
                  placeholder="e.g. +14155552671"
                  required={channel === "sms"}
                  className="w-full bg-[#141418] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                />
                <p className="text-[11px] text-neutral-500 mt-1">Include country code (e.g. +1 for US)</p>
              </div>
            )}

            <div>
              <label className="block font-medium text-neutral-300 mb-1.5">Subject / Title *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Welcome to getNotify!"
                required
                className="w-full bg-[#141418] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-medium text-neutral-300">Body Content (HTML / Text)</label>
                <div className="flex bg-[#141418] p-0.5 rounded-md border border-[#27272a] text-[11px]">
                  <button
                    type="button"
                    onClick={() => setActiveTab("edit")}
                    className={`px-2.5 py-0.5 rounded transition-colors ${
                      activeTab === "edit" ? "bg-[#27272a] text-white" : "text-neutral-400"
                    }`}
                  >
                    <Code className="w-3 h-3 inline mr-1" />
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`px-2.5 py-0.5 rounded transition-colors ${
                      activeTab === "preview" ? "bg-[#27272a] text-white" : "text-neutral-400"
                    }`}
                  >
                    <Eye className="w-3 h-3 inline mr-1" />
                    Preview
                  </button>
                </div>
              </div>

              {activeTab === "edit" ? (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={7}
                  className="w-full bg-[#141418] border border-[#27272a] rounded-lg p-3 text-xs text-white font-mono placeholder-neutral-400 focus:outline-none focus:border-neutral-500 resize-none leading-relaxed"
                />
              ) : (
                <div className="bg-white text-black p-4 rounded-lg min-h-[160px] text-xs shadow-inner">
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1f1f24] flex justify-end space-x-2.5 shrink-0 bg-[#09090b]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsSendNotifOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="send-email-form"
            variant="primary"
            size="sm"
            disabled={sending || !activeProject}
            loading={sending}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            <span>Send Message</span>
          </Button>
        </div>
      </div>
    </>
  );
}
