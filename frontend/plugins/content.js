// Build-time content for the blog and podcast.
//
// Reads Markdown files from content/blog and content/podcast, turns them into
// HTML with `marked`, and exposes them to the app as `virtual:content`.
// Drafts (draft: true) only appear when running `npm run dev`.
//
// After `vite build` it also writes a real HTML page for every blog/podcast
// route (GitHub Pages has no rewrites, so /blog/my-post needs its own file),
// plus 404.html and sitemap.xml.
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

const SITE_URL = 'https://wheelerfs.com';
const SITE_NAME = 'Wheeler Food Safety';
const VIRTUAL_ID = 'virtual:content';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    else if (value === 'true' || value === 'false') value = value === 'true';
    data[m[1]] = value;
  }
  return { data, body: match[2] };
}

function loadCollection(root, dir, includeDrafts) {
  const full = path.join(root, 'content', dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((file) => {
      const { data, body } = parseFrontmatter(fs.readFileSync(path.join(full, file), 'utf8'));
      const slug = file.replace(/\.md$/, '');
      if (!data.title) throw new Error(`content/${dir}/${file} is missing a title`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date ?? '')))
        throw new Error(`content/${dir}/${file} needs a date like 2026-10-15`);
      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt || '',
        draft: data.draft === true,
        audio: data.audio || '',
        embed: data.embed || '',
        html: marked.parse(body),
      };
    })
    .filter((item) => includeDrafts || !item.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function loadContent(root, includeDrafts) {
  return {
    posts: loadCollection(root, 'blog', includeDrafts),
    episodes: loadCollection(root, 'podcast', includeDrafts),
  };
}

// GitHub Pages serves /blog/post from blog/post/index.html by redirecting to
// /blog/post/, so that's the address search engines should record.
const pageUrl = (route) => SITE_URL + (route === '/' ? '/' : `${route}/`);

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Swap title/description/social tags into the built index.html and put the
// page text inside #root so search engines see it without running JavaScript.
// React replaces the #root contents as soon as the app loads.
function renderPage(template, { route, title, description, body = '', type = 'website' }) {
  const url = pageUrl(route);
  const head = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE_URL}/wheelerfslogo.png" />`,
    `<meta name="twitter:card" content="summary" />`,
  ].join('\n    ');
  return template
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace(/<title>[\s\S]*?<\/title>/, head)
    .replace(/(<div id="root"[^>]*>)(<\/div>)/, `$1${body}$2`);
}

const listHtml = (heading, items, base) =>
  `<h1>${escapeHtml(heading)}</h1>` +
  items
    .map((i) => `<article><h2><a href="${base}/${i.slug}">${escapeHtml(i.title)}</a></h2><p>${escapeHtml(i.excerpt)}</p></article>`)
    .join('');

function prerender(outDir, { posts, episodes }) {
  const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
  const pages = [
    {
      route: '/blog',
      title: `Blog | ${SITE_NAME}`,
      description: 'Food safety validation tips, audit prep, and industry news from Wheeler Food Safety.',
      body: listHtml('Blog', posts, '/blog'),
    },
    ...posts.map((p) => ({
      route: `/blog/${p.slug}`,
      title: `${p.title} | ${SITE_NAME}`,
      description: p.excerpt,
      body: `<article><h1>${escapeHtml(p.title)}</h1>${p.html}</article>`,
      type: 'article',
      lastmod: p.date,
    })),
  ];
  if (episodes.length) {
    pages.push(
      {
        route: '/podcast',
        title: `Podcast | ${SITE_NAME}`,
        description: 'Conversations on food safety, equipment validation, and audit readiness.',
        body: listHtml('Podcast', episodes, '/podcast'),
      },
      ...episodes.map((e) => ({
        route: `/podcast/${e.slug}`,
        title: `${e.title} | ${SITE_NAME} Podcast`,
        description: e.excerpt,
        body: `<article><h1>${escapeHtml(e.title)}</h1>${e.html}</article>`,
        type: 'article',
        lastmod: e.date,
      })),
    );
  }

  for (const page of pages) {
    const dir = path.join(outDir, page.route);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPage(template, page));
  }

  // GitHub Pages serves 404.html for unknown URLs; the app shows its Not Found page.
  fs.writeFileSync(
    path.join(outDir, '404.html'),
    renderPage(template, { route: '/404', title: `Page not found | ${SITE_NAME}`, description: 'Page not found.' }),
  );

  const urls = [{ route: '/' }, ...pages]
    .map((p) => `  <url><loc>${pageUrl(p.route)}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  fs.writeFileSync(
    path.join(outDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}

export default function contentPlugin() {
  let config;
  return {
    name: 'wheelerfs-content',
    configResolved(resolved) {
      config = resolved;
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      const content = loadContent(config.root, config.command === 'serve');
      return `export const posts = ${JSON.stringify(content.posts)};\nexport const episodes = ${JSON.stringify(content.episodes)};\n`;
    },
    configureServer(server) {
      const dir = path.join(config.root, 'content');
      server.watcher.add(dir);
      const reload = (file) => {
        if (!file.startsWith(dir)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', reload);
      server.watcher.on('change', reload);
      server.watcher.on('unlink', reload);
    },
    closeBundle() {
      if (config.command !== 'build' || config.build.ssr) return;
      prerender(path.resolve(config.root, config.build.outDir), loadContent(config.root, false));
    },
  };
}
