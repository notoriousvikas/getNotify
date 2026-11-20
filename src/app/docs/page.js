"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Terminal, Copy, Check, ExternalLink, Code2, Sparkles, BookOpen } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card } from "../../components/ui";

export default function DocsPage() {
  const { showToast } = useApp();
  const [copiedSnippet, setCopiedSnippet] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    showToast("Code snippet copied");
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const nodeSnippet = `import { GetNotify } from '@getnotify/sdk';

const notify = new GetNotify({ apiKey: process.env.GETNOTIFY_API_KEY });

await notify.send({
  recipientId: 'usr_1001',
  to: 'alex@example.com',
  channel: 'email',
  title: 'Order Confirmation #9401',
  body: '<h1>Thanks for your purchase!</h1><p>Your items are on the way.</p>',
});`;

  const curlSnippet = `curl -X POST https://api.getnotify.dev/api/v1/notifications \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: gn_live_••••••••" \\
  -d '{
    "projectId": "proj_123",
    "recipientId": "usr_1001",
    "to": "alex@example.com",
    "channel": "email",
    "title": "Welcome to getNotify",
    "body": "<p>Hello from API</p>"
  }'`;

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1100px] w-full mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Developer Documentation</h1>
            <Badge variant="info">REST & SDK v1.0</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Quick start integration guides, SDK libraries, and API reference.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Node SDK Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold">
                JS
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Node.js / TypeScript SDK</h3>
                <p className="text-[11px] text-neutral-400">Install and trigger emails with 3 lines of code</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(nodeSnippet, "node")}
            >
              {copiedSnippet === "node" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="ml-1.5">Copy Code</span>
            </Button>
          </div>

          <div className="p-3 bg-[#18181b] rounded-lg border border-[#27272a] text-xs font-mono text-neutral-300 mb-3 select-all">
            npm install @getnotify/sdk
          </div>

          <pre className="p-4 bg-[#09090b] border border-[#222227] rounded-lg text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
            {nodeSnippet}
          </pre>
        </Card>

        {/* REST API Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-xs font-bold">
                API
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">cURL / REST API</h3>
                <p className="text-[11px] text-neutral-400">Direct HTTP endpoint invocation</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(curlSnippet, "curl")}
            >
              {copiedSnippet === "curl" ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span className="ml-1.5">Copy cURL</span>
            </Button>
          </div>

          <pre className="p-4 bg-[#09090b] border border-[#222227] rounded-lg text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
            {curlSnippet}
          </pre>
        </Card>
      </div>
    </div>
  );
}
