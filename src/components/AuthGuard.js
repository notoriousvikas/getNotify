"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import Sidebar from "./Sidebar";
import FooterBar from "./FooterBar";
import SendEmailModal from "./SendEmailModal";
import CodeModal from "./CodeModal";
import AskAnythingModal from "./AskAnythingModal";
import QuickSearchModal from "./QuickSearchModal";
import NotificationToast from "./NotificationToast";
import LandingPage from "./LandingPage";
import AddProviderDrawer from "./AddProviderDrawer";

export default function AuthGuard({ children }) {
  const { user, authChecked } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isLandingPage = pathname === "/";
  const isExplicitLanding = pathname === "/landing";
  const isDocsPage = pathname === "/docs" || pathname?.startsWith("/docs/");

  useEffect(() => {
    if (!authChecked) return;
    // If logged in and on login page → go to dashboard
    if (user && isLoginPage) {
      router.replace("/");
    }
  }, [authChecked, user, isLoginPage, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Explicit landing page (can be visited by both unauthenticated and authenticated users)
  if (isExplicitLanding) {
    return (
      <div className="fixed inset-0 overflow-y-auto bg-[#09090b]">
        <LandingPage />
        <NotificationToast />
      </div>
    );
  }

  // On login page
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <main className="flex-1 overflow-y-auto bg-black flex flex-col relative">
          {children}
        </main>
        <NotificationToast />
      </div>
    );
  }

  // Not authenticated: public routes vs protected routes
  if (!user) {
    // Landing page for root "/"
    if (isLandingPage) {
      return (
        <div className="fixed inset-0 overflow-y-auto bg-[#09090b]">
          <LandingPage />
          <NotificationToast />
        </div>
      );
    }

    // Public Documentation page: Accessible to everyone (authed or not)
    if (isDocsPage) {
      return (
        <div className="fixed inset-0 overflow-y-auto bg-[#09090b]">
          {children}
          <NotificationToast />
        </div>
      );
    }

    // Protected route — redirect to login
    if (typeof window !== "undefined") router.replace("/login");
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated: full dashboard
  return (
    <>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-black flex flex-col relative">
          {children}
        </main>
      </div>
      <FooterBar />
      <SendEmailModal />
      <AddProviderDrawer />
      <CodeModal />
      <AskAnythingModal />
      <QuickSearchModal />
      <NotificationToast />
    </>
  );
}
