"use client";

import React from "react";
import { CreditCard, Check, Sparkles, ArrowUpRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button, Badge, Card } from "../../components/ui";

export default function BillingPage() {
  const { showToast } = useApp();

  const plans = [
    {
      name: "Developer",
      price: "$0",
      period: "forever free",
      current: true,
      features: [
        "10,000 notifications / mo",
        "Email & In-App channels",
        "2 active providers",
        "3 days event log retention",
        "Community support",
      ],
    },
    {
      name: "Startup",
      price: "$29",
      period: "per month",
      current: false,
      features: [
        "100,000 notifications / mo",
        "Unlimited providers",
        "Workflows & Automations",
        "30 days event log retention",
        "Dedicated webhook endpoints",
      ],
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "per month",
      current: false,
      features: [
        "Unlimited notifications",
        "Custom SLAs & 99.99% uptime",
        "Multi-region failover",
        "Custom IP whitelisting",
        "24/7 Priority support",
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-8 max-w-[1300px] w-full mx-auto space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1f1f24]">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">Billing & Plans</h1>
            <Badge variant="purple">Developer Plan</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your subscription tier, billing contact, and quotas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={`p-6 flex flex-col justify-between ${
              p.current ? "border-neutral-500 shadow-md" : ""
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-white">{p.name}</h3>
                {p.current && <Badge variant="info">Active Plan</Badge>}
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-white font-mono">{p.price}</span>
                <span className="text-xs text-neutral-400 ml-1.5 font-sans">/{p.period}</span>
              </div>

              <div className="space-y-2.5 py-4 border-t border-[#1f1f24]">
                {p.features.map((feat) => (
                  <div key={feat} className="flex items-center space-x-2 text-xs text-neutral-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#1f1f24]">
              <Button
                variant={p.current ? "secondary" : "primary"}
                size="md"
                className="w-full"
                onClick={() => showToast(p.current ? "Current active plan" : `Select ${p.name}`)}
              >
                {p.current ? "Current Plan" : "Upgrade Plan"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
