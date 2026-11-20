"use client";

import React, { useState } from "react";
import { Webhook, Plus, CheckCircle2, Copy, Play, Check, ExternalLink } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card, EmptyState } from "../../components/ui";

export default function WebhooksPage() {
  const { showToast, activeProject } = useApp();
  const [copiedId, setCopiedId] = useState(null);

  const [endpoints, setEndpoints] = useState([
    {
      id: "wh_01",
      url: "https://api.yourdomain.com/v1/webhooks/getnotify",
      events: ["notification.delivered", "notification.failed"],
      status: "Active",
      successRate: "99.8%",
    },
    {
      id: "wh_02",
      url: "https://ops.yourdomain.com/alerts/inbound",
      events: ["email.bounced", "provider.error"],
      status: "Active",
      successRate: "100%",
    },
  ]);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Endpoint URL copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Webhook Endpoints</h1>
            <Badge variant="neutral">{endpoints.length} active</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Stream real-time delivery confirmations, bounce events, and status updates directly to your backend.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast("Add endpoint configuration modal")}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Add Endpoint</span>
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1f1f24] text-neutral-400 bg-[#141418]">
                <th className="py-3 px-4 text-left font-medium">Endpoint URL</th>
                <th className="py-3 px-4 text-left font-medium">Subscribed Topics</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Delivery Rate</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18181b]">
              {endpoints.map((ep) => (
                <tr key={ep.id} className="hover:bg-[#141418] transition-colors">
                  <td className="py-3.5 px-4 text-white font-mono text-[11px] flex items-center gap-2">
                    <Webhook className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span className="truncate max-w-sm">{ep.url}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {ep.events.map((ev) => (
                        <span
                          key={ev}
                          className="px-2 py-0.5 rounded bg-[#18181b] border border-[#27272a] text-[10px] text-neutral-300 font-mono"
                        >
                          {ev}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">{ep.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-400 font-mono font-medium">
                    {ep.successRate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copy(ep.url, ep.id)}
                    >
                      {copiedId === ep.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="ml-1.5">Copy URL</span>
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
