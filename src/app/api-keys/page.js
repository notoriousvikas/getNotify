"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Building2,
  FolderGit2,
  ChevronDown,
  Info,
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card, EmptyState } from "../../components/ui";

export default function ApiKeysPage() {
  const {
    apiKeys,
    createApiKey,
    fetchApiKeys,
    activeOrg,
    projects,
    activeProject,
    setActiveProject,
    createProject,
    loading,
    showToast,
  } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [createProjModalOpen, setCreateProjModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [revealedRaw, setRevealedRaw] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    if (!activeProject) {
      showToast("Select a project first", "error");
      return;
    }
    setCreating(true);
    try {
      const created = await createApiKey(newKeyName.trim());
      setModalOpen(false);
      setNewKeyName("");
      if (created?.rawKey) {
        setRevealedRaw({ id: created._id, rawKey: created.rawKey });
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    setCreating(true);
    try {
      await createProject(newProjName.trim(), newProjDesc.trim());
      setNewProjName("");
      setNewProjDesc("");
      setCreateProjModalOpen(false);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">API Keys</h1>
            <Badge variant="neutral">{apiKeys.length} active</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Authenticate SDK and REST requests for{" "}
            <span className="text-neutral-200 font-medium">{activeProject?.name || "your project"}</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchApiKeys()}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-neutral-400" />
            <span>Refresh</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            disabled={!activeProject}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Create Secret Key</span>
          </Button>
        </div>
      </div>

      {/* Warning banner if secret revealed */}
      {revealedRaw && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-white">Save your secret key now</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                For security reasons, this key will never be displayed in full again.
              </div>
              <div className="mt-2 font-mono text-xs bg-black/50 px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-200 select-all">
                {revealedRaw.rawKey}
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => copy(revealedRaw.rawKey, "revealed")}
          >
            {copiedId === "revealed" ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 mr-1.5" />
            )}
            Copy Secret
          </Button>
        </div>
      )}

      {/* Keys Table Card */}
      <Card>
        {apiKeys.length === 0 ? (
          <EmptyState
            icon={KeyRound}
            title="No API keys configured"
            description="Create an API key to send notifications via the SDK or backend API."
            action={
              <Button
                variant="primary"
                size="sm"
                onClick={() => setModalOpen(true)}
                disabled={!activeProject}
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Generate Key
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1f1f24] text-neutral-400 bg-[#141418]">
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium">Key Prefix</th>
                  <th className="py-3 px-4 text-left font-medium">Scopes</th>
                  <th className="py-3 px-4 text-left font-medium">Created</th>
                  <th className="py-3 px-4 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18181b]">
                {apiKeys.map((k) => (
                  <tr key={k._id} className="hover:bg-[#141418] transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white flex items-center space-x-2">
                      <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{k.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-300">
                      {k.prefix || "gn_live_••••"}••••••••••••
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral">all:read_write</Badge>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 font-mono text-[11px]">
                      {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "Active"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copy(k.prefix || k._id, k._id)}
                      >
                        {copiedId === k._id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="ml-1.5">Copy ID</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Key Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#111114] border border-[#222227] rounded-xl p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-base font-semibold text-white">Create Secret Key</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Enter a descriptive name to identify which service uses this key.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Key Name *
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Backend Production Worker"
                  required
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={creating}
                >
                  Generate Key
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
