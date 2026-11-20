# GetNotify Frontend

Full-fledged, modern Next.js frontend built in JavaScript for the **GetNotify** notification & email delivery service. Designed with pixel-perfect accuracy referencing the provided Resend and Novu-style screenshots.

## Features

- **Emails Dashboard (`/`)**:
  - Exact match of the dark-mode Resend aesthetic from Screenshots 1 & 2.
  - Metallic 3D chevron logo badge in the empty state with radial glow backdrop.
  - "Sending" and "Receiving" tabs.
  - Interactive Filter Bar: Search, "Last 15 days", "All Statuses", "All API keys", and CSV export.
  - "Suppressions" modal to manage blocked/bounced addresses.
  - `</>` Code drawer with ready-to-copy Node.js SDK, Next.js, cURL, and Python snippets.
  - "Send Email" composer with live HTML editor and rendered preview.
  - Toggle between the pixel-perfect Screenshot Empty State and the Live Sent Feed.

- **Workflows & Automations (`/automations`)**:
  - Exact match of the Novu-style workflows dashboard from Screenshot 3.
  - Filter chips: `+ Search`, `+ Tags`, `+ Status`.
  - "Start with" template cards: Welcome Sequence, Password Reset, Re-engagement, Weekly Digest.
  - Product domain suggestions banner.
  - Interactive Workflows Table with step icon badges, active status toggles, tags, and "Create Workflow" modal.

- **Profile & Settings (`/settings`)**:
  - Exact match of the Profile & Authentication view from Screenshot 4.
  - "General" and "Authentication" tabs.
  - Multi-factor authentication (MFA) with QR setup modal.
  - Sign-in providers: Google connected (`vikasbaboria4@gmail.com`) on Mar 08, 2026, and interactive GitHub connect.
  - "OAuth apps" empty state card.

- **Templates Gallery (`/templates`)**:
  - Responsive email template editor with syntax highlighting and live rendered preview.
  - Dynamic mustache tags (`{{name}}`, `{{company_name}}`, `{{order_id}}`).

- **Audience (`/audience`)**:
  - Contact management, subscription statuses, subscriber tags, CSV export.

- **Inboxes (`/inboxes`)**:
  - Inbound email routing, MX configuration guide (`10 inbound.getnotify.io`), and incoming mail reader.

- **Broadcasts (`/broadcasts`)**:
  - Campaign creation, audience targeting, open/click rate analytics.

- **Metrics & Analytics (`/metrics`)**:
  - Deliverability rate (99.4%), unique opens (54.2%), CTR (18.6%), bounce rate (0.4%).
  - Responsive daily volume distribution bar chart with hover tooltips.

- **Domains & DNS (`/domains`)**:
  - Custom domain verification with copyable SPF, DKIM, DMARC, and MX records.

- **Audit Logs (`/logs`)**:
  - Real-time event log with latency meters and HTTP response codes.

- **API Keys (`/api-keys`)**:
  - Key generator with custom permissions (Full Access, Sending Only, Read Only), copy to clipboard, and instant revoke.

- **Webhooks (`/webhooks`)**:
  - Endpoint management with signing secrets, delivery counters, and simulated ping testing.

- **Global Quick Search (`⌘ K`) & AI Assistant (`+ Ask anything`)**:
  - Press `⌘ K` or `Ctrl + K` anywhere to jump between views.
  - Click `+ Ask anything` at the bottom right to query the GetNotify AI helper.
  - Click `/docs` at the bottom left for documentation and API endpoints.

## Getting Started

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (already installed)
npm install

# Run the development server
npm run dev

# Or build and run production server
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.
