# ArtheHeart Portfolio (React)

The portfolio now runs as a React single-page application built with Vite. Its existing cozy ArtheHeart appearance, light/night themes, content, responsive navigation, escape-room game, media searches, recommendations, and leaderboard have been retained.

## Run locally

1. Install [Node.js](https://nodejs.org/) 20 or newer.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local address printed by Vite.

Use `npm run check` for ESLint and `npm run build` for the production build. `npm run preview` previews the completed build.

## Supabase configuration

Copy `.env.example` to `.env`, then replace the placeholders:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_BROWSER_SAFE_ANON_KEY
```

Only use the browser-safe anon/publishable key. Never put the Supabase `service_role` key in this project. Without configuration, the UI shows the clearly labeled local development fallback and does not crash.

## GitHub Pages

The included workflow builds and deploys the `dist` folder whenever `main` or `master` is pushed. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.

The old static HTML and JavaScript files remain under `file/` as a reference, but the live entry point is now `src/main.jsx`. The established stylesheet remains in `file/CSS/cozy_portfolio.css` so the visual design is preserved while the page behavior is handled by React.
