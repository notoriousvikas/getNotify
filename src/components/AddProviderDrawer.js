"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Server,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  MessageSquare,
  Mail,
  Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button, Badge } from "./ui";

/* ─── Provider catalogue ──────────────────────────────────────────── */
const PROVIDERS = [
  {
    id: "resend",
    label: "Resend",
    channel: "email",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    description: "Transactional email via the Resend API.",
    docsUrl: "https://resend.com/docs",
    fields: ["apiKey", "fromEmail", "fromName"],
  },
  {
    id: "smtp",
    label: "Custom SMTP",
    channel: "email",
    icon: Mail,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    description: "Any SMTP server — Gmail, Postfix, SendGrid, etc.",
    docsUrl: "https://nodemailer.com/smtp/",
    fields: ["host", "port", "username", "password", "fromEmail", "fromName"],
  },
  {
    id: "twilio",
    label: "Twilio SMS",
    channel: "sms",
    icon: MessageSquare,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    description: "Outbound SMS via Twilio Programmable Messaging.",
    docsUrl: "https://console.twilio.com",
    fields: ["accountSid", "authToken", "fromPhone"],
  },
];

const EMPTY_FORM = {
  provider: "resend",
  channel: "email",
  apiKey: "",
  fromEmail: "",
  fromName: "getNotify",
  host: "smtp.gmail.com",
  port: 587,
  username: "",
  password: "",
  accountSid: "",
  authToken: "",
  fromPhone: "",
  isActive: true,
  isDefault: false,
};

/* ─── Input helpers ───────────────────────────────────────────────── */
function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block font-medium text-neutral-300 mb-1.5 text-xs">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-neutral-500 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({ type = "text", value, onChange, placeholder, required, mono, ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full bg-[#141418] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500 ${mono ? "font-mono" : ""}`}
      {...rest}
    />
  );
}

/* ═══ Main component ══════════════════════════════════════════════════ */
export default function AddProviderDrawer() {
  const {
    isAddProviderOpen,
    setIsAddProviderOpen,
    addProviderEditTarget,
    setAddProviderEditTarget,
    activeProject,
    providers,
    createProvider,
    updateProvider,
    showToast,
  } = useApp();

  /* ── form state ── */
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  /* ── derived ── */
  const selectedProvider = PROVIDERS.find((p) => p.id === form.provider) || PROVIDERS[0];
  const isEditing = !!addProviderEditTarget;

  /* ── seed form when drawer opens ── */
  useEffect(() => {
    if (!isAddProviderOpen) return;

    if (addProviderEditTarget) {
      const p = addProviderEditTarget;
      setForm({
        provider: p.provider || "resend",
        channel: p.channel || "email",
        apiKey: p.config?.apiKey || "",
        fromEmail: p.config?.fromEmail || "",
        fromName: p.config?.fromName || "getNotify",
        host: p.config?.host || "smtp.gmail.com",
        port: p.config?.port || 587,
        username: p.config?.username || "",
        password: "",
        accountSid: p.config?.accountSid || "",
        authToken: p.config?.authToken || "",
        fromPhone: p.config?.from || "",
        isActive: p.isActive !== false,
        isDefault: !!p.isDefault,
      });
    } else {
      setForm({
        ...EMPTY_FORM,
        isDefault: providers.length === 0,
      });
    }
  }, [isAddProviderOpen, addProviderEditTarget]);

  /* ── close ── */
  const handleClose = () => {
    setIsAddProviderOpen(false);
    setAddProviderEditTarget(null);
  };

  /* ── provider tile click ── */
  const selectProvider = (provDef) => {
    setForm((f) => ({
      ...f,
      provider: provDef.id,
      channel: provDef.channel,
    }));
  };

  /* ── build config payload ── */
  const buildPayload = () => {
    let config;
    if (form.provider === "smtp") {
      config = {
        host: form.host,
        port: Number(form.port),
        username: form.username,
        password: form.password,
        fromEmail: form.fromEmail,
        fromName: form.fromName,
      };
    } else if (form.provider === "twilio") {
      config = {
        accountSid: form.accountSid,
        authToken: form.authToken,
        from: form.fromPhone,
      };
    } else {
      // resend (and any future api-key based)
      config = {
        apiKey: form.apiKey,
        fromEmail: form.fromEmail,
        fromName: form.fromName,
      };
    }

    return {
      provider: form.provider,
      channel: form.channel,
      type: "custom",
      isActive: form.isActive,
      isDefault: form.isDefault,
      config,
    };
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeProject) {
      showToast("Select a project first", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (isEditing) {
        await updateProvider(addProviderEditTarget._id, payload);
      } else {
        await createProvider(payload);
      }
      handleClose();
    } catch (err) {
      showToast(err.message || "Failed to save provider", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ══════════ render ══════════ */
  return (
    <>
      {/* Backdrop */}
      {isAddProviderOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-[#09090b] border-l border-[#1f1f24] z-50 transition-transform duration-250 ease-out flex flex-col shadow-2xl font-sans ${
          isAddProviderOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-[#1f1f24] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-neutral-300" />
            <h3 className="font-semibold text-white text-sm">
              {isEditing ? "Edit Provider" : "Add Delivery Provider"}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">

          {/* No project warning */}
          {!activeProject && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>No project selected. Choose a project environment first.</span>
            </div>
          )}

          {/* ── Provider picker tiles (hide when editing) ── */}
          {!isEditing && (
            <div>
              <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2.5">
                Provider
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {PROVIDERS.map((prov) => {
                  const Icon = prov.icon;
                  const active = form.provider === prov.id;
                  return (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => selectProvider(prov)}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all text-center ${
                        active
                          ? `${prov.bg} ${prov.border} ${prov.color} ring-1 ring-inset ${prov.border}`
                          : "bg-[#111114] border-[#222227] text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-[11px] leading-tight">{prov.label}</span>
                      {active && (
                        <CheckCircle2 className="w-3 h-3 absolute top-2 right-2 opacity-70" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Provider description + docs link */}
              <div className={`mt-3 p-3 rounded-lg border ${selectedProvider.bg} ${selectedProvider.border} flex items-start justify-between gap-3`}>
                <p className={`text-[11px] leading-relaxed ${selectedProvider.color}`}>
                  {selectedProvider.description}
                </p>
                <a
                  href={selectedProvider.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-1 text-[11px] font-medium shrink-0 ${selectedProvider.color} hover:opacity-70 transition-opacity`}
                >
                  Docs <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* ── When editing: show read-only provider + channel badges ── */}
          {isEditing && (
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="neutral" className="capitalize">{form.provider}</Badge>
              <Badge variant="info">{form.channel}</Badge>
            </div>
          )}

          {/* ── Channel (read-only display, auto-set by provider) ── */}
          {!isEditing && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400">Channel:</span>
              <Badge variant={form.channel === "sms" ? "warning" : "info"}>
                {form.channel}
              </Badge>
            </div>
          )}

          {/* ══ Credential fields ══ */}
          <form id="add-provider-form" onSubmit={handleSubmit} className="space-y-4">

            {/* ── Resend ── */}
            {form.provider === "resend" && (
              <>
                <Field label="Resend API Key *">
                  <TextInput
                    type="password"
                    value={form.apiKey}
                    onChange={(e) => setForm({ ...form, apiKey: e.target.value })}
                    placeholder="re_••••••••••••••••"
                    required
                    mono
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="From Email *">
                    <TextInput
                      type="email"
                      value={form.fromEmail}
                      onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                      placeholder="notifications@example.com"
                      required
                    />
                  </Field>
                  <Field label="From Name">
                    <TextInput
                      value={form.fromName}
                      onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                      placeholder="getNotify"
                    />
                  </Field>
                </div>
              </>
            )}

            {/* ── SMTP ── */}
            {form.provider === "smtp" && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Field label="SMTP Host *">
                      <TextInput
                        value={form.host}
                        onChange={(e) => setForm({ ...form, host: e.target.value })}
                        placeholder="smtp.gmail.com"
                        required
                        mono
                      />
                    </Field>
                  </div>
                  <Field label="Port *">
                    <TextInput
                      type="number"
                      value={form.port}
                      onChange={(e) => setForm({ ...form, port: e.target.value })}
                      required
                      mono
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Username">
                    <TextInput
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="you@gmail.com"
                    />
                  </Field>
                  <Field label="Password *">
                    <TextInput
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••••"
                      required
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="From Email *">
                    <TextInput
                      type="email"
                      value={form.fromEmail}
                      onChange={(e) => setForm({ ...form, fromEmail: e.target.value })}
                      placeholder="notifications@example.com"
                      required
                    />
                  </Field>
                  <Field label="From Name">
                    <TextInput
                      value={form.fromName}
                      onChange={(e) => setForm({ ...form, fromName: e.target.value })}
                      placeholder="getNotify"
                    />
                  </Field>
                </div>
              </>
            )}

            {/* ── Twilio SMS ── */}
            {form.provider === "twilio" && (
              <>
                <Field
                  label="Account SID *"
                  hint="Starts with AC — found on your Twilio Console dashboard"
                >
                  <TextInput
                    value={form.accountSid}
                    onChange={(e) => setForm({ ...form, accountSid: e.target.value })}
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    required
                    mono
                  />
                </Field>

                <Field label="Auth Token *">
                  <TextInput
                    type="password"
                    value={form.authToken}
                    onChange={(e) => setForm({ ...form, authToken: e.target.value })}
                    placeholder="••••••••••••••••••••••••••••••••"
                    required
                    mono
                  />
                </Field>

                <Field
                  label="From Phone Number *"
                  hint="Must be a Twilio-verified number with country code (e.g. +14155552671)"
                >
                  <TextInput
                    type="tel"
                    value={form.fromPhone}
                    onChange={(e) => setForm({ ...form, fromPhone: e.target.value })}
                    placeholder="+14155552671"
                    required
                    mono
                  />
                </Field>
              </>
            )}

            {/* ── Options row ── */}
            <div className="pt-1 border-t border-[#1f1f24] flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Active toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                    className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${
                      form.isActive ? "bg-emerald-500" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                        form.isActive ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-neutral-300">Active</span>
                </label>

                {/* Default toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div
                    onClick={() => setForm((f) => ({ ...f, isDefault: !f.isDefault }))}
                    className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer ${
                      form.isDefault ? "bg-purple-500" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
                        form.isDefault ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                  <span className="text-neutral-300">Set as default</span>
                </label>
              </div>
            </div>

          </form>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[#1f1f24] flex justify-end space-x-2.5 shrink-0 bg-[#09090b]">
          <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-provider-form"
            variant="primary"
            size="sm"
            disabled={saving || !activeProject}
            loading={saving}
          >
            <Server className="w-3.5 h-3.5 mr-1.5" />
            <span>{isEditing ? "Save Changes" : "Connect Provider"}</span>
          </Button>
        </div>
      </div>
    </>
  );
}
