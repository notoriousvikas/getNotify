// API client — all requests go through the configurable Next.js rewrite proxy.
// This eliminates CORS entirely since browser sees same-origin requests.

const BASE = "";

async function req(url, opts = {}) {
  const res = await fetch(BASE + url, {
    headers: { "Content-Type": "application/json", ...opts.headers },
    credentials: "include",
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  health: () => req("/health"),

  auth: {
    login:    (email, password) => req("/api/v1/users/login",    { method: "POST", body: JSON.stringify({ email, password }) }),
    register: (name, email, password) => req("/api/v1/users/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
    me:       () => req("/api/v1/users/me"),
    signOut:  () => req("/api/v1/users/signout", { method: "POST" }),
    logout:   () => req("/api/v1/users/logout",  { method: "POST" }),
  },

  orgs: {
    mine:     () => req("/api/v1/organizations/user"),
    get:      (id) => req(`/api/v1/organizations/${id}`),
    create:   (name, description) => req("/api/v1/organizations", { method: "POST", body: JSON.stringify({ name, description }) }),
    update:   (id, data) => req(`/api/v1/organizations/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  },

  projects: {
    byOrg:  (orgId) => req(`/api/v1/projects/organization/${orgId}`),
    get:    (id) => req(`/api/v1/projects/${id}`),
    create: (data) => req("/api/v1/projects", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => req(`/api/v1/projects/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id) => req(`/api/v1/projects/${id}`, { method: "DELETE" }),
  },

  apiKeys: {
    byProject: (projectId) => req(`/api/v1/api-keys/project/${projectId}`),
    create:    (name, projectId) => req("/api/v1/api-keys", { method: "POST", body: JSON.stringify({ name, projectId }) }),
  },

  providers: {
    all:        (params = {}) => req(`/api/v1/providers${Object.keys(params).length ? "?" + new URLSearchParams(params) : ""}`),
    get:        (id) => req(`/api/v1/providers/${id}`),
    create:     (data) => req("/api/v1/providers", { method: "POST", body: JSON.stringify(data) }),
    update:     (id, data) => req(`/api/v1/providers/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    setDefault: (id) => req(`/api/v1/providers/${id}/set-default`, { method: "PATCH" }),
    delete:     (id) => req(`/api/v1/providers/${id}`, { method: "DELETE" }),
  },

  dashboard: {
    get: (projectId, params = {}) => {
      const q = Object.keys(params).length ? "?" + new URLSearchParams(params) : "";
      return req(`/api/v1/dashboard/${encodeURIComponent(projectId)}${q}`);
    },
  },

  notifications: {
    send: (data) => req("/api/v1/notifications", { method: "POST", body: JSON.stringify(data) }),
  },

  inbox: {
    all:          (apiKey, recipientId) => {
      const q = recipientId ? `?recipientId=${encodeURIComponent(recipientId)}` : "";
      return req(`/api/v1/inbox${q}`, {
        headers: apiKey ? { "x-api-key": apiKey } : {},
      });
    },
    markRead:     (nId, apiKey) =>
      req(`/api/v1/inbox/${encodeURIComponent(nId)}/read`, {
        method: "PATCH",
        headers: apiKey ? { "x-api-key": apiKey } : {},
      }),
    delete:       (nId, apiKey) =>
      req(`/api/v1/inbox/${encodeURIComponent(nId)}`, {
        method: "DELETE",
        headers: apiKey ? { "x-api-key": apiKey } : {},
      }),
    unreadCount:  (apiKey, recipientId) => {
      const q = recipientId ? `?recipientId=${encodeURIComponent(recipientId)}` : "";
      return req(`/api/v1/inbox/unread/count${q}`, {
        headers: apiKey ? { "x-api-key": apiKey } : {},
      });
    },
  },
};
