"use client";

import React from "react";
import { Gauge, Zap, AlertCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card } from "../../components/ui";

export default function UsagePage() {
  const { notifications } = useApp();

  const monthlyLimit = 10000;
  const used = notifications.length || 142;
  const percent = Math.min(Math.round((used / monthlyLimit) * 100), 100);

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Usage & Limits</h1>
            <Badge variant="neutral">Developer Tier</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Current billing cycle quota, rate limits, and plan consumption.
          </p>
        </div>
        <Link href="/billing">
          <Button variant="secondary" size="sm">
            <span>Upgrade Tier</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Monthly Notifications</h3>
            <span className="text-xs text-neutral-400 font-mono">Resets in 16 days</span>
          </div>

          <div className="text-3xl font-bold text-white font-mono mb-2">
            {used.toLocaleString()}{" "}
            <span className="text-sm font-normal text-neutral-400">/ {monthlyLimit.toLocaleString()}</span>
          </div>

          <div className="w-full bg-[#18181b] h-2 rounded-full overflow-hidden mb-3 border border-[#27272a]">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-[11px] text-neutral-400">
            You have consumed {percent}% of your monthly developer quota.
          </span>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Infrastructure Rate Limits</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-[#1f1f24]">
              <span className="text-neutral-400">API Request Rate</span>
              <span className="text-white font-mono font-medium">1,000 req / min</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#1f1f24]">
              <span className="text-neutral-400">Email Burst Throughput</span>
              <span className="text-white font-mono font-medium">100 msgs / sec</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-neutral-400">Concurrent Webhooks</span>
              <span className="text-white font-mono font-medium">50 concurrent</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
