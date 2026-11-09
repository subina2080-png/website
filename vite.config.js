import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

const SITE = 'https://subinaacharya.com.np'
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// At build time: one static, indexable HTML page per article + sitemap.xml
function blogSeo() {
  return {
    name: 'blog-seo',
    apply: 'build',
    closeBundle() {
      const dist = path.resolve('dist')
      const postsDir = path.resolve('src/content/posts')
      const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
      const posts = fs.readdirSync(postsDir).filter((f) => f.endsWith('.json'))
        .map((f) => JSON.parse(fs.readFileSync(path.join(postsDir, f), 'utf8')))
        .sort((a, b) => b.date.localeCompare(a.date))

      for (const p of posts) {
        const url = `${SITE}/blog/${p.id}`
        const img = p.coverImage.startsWith('/') ? SITE + p.coverImage : p.coverImage
        const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, image: img, datePublished: p.date, author: { '@type': 'Person', name: p.author }, mainEntityOfPage: url }
        const head = `<title>${esc(p.title)} | Subina Aacharya</title>\n    <meta name="description" content="${esc(p.excerpt)}" />\n    <link rel="canonical" href="${url}" />\n    <meta property="og:type" content="article" />\n    <meta property="og:title" content="${esc(p.title)}" />\n    <meta property="og:description" content="${esc(p.excerpt)}" />\n    <meta property="og:image" content="${esc(img)}" />\n    <meta property="og:url" content="${url}" />\n    <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`
        let html = template
          .replace(/<title>[\s\S]*?<\/title>/, '')
          .replace(/<meta name="description"[^>]*>/, '')
          .replace(/<link rel="canonical"[^>]*>/, '')
          .replace(/<meta property="og:url"[^>]*>/, '')
          .replace('</head>', `    ${head}\n  </head>`)
          .replace('<div id="root"></div>', `<div id="root"><article style="max-width:720px;margin:0 auto;padding:2rem"><h1>${esc(p.title)}</h1>${p.content}</article></div>`)
        const out = path.join(dist, 'blog', p.id)
        fs.mkdirSync(out, { recursive: true })
        fs.writeFileSync(path.join(out, 'index.html'), html)
      }

      const urls = [`${SITE}/`, ...posts.map((p) => `${SITE}/blog/${p.id}`)]
      const lastmod = (i) => (i === 0 ? posts[0]?.date : posts[i - 1].date)
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u, i) => `  <url><loc>${u}</loc>${lastmod(i) ? `<lastmod>${lastmod(i)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`
      fs.writeFileSync(path.join(dist, 'sitemap.xml'), xml)
    }
  }
}

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    blogSeo(),
    {
      name: 'remove-crossorigin',
      transformIndexHtml(html) {
        return html.replace(/ crossorigin/g, '');
      }
    }
  ],
  server: {
    port: 3000,
    open: true
  }
})