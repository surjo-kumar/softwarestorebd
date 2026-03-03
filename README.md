# Digital Tools Marketplace - React + Vite Migration

This project has been migrated from Next.js to a pure React application using Vite.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Variables:
   Create a `.env` file in the root directory. You must use `VITE_` prefix instead of `NEXT_PUBLIC_`.
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Development

Run the local development server:
```bash
npm run dev
```
Access at `http://localhost:5173`.

## Build

Build for production:
```bash
npm run build
```
This generates a static `/dist` folder containing the compiled HTML, CSS, and JS.

## Deployment

Upload the contents of the `/dist` folder to any static hosting provider (Hostinger, Netlify, Vercel, S3, etc.).

**Important:** Ensure your hosting provider is configured for Client-Side Routing (SPA).
This means all requests to non-existent files should rewrite to `index.html`.
- **Hostinger/Apache:** Use `.htaccess`.
- **Netlify:** Use `_redirects`.
- **Vercel:** Auto-configured.
