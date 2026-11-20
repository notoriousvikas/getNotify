"use client";

import React, { useState } from "react";
import { ScrollText, Search, Download, Filter, RefreshCw, Clock, CheckCircle2, AlertOctagon } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card, EmptyState } from "../../components/ui";

export default function EventLogsPage() {
  const { notifications, showToast } = useApp();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const mockLogs = [
    {
      id: "evt_101",
      event: "email.dispatched",
      recipient: "alex@example.com",
      status: "200 OK",
      latency: "142ms",
      time: "2 mins ago",
    },
    {
      id: "evt_102",
      event: "in_app.delivered",
      recipient: "usr_9982",
      status: "200 OK",
      latency: "45ms",
      time: "15 mins ago",
    },
    {
      id: "evt_103",
      event: "api.request",
      recipient: "POST /v1/notifications",
      status: "201 Created",
      latency: "89ms",
      time: "1 hour ago",
    },
    {
      id: "evt_104",
      event: "provider.dispatched",
      recipient: "smtp.mailgun.org",
      status: "200 OK",
      latency: "310ms",
      time: "3 hours ago",
    },
    {
      id: "evt_105",
      event: "webhook.retry",
      recipient: "https://api.domain.com/hooks",
      status: "504 Timeout",
      latency: "5000ms",
      time: "4 hours ago",
    },
  ];

  const filteredLogs = mockLogs.filter((log) => {
    if (filterType !== "all" && !log.event.startsWith(filterType)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      log.id.toLowerCase().includes(q) ||
      log.event.toLowerCase().includes(q) ||
      log.recipient.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Event & Trace Logs</h1>
            <Badge variant="neutral">{filteredLogs.length} events</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Raw request trace logs, dispatch latencies, and provider response codes.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => showToast("Logs refreshed")}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
            <span>Refresh Stream</span>
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111114] p-2.5 rounded-xl border border-[#222227]">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search event ID, recipient, or endpoint..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-[#18181b] border border-[#27272a] text-neutral-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-neutral-500"
        >
          <option value="all">All Event Types</option>
          <option value="email">Email Events</option>
          <option value="in_app">In-App Events</option>
          <option value="api">API Invocations</option>
          <option value="webhook">Webhooks</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1f1f24] text-neutral-400 bg-[#141418]">
                <th className="py-3 px-4 text-left font-medium">Event ID</th>
                <th className="py-3 px-4 text-left font-medium">Type</th>
                <th className="py-3 px-4 text-left font-medium">Target / Endpoint</th>
                <th className="py-3 px-4 text-left font-medium">Status Code</th>
                <th className="py-3 px-4 text-left font-medium">Latency</th>
                <th className="py-3 px-4 text-right font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18181b]">
              {filteredLogs.map((log) => {
                const isError = log.status.startsWith("5") || log.status.startsWith("4");
                return (
                  <tr key={log.id} className="hover:bg-[#141418] transition-colors">
                    <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">{log.id}</td>
                    <td className="py-3.5 px-4 text-white font-medium">
                      <span className="font-mono text-xs">{log.event}</span>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300 font-mono text-[11px] truncate max-w-xs">
                      {log.recipient}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={isError ? "danger" : "success"}>
                        {log.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                      {log.latency}
                    </td>
                    <td className="py-3.5 px-4 text-right text-neutral-400 font-mono text-[11px]">
                      {log.time}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
