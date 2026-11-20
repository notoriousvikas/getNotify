"use client";

import React from "react";
import { BarChart3, TrendingUp, CheckCircle2, AlertOctagon, Zap, ArrowUpRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card } from "../../components/ui";

export default function AnalyticsPage() {
  const { notifications } = useApp();

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Analytics & Performance</h1>
            <Badge variant="neutral">30 Days</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Delivery confirmation rates, latencies, open metrics, and failure breakdowns.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="text-neutral-400 text-xs font-medium mb-1">Open Rate</div>
          <div className="text-3xl font-bold text-white font-mono">64.2%</div>
          <span className="text-xs text-emerald-400 mt-2 block font-medium">+4.1% vs last week</span>
        </Card>
        <Card className="p-5">
          <div className="text-neutral-400 text-xs font-medium mb-1">Click-through Rate</div>
          <div className="text-3xl font-bold text-white font-mono">21.8%</div>
          <span className="text-xs text-blue-400 mt-2 block font-medium">+1.5% vs last week</span>
        </Card>
        <Card className="p-5">
          <div className="text-neutral-400 text-xs font-medium mb-1">Drop / Bounce Rate</div>
          <div className="text-3xl font-bold text-white font-mono">0.4%</div>
          <span className="text-xs text-neutral-400 mt-2 block">Within normal SLA</span>
        </Card>
      </div>

      {/* Analytics Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white">30-Day Message Throughput</h3>
            <p className="text-[11px] text-neutral-400">Total volume of messages dispatched across all channels</p>
          </div>
          <Badge variant="neutral">Real-time trace</Badge>
        </div>

        <div className="h-56 flex items-end gap-3 px-2 border-b border-[#1f1f24] pb-4">
          {[40, 65, 30, 80, 95, 60, 45, 85, 100, 75, 90, 80, 110, 95, 120].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
              <div
                style={{ height: `${val * 1.4}px` }}
                className="w-full bg-blue-600/40 hover:bg-blue-500 rounded-t transition-all group-hover:scale-105"
              />
              <span className="text-[10px] text-neutral-500 font-mono">D{idx + 1}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
