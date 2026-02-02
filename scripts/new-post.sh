#!/usr/bin/env bash
set -euo pipefail

TITLE="${1:-}"
DATE_INPUT="${2:-$(date +%Y-%m-%d)}"
DISPLAY_DATE="${3:-$(date "+%B %d, %Y")}" 

if [ -z "$TITLE" ]; then
  read -r -p "Post title: " TITLE
fi

SLUG=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')
FILE="posts/${DATE_INPUT}-${SLUG}.html"

if [ -e "$FILE" ]; then
  echo "Post already exists: $FILE"
  exit 1
fi

cat > "$FILE" <<EOF
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${TITLE}</title>
    <meta name="description" content="${TITLE}" />
    <link rel="stylesheet" href="../styles.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <header class="site-header">
      <div class="container">
        <div class="logo">Gerundi</div>
        <nav class="nav">
          <a href="../index.html">Home</a>
          <a href="index.html">Blog</a>
        </nav>
      </div>
    </header>

    <main class="post-shell">
      <div class="container">
        <header class="post-header">
          <p class="post-meta">${DISPLAY_DATE} · Research Log</p>
          <h1>${TITLE}</h1>
        </header>

        <div class="post-content">
          <p>Write the post content here.</p>
        </div>

        <div class="post-footer">
          <a class="text-link" href="index.html">Back to all posts</a>
          <a class="text-link" href="../index.html#blog">Return to homepage</a>
        </div>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container">
        <p>© 2026 Gerundi. Built with clarity and intent.</p>
      </div>
    </footer>
  </body>
</html>
EOF

echo "Created $FILE"
echo "Remember to link it from posts/index.html and the homepage blog section."
