"use client";

import React, { useState } from "react";
import { Users, Search, Plus, Mail, Bell, CheckCircle2, ChevronRight, User } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card, EmptyState } from "../../components/ui";

export default function SubscribersPage() {
  const { showToast } = useApp();
  const [search, setSearch] = useState("");

  const mockSubscribers = [
    {
      id: "sub_1",
      recipientId: "usr_1001",
      email: "alex@example.com",
      phone: "+1 (555) 234-5678",
      channels: ["email", "in_app"],
      status: "Active",
      lastNotified: "12 mins ago",
    },
    {
      id: "sub_2",
      recipientId: "usr_1002",
      email: "sarah@acme.corp",
      phone: null,
      channels: ["email"],
      status: "Active",
      lastNotified: "2 hours ago",
    },
    {
      id: "sub_3",
      recipientId: "usr_1003",
      email: "dev@platform.io",
      phone: "+1 (555) 890-1234",
      channels: ["in_app"],
      status: "Active",
      lastNotified: "1 day ago",
    },
  ];

  const filtered = mockSubscribers.filter(
    (s) =>
      s.recipientId.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Subscribers & Audience</h1>
            <Badge variant="neutral">{filtered.length} recipients</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Registered recipients, channel routing preferences, and message delivery status.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast("Add subscriber")}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Add Subscriber</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 bg-[#111114] p-2.5 rounded-xl border border-[#222227]">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recipient ID or email address..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
          />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1f1f24] text-neutral-400 bg-[#141418]">
                <th className="py-3 px-4 text-left font-medium">Recipient ID</th>
                <th className="py-3 px-4 text-left font-medium">Email Destination</th>
                <th className="py-3 px-4 text-left font-medium">Enabled Channels</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Last Contacted</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18181b]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#141418] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-white">
                    {s.recipientId}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300 font-mono text-[11px]">
                    {s.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex gap-1">
                      {s.channels.map((ch) => (
                        <Badge key={ch} variant={ch === "email" ? "info" : "purple"}>
                          {ch}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">{s.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                    {s.lastNotified}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast(`Subscriber: ${s.recipientId}`)}
                    >
                      Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
