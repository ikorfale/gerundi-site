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

## Blog workflow

Blog posts live in `posts/` as simple HTML files. Update the homepage section and
`posts/index.html` whenever you publish a new entry.

### Quick add script

```bash
./scripts/new-post.sh "Post title"
```

The script generates a new HTML file (dated filename) and reminds you to link it
from the homepage and the blog index.
