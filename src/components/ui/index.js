import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Button({
  className,
  variant = "primary", // primary | secondary | outline | ghost | danger
  size = "md", // sm | md | lg | icon
  disabled,
  loading,
  children,
  ...props
}) {
  const base = "inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] disabled:opacity-45 disabled:pointer-events-none disabled:active:scale-100 select-none";

  const variants = {
    primary: "bg-white text-black hover:bg-neutral-200 shadow-sm",
    accent: "bg-blue-600 text-white hover:bg-blue-500 shadow-sm shadow-blue-500/20",
    secondary: "bg-[#18181b] text-neutral-200 hover:bg-[#222226] border border-[#27272a]",
    outline: "bg-transparent text-neutral-300 hover:text-white hover:bg-[#18181b] border border-[#27272a]",
    ghost: "bg-transparent text-neutral-400 hover:text-neutral-100 hover:bg-[#18181b]",
    danger: "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 rounded-md gap-1.5",
    md: "text-xs px-3.5 py-2 rounded-lg gap-2",
    lg: "text-sm px-4 py-2.5 rounded-lg gap-2.5",
    icon: "h-8 w-8 rounded-lg p-0",
  };

  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}

export function Badge({
  className,
  variant = "neutral", // neutral | success | warning | danger | info | purple
  children,
  ...props
}) {
  const variants = {
    neutral: "bg-[#18181b] text-neutral-400 border-[#27272a]",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border font-mono tracking-tight",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-[#111114] border border-[#222227] rounded-xl shadow-card overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-[#141418] border border-[#222227] flex items-center justify-center text-neutral-400 mb-3.5 shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-neutral-200">{title}</h3>
      {description && (
        <p className="text-xs text-neutral-400 max-w-sm mt-1 mb-5">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
