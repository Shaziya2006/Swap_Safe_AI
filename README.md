# SWAPSAFE AI

**Intelligent Procurement. Resilient Supply Chains.**

SWAPSAFE AI is a procurement and supplier-risk intelligence dashboard. It helps a
procurement team compare suppliers, test substitute components, assess supply risks,
make human-approved sourcing decisions, and monitor orders. It is a hackathon prototype
built with React + Vite.

## Features

- **Login and sign-up** with a profile page (demo auth using localStorage)
- **Dashboard** with spend, savings, risk trend, supplier risk and category charts
- **Suppliers** with search, filters, sorting, shortlist, and a detail view with charts
- **Component Analysis** with a substitute-part comparison and an engineering-validation check
- **Risk Assessment** with severity charts, a likelihood vs impact chart, and mitigation tracking
- **Analytics** with region filters, trend charts, and CSV export
- **Approvals** with approve, reject or ask for more info, plus decision history
- **Monitoring** with milestone timelines, delay tracking, and planned vs actual progress
- **Responsive design** for mobile, tablet and desktop

## Tech stack

React 18 · Vite · React Router · Recharts · Lucide React

## Getting started

Requirements: [Node.js](https://nodejs.org) (LTS version)

```bash
git clone https://github.com/Shaziya2006/Swap_Safe_AI.git
cd Swap_Safe_AI
npm install
npm run dev
```

Then open http://localhost:5173

To create a production build:

```bash
npm run build
```

## Demo login

| Field    | Value              |
| -------- | ------------------ |
| Email    | admin@swapsafe.ai  |
| Password | SwapSafe@123       |

You can also create your own account from the login page.

## Project structure

```
src/
├── components/   Sidebar, Header, StatCard, Modal, ChartCard, Badge, Toasts
├── context/      AuthContext (login, profile) and AppContext (approvals, risks, orders)
├── data/         mockData.js (sample suppliers, risks, orders)
├── pages/        Login, Dashboard, Suppliers, ComponentAnalysis, RiskAssessment,
│                 Analytics, Approvals, Monitoring, Profile
├── utils/        helpers.js (formatting, CSV export, colors)
└── index.css     All styles and responsive breakpoints
```

## Customizing the data

All sample data lives in `src/data/mockData.js`. Edit it to change suppliers, risks,
approvals or orders. Amounts are in Indian rupees (₹).

## Important note

All suppliers, prices and figures are **illustrative demo data**. Login and saved state
are stored in the browser's localStorage, so this is **not secure authentication**.
Do not use it for real confidential systems. A production version needs a secure backend
for authentication, data storage and server-side authorization.

## Roadmap

- Connect to a real backend and database
- Secure authentication with hashed passwords and server sessions
- Live supplier and market data feeds
- Persistent audit trail and PDF report export

## Author

Built by [Shaziya](https://github.com/Shaziya2006)