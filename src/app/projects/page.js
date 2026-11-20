"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, ArrowLeft, ArrowRight, FolderKanban, Check, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card } from "../../components/ui";

export default function ProjectsPage() {
  const router = useRouter();
  const {
    projects,
    activeProject,
    setActiveProject,
    createProject,
    activeOrg,
    showToast,
  } = useApp();

  const [mode, setMode] = useState("select"); // "select" | "create"
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelect = (project) => {
    setActiveProject(project);
    showToast(`Switched to ${project.name}`);
    router.push("/");
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const newProj = await createProject(name.trim(), description.trim());
      setActiveProject(newProj);
      router.push("/");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between select-none relative font-sans">
      {/* Top Header */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-[#1f1f24]">
        <Link href="/" className="flex items-center space-x-2 text-xs text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to dashboard</span>
        </Link>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-white text-black font-bold flex items-center justify-center text-xs">
            N
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">getNotify</span>
        </div>
      </header>

      {/* Main Center Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-[#111114] border border-[#222227] rounded-2xl shadow-elevated overflow-hidden">
          {/* Card Title Header */}
          <div className="px-8 pt-8 pb-5 border-b border-[#18181c]">
            <h2 className="text-lg font-bold tracking-tight text-white">
              {mode === "select" ? "Choose an environment / project" : "Create a project environment"}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              {mode === "select"
                ? `Environments inside ${activeOrg?.name || "your organization"}.`
                : "Create isolated delivery environments (e.g. Production, Staging)."}
            </p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {mode === "select" ? (
              <div className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {projects.map((proj) => {
                    const isCurrent = activeProject?._id === proj._id;
                    return (
                      <div
                        key={proj._id}
                        onClick={() => handleSelect(proj)}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isCurrent
                            ? "bg-[#18181f] border-neutral-600 shadow-sm"
                            : "bg-[#141418] border-[#222227] hover:border-neutral-700 hover:bg-[#18181d]"
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#1a1a20] border border-[#27272a] flex items-center justify-center text-blue-400 font-bold text-xs shrink-0">
                            <FolderKanban className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-white truncate">{proj.name}</h4>
                            <p className="text-[11px] text-neutral-400 truncate">
                              {proj.description || "Notification environment"}
                            </p>
                          </div>
                        </div>

                        {isCurrent ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <ArrowRight className="w-4 h-4 text-neutral-500" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => setMode("create")}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Create Environment
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Environment Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Production"
                    required
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Live customer transactional emails"
                    className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMode("select")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={loading}
                  >
                    Create Environment
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
