"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function NotificationToast() {
  const { toast } = useApp();

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-12 right-6 z-50 flex items-center space-x-2.5 px-4 py-2.5 rounded-xl bg-[#141418] border border-[#27272a] shadow-elevated text-xs text-white font-sans animate-in fade-in slide-in-from-bottom-2 duration-200">
      {isError ? (
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      )}
      <span className="font-medium">{toast.message}</span>
    </div>
  );
}
