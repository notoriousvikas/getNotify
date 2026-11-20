"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Card } from "../../components/ui";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, showToast } = useApp();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(email, password);
        showToast("Welcome back!");
      } else {
        await register(name, email, password);
        showToast("Account created successfully!");
      }
      router.replace("/");
    } catch (err) {
      showToast(err.message || "Authentication failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between select-none relative font-sans">
      {/* Top Bar */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-[#1f1f24]">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-white text-black font-bold flex items-center justify-center text-xs">
            N
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">getNotify</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-[#111114] border border-[#222227] rounded-2xl shadow-elevated overflow-hidden p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {mode === "login" ? "Sign in to getNotify" : "Create developer account"}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {mode === "login"
                ? "Access your notification infrastructure and API keys."
                : "Get started with 10,000 free transactional emails / month."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Smith"
                  required
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-2"
              loading={submitting}
            >
              <span>{mode === "login" ? "Sign In" : "Get Started"}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </form>

          <div className="pt-2 border-t border-[#1f1f24] text-center text-xs text-neutral-400">
            {mode === "login" ? (
              <span>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-white hover:underline font-medium"
                >
                  Create one
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-white hover:underline font-medium"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
