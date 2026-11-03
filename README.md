# SWAPSAFE AI

Procurement and supplier-risk intelligence dashboard (React + Vite hackathon prototype).

## Run it
```bash
npm install
npm run dev      # opens http://localhost:5173
npm run build    # production build in /dist
```

## Demo login
- Email: admin@swapsafe.ai
- Password: SwapSafe@123

You can also create your own account on the login page. Everything is stored in your browser's
localStorage. This is demo auth only and is NOT secure. Replace it with a real backend before production.

## Pages
Login / Create account · Dashboard · Suppliers · Component Analysis · Risk Assessment ·
Analytics · Approvals · Monitoring · Profile

## Where things live
- `src/data/mockData.js` – all sample data (edit this to change suppliers, risks, orders)
- `src/context/AuthContext.jsx` – login, sign-up, profile, password
- `src/context/AppContext.jsx` – approvals, risks, orders, toasts, activity (saved in localStorage)
- `src/index.css` – all styling, including the responsive breakpoints
