"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Server,
  KeyRound,
  ShieldCheck,
  ChevronRight,
  Mail,
  Bell,
  Code2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card } from "../../components/ui";

export default function OverviewPage() {
  const {
    notifications,
    activeProject,
    providers,
    apiKeys,
    setIsSendNotifOpen,
    setIsCodeModalOpen,
  } = useApp();

  const total = notifications.length;
  const sentCount = notifications.filter((n) => n.status === "sent" || n.status === "delivered").length;
  const failedCount = notifications.filter((n) => n.status === "failed").length;
  const inAppCount = notifications.filter((n) => n.channel === "in_app").length;
  const emailCount = notifications.filter((n) => n.channel === "email").length;
  const deliveryRate = total ? Math.round((sentCount / total) * 100) : 100;

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Project Overview</h1>
            <Badge variant="neutral">
              {activeProject ? activeProject.name : "Default Environment"}
            </Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time delivery health, outgoing volume, and active provider channels.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCodeModalOpen(true)}
          >
            <Code2 className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
            <span>API Docs</span>
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

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">Total Dispatched</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">{total}</div>
          <div className="text-[11px] text-emerald-400 mt-1.5 inline-flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Real-time stream
          </div>
        </Card>

        <Card className="p-4 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">Delivery Success</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">{deliveryRate}%</div>
          <span className="text-[11px] text-neutral-400 mt-1.5 block">
            {sentCount} successful • {failedCount} dropped
          </span>
        </Card>

        <Card className="p-4 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">Transactional Email</span>
            <Mail className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">{emailCount}</div>
          <span className="text-[11px] text-neutral-400 mt-1.5 block">
            Resend & SMTP providers
          </span>
        </Card>

        <Card className="p-4 hover:border-neutral-700 transition-colors">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
            <span className="font-medium">In-App Notifications</span>
            <Bell className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">{inAppCount}</div>
          <span className="text-[11px] text-neutral-400 mt-1.5 block">
            Client notification center
          </span>
        </Card>
      </div>

      {/* Main Grid: Activity & Infrastructure Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <Card className="lg:col-span-2 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1f1f24] mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Live Dispatches</h3>
                <p className="text-[11px] text-neutral-400">Recent outgoing events from this project</p>
              </div>
              <Link
                href="/"
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Full Inbox</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {notifications.length === 0 ? (
              <div className="py-14 text-center">
                <Clock className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-neutral-300">No dispatches yet</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Send your first notification or trigger via SDK to view live events.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setIsSendNotifOpen(true)}
                >
                  <Send className="w-3 h-3 mr-1.5" />
                  Send Test Message
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-[#18181b]">
                {notifications.slice(0, 5).map((n, i) => (
                  <div
                    key={n._id || i}
                    className="py-3 flex items-center justify-between hover:bg-[#141418] px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-center text-neutral-300 shrink-0">
                        {n.channel === "in_app" ? (
                          <Bell className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <Mail className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {n.title || "Notification"}
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate font-mono">
                          to: {n.to || n.recipientId || "recipient"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0 ml-4">
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
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Infrastructure Checklist & Quick Actions */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-white mb-1">Configuration Status</h3>
            <p className="text-[11px] text-neutral-400 mb-4">Required infrastructure checklist</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141418] border border-[#1f1f24]">
                <div className="flex items-center space-x-2.5">
                  <Server className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-xs font-medium text-neutral-200">Email Provider</div>
                    <div className="text-[10px] text-neutral-400">
                      {providers.some((p) => p.isActive && p.channel === "email")
                        ? "Active (Resend / SMTP)"
                        : "Not configured"}
                    </div>
                  </div>
                </div>
                {providers.some((p) => p.isActive && p.channel === "email") ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Link
                    href="/settings?tab=providers"
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    Add
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141418] border border-[#1f1f24]">
                <div className="flex items-center space-x-2.5">
                  <KeyRound className="w-4 h-4 text-neutral-400" />
                  <div>
                    <div className="text-xs font-medium text-neutral-200">API Keys</div>
                    <div className="text-[10px] text-neutral-400">
                      {apiKeys.length > 0 ? `${apiKeys.length} generated` : "No keys created"}
                    </div>
                  </div>
                </div>
                {apiKeys.length > 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Link
                    href="/api-keys"
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    Create
                  </Link>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-[#141418] to-[#18181f]">
            <div className="flex items-center space-x-2 text-white font-semibold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Developer Quickstart</span>
            </div>
            <p className="text-[11px] text-neutral-400 mb-3.5">
              Deliver notifications via Node.js SDK, Python, or standard REST in under 2 minutes.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-between"
              onClick={() => setIsCodeModalOpen(true)}
            >
              <span>View SDK examples</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
