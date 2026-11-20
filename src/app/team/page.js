"use client";

import React, { useState } from "react";
import { UserPlus, Shield, Trash2, Mail, Check, UserCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card } from "../../components/ui";

export default function TeamMembersPage() {
  const { user, activeOrg, showToast } = useApp();

  const [members, setMembers] = useState([
    {
      id: "mem_1",
      name: user?.name || "Vikas Baboria",
      email: user?.email || "vikas@getnotify.dev",
      role: "Owner",
      status: "Active",
    },
    {
      id: "mem_2",
      name: "Engineering Team",
      email: "dev@getnotify.dev",
      role: "Developer",
      status: "Active",
    },
  ]);

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Team Members</h1>
            <Badge variant="neutral">{members.length} members</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Manage teammates with access to{" "}
            <span className="text-neutral-200 font-medium">{activeOrg?.name || "this organization"}</span>.
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast("Member invitation dialog")}
          >
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            <span>Invite Member</span>
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1f1f24] text-neutral-400 bg-[#141418]">
                <th className="py-3 px-4 text-left font-medium">Member</th>
                <th className="py-3 px-4 text-left font-medium">Email</th>
                <th className="py-3 px-4 text-left font-medium">Role</th>
                <th className="py-3 px-4 text-left font-medium">Access Status</th>
                <th className="py-3 px-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18181b]">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-[#141418] transition-colors">
                  <td className="py-3.5 px-4 text-white font-medium flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-[10px]">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{m.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">{m.email}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant={m.role === "Owner" ? "purple" : "info"}>
                      {m.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">{m.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {m.role !== "Owner" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => showToast("Member options")}
                      >
                        Manage
                      </Button>
                    )}
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
