/* ----------------------------------------------------------------------------
 * Turn the single-page app into four static pages.
 *
 * Runs after both vite builds: it renders each route with React on the server,
 * drops the markup into the built index.html, writes that page's own title,
 * description, social card and structured data, and emits a sitemap.
 *
 *   dist/index.html
 *   dist/homes/<id>.html
 *   dist/sitemap.xml
 * -------------------------------------------------------------------------- */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { pathToFileURL } from 'url'

const DIST = 'dist'
const server = await import(pathToFileURL(join(process.cwd(), DIST, 'server/entry-server.js')).href)
const { render, routes, routeFor, PROPERTIES, seoFor, jsonLdFor, SITE } = server

const template = readFileSync(join(DIST, 'index.html'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function head(seo, jsonLd) {
  return `    <title>${esc(seo.title)}</title>
    <meta name="description" content="${esc(seo.description)}" />
    <link rel="canonical" href="${seo.canonical}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Roam in Heels" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="${esc(seo.title)}" />
    <meta property="og:description" content="${esc(seo.description)}" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta property="og:image" content="${SITE}${seo.ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(seo.title)}" />
    <meta name="twitter:description" content="${esc(seo.description)}" />
    <meta name="twitter:image" content="${SITE}${seo.ogImage}" />
    <script type="application/ld+json">${jsonLd}</script>`
}

const pages = []
for (const path of routes()) {
  const route = routeFor(path)
  const seo = seoFor(route)
  const markup = render(path)

  const html = template
    // The template's own title and description are replaced by this page's.
    .replace(/\n\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\n\s*<meta name="description"[^>]*>/, '')
    .replace('<html lang="en">', '<html lang="en-IN">')
    .replace('</head>', head(seo, jsonLdFor(route, PROPERTIES)) + '\n  </head>')
    .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)

  const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`
  mkdirSync(dirname(join(DIST, file)), { recursive: true })
  writeFileSync(join(DIST, file), html)
  pages.push({ path, file, bytes: html.length })
}

const today = new Date().toISOString().slice(0, 10)
writeFileSync(join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes().map((p) => `  <url>
    <loc>${SITE}${p === '/' ? '/' : p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${p === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`)

for (const p of pages) console.log(`prerendered ${p.path.padEnd(22)} → ${p.file.padEnd(26)} ${(p.bytes / 1024).toFixed(1)} kB`)
console.log(`sitemap      ${routes().length} urls`)
