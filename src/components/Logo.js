"use client";

import React from "react";
import Link from "next/link";

/**
 * Geometric 'gn' Icon Mark for getNotify
 * Seamlessly integrates 'g' (bowl + descender loop) and 'n' (arch + descending stem)
 * with a luminous notification signal pulse beacon at the apex.
 */
export function LogoIcon({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        {/* Container Dark Glass Gradient */}
        <linearGradient id="gn-bg" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#1c1c22" />
          <stop offset="100%" stop-color="#0b0b0e" />
        </linearGradient>

        {/* 'g' Electric Cyan -> Indigo Gradient */}
        <linearGradient id="gn-g-grad" x1="16" y1="22" x2="52" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="60%" stop-color="#6366f1" />
          <stop offset="100%" stop-color="#818cf8" />
        </linearGradient>

        {/* 'n' Indigo -> Violet -> Fuchsia Gradient */}
        <linearGradient id="gn-n-grad" x1="48" y1="22" x2="86" y2="76" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#818cf8" />
          <stop offset="60%" stop-color="#a855f7" />
          <stop offset="100%" stop-color="#c084fc" />
        </linearGradient>

        {/* Notification Signal Glow */}
        <linearGradient id="gn-ping" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#60a5fa" />
        </linearGradient>

        <filter id="gn-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded squircle backdrop with subtle border */}
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="22"
        fill="url(#gn-bg)"
        stroke="#27272a"
        strokeWidth="2.5"
      />

      {/* Subtle interior glow */}
      <circle cx="50" cy="50" r="30" fill="#6366f1" opacity="0.1" filter="url(#gn-glow)" />

      <g strokeLinecap="round" strokeLinejoin="round">
        {/* 'g' Bowl (left circular loop) */}
        <path
          d="M 48 38 C 48 29.16 40.84 22 32 22 C 23.16 22 16 29.16 16 38 C 16 46.84 23.16 54 32 54 C 40.84 54 48 46.84 48 38 Z"
          stroke="url(#gn-g-grad)"
          strokeWidth="8.5"
        />

        {/* 'g' Descender (sweeping down and hooking smoothly under) */}
        <path
          d="M 48 38 L 48 66 C 48 74 41 79 32 79 C 23 79 18 74 18 70"
          stroke="url(#gn-g-grad)"
          strokeWidth="8.5"
        />

        {/* 'n' Arch & Leg (rising from central spine and arching over to right) */}
        <path
          d="M 48 44 C 48 32 56 22 68 22 C 77 22 84 29 84 38 L 84 74"
          stroke="url(#gn-n-grad)"
          strokeWidth="8.5"
        />

        {/* Notification Beacon Dot */}
        <circle cx="84" cy="17" r="4.5" fill="url(#gn-ping)" filter="url(#gn-glow)" />

        {/* Broadcast Radio Waves */}
        <path
          d="M 75 11 C 78 8 84 7 89 9"
          stroke="#38bdf8"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}

/**
 * Full Brand Logo (Icon + Wordmark)
 */
export default function Logo({
  size = 28,
  withText = true,
  subtitle = null,
  href = "/",
  className = "",
}) {
  const content = (
    <div className={`flex items-center space-x-2.5 group ${className}`}>
      <div className="group-hover:scale-105 transition-transform">
        <LogoIcon size={size} />
      </div>
      {withText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm tracking-tight text-white group-hover:text-neutral-100 transition-colors">
              getNotify
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
