"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ─── Auth & user ─────────────────────────────────────── */
  const [user, setUser] = useState(null);          // null = loading
  const [authChecked, setAuthChecked] = useState(false);

  /* ─── Workspace / org / project ───────────────────────── */
  const [orgs, setOrgs] = useState([]);
  const [activeOrg, setActiveOrg] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);

  /* ─── Resources ────────────────────────────────────────── */
  const [notifications, setNotifications] = useState([]);   // sent emails/notifications
  const [apiKeys, setApiKeys] = useState([]);
  const [providers, setProviders] = useState([]);

  /* ─── UI state ─────────────────────────────────────────── */
  const [loading, setLoading] = useState({});     // key → bool
  const [isSendNotifOpen, setIsSendNotifOpen] = useState(false);
  const [isAddProviderOpen, setIsAddProviderOpen] = useState(false);
  const [addProviderEditTarget, setAddProviderEditTarget] = useState(null); // provider obj to edit, or null for add
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isAskAnythingOpen, setIsAskAnythingOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const setLoad = (key, v) => setLoading(p => ({ ...p, [key]: v }));

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  /* ─── ⌘K shortcut ──────────────────────────────────────── */
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(p => !p);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  /* ─── On mount: check auth ─────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.auth.me();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  /* ─── Load orgs when user is set ───────────────────────── */
  useEffect(() => {
    if (!user) { setOrgs([]); setActiveOrg(null); return; }
    (async () => {
      setLoad("orgs", true);
      try {
        const res = await api.orgs.mine();
        const list = res.data || [];
        setOrgs(list);
        if (list.length > 0) setActiveOrg(list[0]);
      } catch (e) { showToast(e.message, "error"); }
      finally { setLoad("orgs", false); }
    })();
  }, [user]);

  /* ─── Load projects when activeOrg changes ─────────────── */
  useEffect(() => {
    if (!activeOrg) { setProjects([]); setActiveProject(null); return; }
    (async () => {
      setLoad("projects", true);
      try {
        const res = await api.projects.byOrg(activeOrg._id);
        const list = res.data || [];
        setProjects(list);
        if (list.length > 0) setActiveProject(list[0]);
        else setActiveProject(null);
      } catch (e) { showToast(e.message, "error"); }
      finally { setLoad("projects", false); }
    })();
  }, [activeOrg]);

  /* ─── Load API keys + providers + dashboard notifications when activeProject changes ─ */
  useEffect(() => {
    if (!activeProject) {
      setApiKeys([]);
      setProviders([]);
      setNotifications([]);
      return;
    }
    (async () => {
      setLoad("keys", true);
      setLoad("providers", true);
      setLoad("notifications", true);
      try {
        const [keysRes, providersRes, dashRes] = await Promise.allSettled([
          api.apiKeys.byProject(activeProject._id),
          api.providers.all({ projectId: activeProject._id }),
          api.dashboard.get(activeProject._id),
        ]);
        if (keysRes.status === "fulfilled") setApiKeys(keysRes.value.data || []);
        if (providersRes.status === "fulfilled") setProviders(providersRes.value.data || []);
        if (dashRes.status === "fulfilled") setNotifications(dashRes.value.data || []);
      } catch (e) { showToast(e.message, "error"); }
      finally {
        setLoad("keys", false);
        setLoad("providers", false);
        setLoad("notifications", false);
      }
    })();
  }, [activeProject]);

  /* ═══ Actions ══════════════════════════════════════════════ */

  /* Auth */
  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    setUser(res.user);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.auth.register(name, email, password);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    await api.auth.logout().catch(() => {});
    setUser(null);
    setOrgs([]);
    setActiveOrg(null);
    setProjects([]);
    setActiveProject(null);
    setApiKeys([]);
    setProviders([]);
    setNotifications([]);
  };

  /* Orgs */
  const createOrg = async (name, description) => {
    const desc = description?.trim() || `${name} workspace`;
    const res = await api.orgs.create(name, desc);
    const newOrg = res.data;
    setOrgs(p => [newOrg, ...p]);
    setActiveOrg(newOrg);
    showToast(`Organization "${name}" created`);
    return newOrg;
  };

  /* Projects */
  const createProject = async (name, description) => {
    if (!activeOrg) throw new Error("Select an organization first");
    const res = await api.projects.create({ name, description, organizationId: activeOrg._id });
    const proj = res.data;
    setProjects(p => [proj, ...p]);
    setActiveProject(proj);
    showToast(`Project "${name}" created`);
    return proj;
  };

  const deleteProject = async (id) => {
    await api.projects.delete(id);
    setProjects(p => p.filter(x => x._id !== id));
    if (activeProject?._id === id) setActiveProject(null);
    showToast("Project deleted");
  };

  /* API Keys */
  const fetchNotifications = useCallback(async (projectId) => {
    const targetId = projectId || activeProject?._id;
    if (!targetId) {
      setNotifications([]);
      return [];
    }
    setLoad("notifications", true);
    try {
      const res = await api.dashboard.get(targetId);
      const list = res.data || [];
      setNotifications(list);
      return list;
    } catch (e) {
      // Avoid popups for expected empty states
      return [];
    } finally {
      setLoad("notifications", false);
    }
  }, [activeProject]);

  const fetchApiKeys = useCallback(async (projectId) => {
    const targetId = projectId || activeProject?._id;
    if (!targetId) {
      setApiKeys([]);
      return [];
    }
    setLoad("keys", true);
    try {
      const res = await api.apiKeys.byProject(targetId);
      const list = res.data || [];
      setApiKeys(list);
      return list;
    } catch (e) {
      showToast(e.message, "error");
      return [];
    } finally {
      setLoad("keys", false);
    }
  }, [activeProject, showToast]);

  const createApiKey = async (name) => {
    if (!activeProject) throw new Error("Select a project first");
    const res = await api.apiKeys.create(name, activeProject._id);
    if (res.data?.rawKey && typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("gn_raw_keys") || "{}");
        stored[activeProject._id] = res.data.rawKey;
        stored[res.data._id] = res.data.rawKey;
        localStorage.setItem("gn_raw_keys", JSON.stringify(stored));
      } catch (_) {}
    }
    setApiKeys(p => [res.data, ...p]);
    showToast(`API key "${name}" created`);
    return res.data;
  };

  /* Providers */
  const createProvider = async (data) => {
    const res = await api.providers.create({ ...data, projectId: activeProject?._id });
    setProviders(p => [res.data, ...p]);
    showToast(`Provider "${data.provider}" added`);
    return res.data;
  };

  const setDefaultProvider = async (id) => {
    const res = await api.providers.setDefault(id);
    setProviders(p => p.map(x => ({ ...x, isDefault: x._id === id })));
    showToast("Default provider updated");
    return res.data;
  };

  const updateProvider = async (id, data) => {
    const res = await api.providers.update(id, data);
    setProviders(p => p.map(x => (x._id === id ? res.data : x)));
    showToast("Provider updated");
    return res.data;
  };

  const deleteProvider = async (id) => {
    await api.providers.delete(id);
    setProviders(p => p.filter(x => x._id !== id));
    showToast("Provider removed");
  };

  /* Send notification/email */
  const sendNotification = async ({ recipientId, to, title, body, channel = "email" }) => {
    if (!activeProject) throw new Error("Select a project first");
    const res = await api.notifications.send({
      projectId: activeProject._id,
      recipientId,
      to,
      title,
      body,
      channel,
    });
    showToast(channel === "email" ? `Email sent to ${to || recipientId}` : "Notification sent");
    // Refresh notifications list to immediately reflect the new notification
    fetchNotifications(activeProject._id);
    return res.data;
  };

  return (
    <AppContext.Provider value={{
      /* Auth */
      user, authChecked, login, register, logout,
      /* Workspace */
      orgs, activeOrg, setActiveOrg: (org) => setActiveOrg(org),
      projects, activeProject, setActiveProject: (p) => setActiveProject(p),
      createOrg, createProject, deleteProject,
      /* Resources */
      apiKeys, createApiKey, fetchApiKeys,
      providers, createProvider, updateProvider, setDefaultProvider, deleteProvider,
      notifications, setNotifications, fetchNotifications,
      sendNotification,
      /* UI */
      loading,
      isSendNotifOpen, setIsSendNotifOpen,
      isAddProviderOpen, setIsAddProviderOpen,
      addProviderEditTarget, setAddProviderEditTarget,
      isCodeModalOpen, setIsCodeModalOpen,
      isAskAnythingOpen, setIsAskAnythingOpen,
      isSearchOpen, setIsSearchOpen,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
