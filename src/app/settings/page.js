"use client";

import React, { useState, useEffect } from "react";
import {
  Server,
  Plus,
  Trash2,
  Send,
  Edit2,
  X,
  MessageSquare,
  Mail,
  Zap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card, EmptyState } from "../../components/ui";

/* ── channel icon helper ── */
const ChannelIcon = ({ channel }) => {
  if (channel === "sms") return <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
  return <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
};

/* ── provider logo letter ── */
const ProviderIcon = ({ provider }) => {
  const map = { resend: { letter: "R", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" }, smtp: { letter: "S", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }, twilio: { letter: "T", color: "text-red-400 bg-red-500/10 border-red-500/20" } };
  const def = map[provider] || { letter: provider.charAt(0).toUpperCase(), color: "text-neutral-400 bg-[#18181b] border-[#27272a]" };
  return (
    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-sm ${def.color}`}>
      {def.letter}
    </div>
  );
};

export default function SettingsPage() {
  const {
    user,
    activeProject,
    providers,
    deleteProvider,
    setDefaultProvider,
    sendNotification,
    showToast,
    setIsAddProviderOpen,
    setAddProviderEditTarget,
  } = useApp();

  const [activeTab, setActiveTab] = useState("general");
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testRecipient, setTestRecipient] = useState(user?.email || "user@example.com");
  const [testSending, setTestSending] = useState(false);
  const [channelFilter, setChannelFilter] = useState("all");

  /* ── read ?tab from URL ── */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab");
      if (p && ["general", "providers"].includes(p)) setActiveTab(p);
    }
  }, []);

  /* ── open the global drawer ── */
  const openAdd = () => {
    setAddProviderEditTarget(null);
    setIsAddProviderOpen(true);
  };

  const openEdit = (p) => {
    setAddProviderEditTarget(p);
    setIsAddProviderOpen(true);
  };

  /* ── test send ── */
  const handleTestSend = async (e) => {
    e.preventDefault();
    if (!testRecipient.trim()) return;
    setTestSending(true);
    try {
      await sendNotification({
        recipientId: testRecipient.trim(),
        to: testRecipient.trim(),
        title: "Test Email from getNotify",
        body: "<p>Success! Your email provider infrastructure is configured and operational.</p>",
        channel: "email",
      });
      setTestModalOpen(false);
    } catch (err) {
      showToast(err.message || "Failed to send test email", "error");
    } finally {
      setTestSending(false);
    }
  };

  const filteredProviders = providers.filter(
    (p) => channelFilter === "all" || p.channel === channelFilter
  );

  /* ══ render ══ */
  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-6 font-sans">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Project Settings</h1>
            <Badge variant="neutral">{activeProject?.name || "Global"}</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Configure delivery providers, environment settings, and authentication.
          </p>
        </div>

        {activeTab === "providers" && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTestModalOpen(true)}
              disabled={providers.filter((p) => p.channel === "email").length === 0}
            >
              <Send className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
              <span>Send Test Email</span>
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={openAdd}
              disabled={!activeProject}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Add Provider</span>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 border-b border-[#1f1f24] pb-px">
        {[
          { id: "general", label: "General" },
          { id: "providers", label: "Delivery Providers", badge: providers.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? "border-white text-white"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <Badge variant="neutral">{tab.badge}</Badge>
            )}
          </button>
        ))}
      </div>

      {/* ── General tab ── */}
      {activeTab === "general" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-white mb-1">Environment Identity</h3>
            <p className="text-xs text-neutral-400 mb-4">Details for your current project environment.</p>
            <div className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Project Name</label>
                <input
                  type="text"
                  value={activeProject?.name || ""}
                  disabled
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-neutral-300 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Project ID</label>
                <input
                  type="text"
                  value={activeProject?._id || ""}
                  disabled
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-neutral-400 font-mono cursor-not-allowed"
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Providers tab ── */}
      {activeTab === "providers" && (
        <div className="space-y-5">

          {/* channel filter pills */}
          {providers.length > 0 && (
            <div className="flex items-center gap-2">
              {["all", "email", "sms"].map((f) => (
                <button
                  key={f}
                  onClick={() => setChannelFilter(f)}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-colors capitalize ${
                    channelFilter === f
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-neutral-400 border-[#27272a] hover:border-neutral-500 hover:text-neutral-200"
                  }`}
                >
                  {f === "all" ? "All" : f.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {filteredProviders.length === 0 ? (
            <Card>
              <EmptyState
                icon={Server}
                title="No delivery providers connected"
                description="Connect Resend, custom SMTP, or Twilio SMS to enable outgoing notifications."
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={openAdd}
                    disabled={!activeProject}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Connect Provider
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders.map((p) => (
                <Card key={p._id} className="p-5 flex flex-col justify-between space-y-4">
                  <div>
                    {/* header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <ProviderIcon provider={p.provider} />
                        <div>
                          <h4 className="text-sm font-semibold text-white capitalize">{p.provider}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            <ChannelIcon channel={p.channel} />
                            <span className="text-[11px] text-neutral-400 font-mono">{p.channel}</span>
                          </div>
                        </div>
                      </div>
                      {p.isDefault && <Badge variant="purple">Default</Badge>}
                    </div>

                    {/* config preview */}
                    <div className="mt-4 p-2.5 rounded-lg bg-[#141418] border border-[#222227] space-y-1 text-[11px] font-mono">
                      {p.channel === "sms" ? (
                        <>
                          <div className="text-neutral-300 truncate">From: {p.config?.from || "Twilio Number"}</div>
                          <div className="text-neutral-400 truncate">SID: {p.config?.accountSid ? p.config.accountSid.slice(0, 12) + "…" : "—"}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-neutral-300 truncate">From: {p.config?.fromEmail || "System"}</div>
                          <div className="text-neutral-400 truncate">Sender: {p.config?.fromName || "getNotify"}</div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* footer */}
                  <div className="pt-2 border-t border-[#1f1f24] flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className={`w-2 h-2 rounded-full ${p.isActive ? "bg-emerald-400" : "bg-neutral-600"}`} />
                      <span className="text-[11px] text-neutral-400">{p.isActive ? "Active" : "Inactive"}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      {!p.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDefaultProvider(p._id)}
                          title="Set as default"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteProvider(p._id)}
                        className="hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Test Send Modal ── */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#111114] border border-[#222227] rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Send Test Email</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Verify your active delivery provider by sending a real transactional message.
                </p>
              </div>
              <button onClick={() => setTestModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTestSend} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Recipient Email *</label>
                <input
                  type="email"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  required
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setTestModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={testSending}>
                  Send Test
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
