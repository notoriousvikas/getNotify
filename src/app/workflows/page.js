"use client";

import React, { useState } from "react";
import { GitFork, Plus, Play, Search, Sparkles, ArrowUpRight, Zap, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card } from "../../components/ui";

export default function WorkflowsPage() {
  const { showToast } = useApp();
  const [search, setSearch] = useState("");

  const templates = [
    {
      id: "tpl_1",
      title: "Generate with AI",
      desc: "Describe what you want to send and let AI build the multi-channel workflow graph.",
      badge: "AI Powered",
    },
    {
      id: "tpl_2",
      title: "Welcome Onboarding",
      desc: "Send an instant welcome email followed by an in-app tour notification.",
      badge: "Popular",
    },
    {
      id: "tpl_3",
      title: "Usage Limit Alert",
      desc: "Trigger high-priority alert when customer reaches 90% of quota limit.",
      badge: "Transactional",
    },
    {
      id: "tpl_4",
      title: "Upcoming Renewal",
      desc: "Reminder sequences 7 days and 24 hours before subscription cycle renews.",
      badge: "Billing",
    },
  ];

  const workflows = [
    {
      id: "wf_1",
      name: "Onboarding Welcome Sequence",
      slug: "onboarding-welcome-sequence",
      trigger: "user.created",
      steps: 3,
      status: "Active",
      lastTriggered: "14 mins ago",
      updatedAt: "Nov 15, 2026",
    },
    {
      id: "wf_2",
      name: "Password Reset & Magic Link",
      slug: "auth-magic-link",
      trigger: "auth.reset_requested",
      steps: 2,
      status: "Active",
      lastTriggered: "2 hours ago",
      updatedAt: "Nov 12, 2026",
    },
    {
      id: "wf_3",
      name: "Weekly Analytics Summary",
      slug: "weekly-analytics-digest",
      trigger: "cron:weekly",
      steps: 4,
      status: "Draft",
      lastTriggered: "Never",
      updatedAt: "Nov 10, 2026",
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Notification Workflows</h1>
            <Badge variant="neutral">{workflows.length} sequences</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Automate multi-step notification pipelines across Email, In-App, and Webhook channels.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast("Create workflow canvas")}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Create Workflow</span>
          </Button>
        </div>
      </div>

      {/* Templates Row */}
      <div>
        <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
          Quickstart Templates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((t) => (
            <Card
              key={t.id}
              className="p-4 hover:border-neutral-700 transition-colors cursor-pointer group flex flex-col justify-between"
              onClick={() => showToast(`Template: ${t.title}`)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="purple">{t.badge}</Badge>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
                </div>
                <h4 className="text-xs font-semibold text-white mb-1">{t.title}</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{t.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflows List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1f1f24] text-neutral-400 bg-[#141418]">
                <th className="py-3 px-4 text-left font-medium">Workflow Name</th>
                <th className="py-3 px-4 text-left font-medium">Trigger Event</th>
                <th className="py-3 px-4 text-left font-medium">Steps</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Last Run</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18181b]">
              {workflows.map((wf) => (
                <tr key={wf.id} className="hover:bg-[#141418] transition-colors">
                  <td className="py-3.5 px-4 text-white font-medium">
                    <div className="flex items-center space-x-2">
                      <GitFork className="w-3.5 h-3.5 text-blue-400" />
                      <span>{wf.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-300">
                    {wf.trigger}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">
                    {wf.steps} actions
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={wf.status === "Active" ? "success" : "neutral"}>
                      {wf.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                    {wf.lastTriggered}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showToast(`Edit workflow ${wf.name}`)}
                    >
                      Configure
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
