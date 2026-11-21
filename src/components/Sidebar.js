"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Mail,
  Bell,
  Users,
  KeyRound,
  Server,
  Webhook,
  ScrollText,
  BarChart3,
  Gauge,
  Settings,
  UserCheck,
  CreditCard,
  ChevronDown,
  Check,
  Plus,
  LogOut,
  FolderKanban,
  Building2,
  Sparkles,
  Command,
  Search,
  BookOpen,
  Globe,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { LogoIcon } from "./Logo";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    user,
    logout,
    orgs,
    activeOrg,
    setActiveOrg,
    projects,
    activeProject,
    setActiveProject,
    setIsSearchOpen,
  } = useApp();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isProjDropdownOpen, setIsProjDropdownOpen] = useState(false);
  const orgDropdownRef = useRef(null);
  const projDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target)) {
        setIsOrgDropdownOpen(false);
      }
      if (projDropdownRef.current && !projDropdownRef.current.contains(event.target)) {
        setIsProjDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navSections = [
    {
      title: null,
      items: [
        { name: "Overview", href: "/overview", icon: LayoutGrid },
        { name: "Inbox", href: "/", icon: Mail },
        { name: "In-App Feed", href: "/?channel=in_app", icon: Bell },
        { name: "Subscribers", href: "/subscribers", icon: Users },
      ],
    },
    {
      title: "INFRASTRUCTURE",
      items: [
        { name: "Providers", href: "/settings?tab=providers", icon: Server },
        { name: "API Keys", href: "/api-keys", icon: KeyRound },
        { name: "Webhooks", href: "/webhooks", icon: Webhook },
        { name: "Event Logs", href: "/logs", icon: ScrollText },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Usage & Limits", href: "/usage", icon: Gauge },
      ],
    },
    {
      title: "WORKSPACE",
      items: [
        { name: "Settings", href: "/settings", icon: Settings },
        { name: "Team Members", href: "/team", icon: UserCheck },
        { name: "Billing", href: "/billing", icon: CreditCard },
        { name: "Documentation", href: "/docs", icon: BookOpen },
        { name: "Landing Page", href: "/landing", icon: Globe },
      ],
    },
  ];

  const isItemActive = (href) => {
    const channel = searchParams.get("channel");
    const tab = searchParams.get("tab");

    if (href === "/") {
      return pathname === "/" && channel !== "in_app";
    }
    if (href === "/?channel=in_app") {
      return pathname === "/" && channel === "in_app";
    }
    if (href === "/settings?tab=providers") {
      return pathname === "/settings" && tab === "providers";
    }
    if (href === "/settings") {
      return pathname === "/settings" && (!tab || tab !== "providers");
    }
    return pathname === href;
  };

  return (
    <aside className="w-64 bg-[#09090b] border-r border-[#1f1f24] flex flex-col h-full shrink-0 select-none text-xs">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#1f1f24]">
        <Link href="/overview" className="flex items-center space-x-2.5 group">
          <div className="group-hover:scale-105 transition-transform">
            <LogoIcon size={26} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white tracking-tight text-sm">
              getNotify
            </span>
            <span className="text-[10px] text-neutral-400 -mt-0.5 font-mono">
              v1.0 • infra
            </span>
          </div>
        </Link>
        <button
          onClick={() => setIsSearchOpen(true)}
          title="Search (⌘K)"
          className="flex items-center space-x-1 px-2 py-1 rounded-md bg-[#141418] border border-[#222227] text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
        >
          <Command className="w-3 h-3" />
          <span className="text-[10px] font-mono">K</span>
        </button>
      </div>

      {/* Switchers: Org + Project */}
      <div className="p-3 border-b border-[#1f1f24] space-y-1.5">
        {/* Organization Switcher */}
        <div className="relative" ref={orgDropdownRef}>
          <button
            onClick={() => {
              setIsOrgDropdownOpen(!isOrgDropdownOpen);
              setIsProjDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#111114] hover:bg-[#16161b] border border-[#222227] transition-colors text-left group"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="text-[11px] font-medium text-neutral-200 truncate">
                {activeOrg ? activeOrg.name : "Select Org"}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-white transition-colors" />
          </button>

          {isOrgDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#141418] border border-[#27272a] rounded-lg shadow-elevated z-50 py-1 max-h-56 overflow-y-auto">
              <div className="px-2.5 py-1 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                Organizations
              </div>
              {orgs.map((org) => (
                <button
                  key={org._id}
                  onClick={() => {
                    setActiveOrg(org);
                    setIsOrgDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs hover:bg-[#1e1e24] transition-colors text-neutral-200"
                >
                  <span className="truncate">{org.name}</span>
                  {activeOrg?._id === org._id && (
                    <Check className="w-3 h-3 text-blue-400" />
                  )}
                </button>
              ))}
              <div className="border-t border-[#222227] mt-1 pt-1">
                <Link
                  href="/organizations"
                  onClick={() => setIsOrgDropdownOpen(false)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 text-xs text-blue-400 hover:bg-[#1e1e24] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Create / Switch Org</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Project Switcher */}
        <div className="relative" ref={projDropdownRef}>
          <button
            onClick={() => {
              setIsProjDropdownOpen(!isProjDropdownOpen);
              setIsOrgDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#111114] hover:bg-[#16161b] border border-[#222227] transition-colors text-left group"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <FolderKanban className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-[11px] font-medium text-neutral-200 truncate">
                {activeProject ? activeProject.name : "Select Project"}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-white transition-colors" />
          </button>

          {isProjDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#141418] border border-[#27272a] rounded-lg shadow-elevated z-50 py-1 max-h-56 overflow-y-auto">
              <div className="px-2.5 py-1 text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                Environments / Projects
              </div>
              {projects.map((proj) => (
                <button
                  key={proj._id}
                  onClick={() => {
                    setActiveProject(proj);
                    setIsProjDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-left text-xs hover:bg-[#1e1e24] transition-colors text-neutral-200"
                >
                  <span className="truncate">{proj.name}</span>
                  {activeProject?._id === proj._id && (
                    <Check className="w-3 h-3 text-blue-400" />
                  )}
                </button>
              ))}
              <div className="border-t border-[#222227] mt-1 pt-1">
                <Link
                  href="/projects"
                  onClick={() => setIsProjDropdownOpen(false)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 text-xs text-blue-400 hover:bg-[#1e1e24] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Create / Switch Project</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-0.5">
            {section.title && (
              <div className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 tracking-wider">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const active = isItemActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg transition-colors group ${
                    active
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-neutral-400 hover:text-neutral-100 hover:bg-[#141418]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active
                        ? "text-black"
                        : "text-neutral-400 group-hover:text-neutral-200"
                    }`}
                  />
                  <span className="text-xs truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-[#1f1f24] bg-[#09090b]">
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#111114] border border-[#222227]">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-[10px] shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-neutral-200 truncate">
                {user?.name || "User"}
              </span>
              <span className="text-[10px] text-neutral-400 truncate">
                {user?.email || ""}
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            title="Log Out"
            className="text-neutral-400 hover:text-rose-400 transition-colors p-1"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
