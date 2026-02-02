# Gerundi Site

Minimal static site for Gerundi.

## Local preview

Open `index.html` directly in a browser, or run a simple static server:

```bash
python3 -m http.server 8080
```

## Deploy with Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

To deploy production:

```bash
vercel --prod
```

No build step is required; Vercel will serve the static files as-is.
