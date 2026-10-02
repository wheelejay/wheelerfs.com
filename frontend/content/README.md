# Blog & podcast content

Each Markdown file in `blog/` is a post, and each one in `podcast/` is an episode.
The file name becomes the URL: `blog/metal-detector-audit-prep.md` is published
at `wheelerfs.com/blog/metal-detector-audit-prep`.

## Writing a post

1. Copy `blog/_template.md` to a new file, e.g. `blog/metal-detector-audit-prep.md`.
2. Fill in the header between the `---` lines:
   - `title`: shown on the page and in the browser tab
   - `date`: `YYYY-MM-DD`; newest posts are listed first
   - `excerpt`: shown on the blog list and in Google and social media previews
   - `draft`: `true` hides the post on the live site (it still shows when you
     run `npm run dev`, marked "Draft"). Change it to `false` to publish.
3. Write the post in Markdown below the header.
4. Commit it to `main`. The site rebuilds and publishes itself within a few
   minutes (watch progress on the repo's **Actions** tab).

You can do all of this on github.com: open `frontend/content/blog`, click
**Add file → Create new file**, paste in the template, and commit.

Images: upload them to `frontend/public/blog/` (e.g. `audit.jpg`) and reference
them as `![Description](/blog/audit.jpg)`.

## Podcast episodes

Same as posts, using `podcast/_template.md`. Episodes also take either:

- `embed`: the player URL from your podcast host's embed code (Spotify for
  Creators, Buzzsprout, YouTube, and others), or
- `audio`: a direct link to an MP3 file.

The Podcast page and nav link only appear once at least one episode is
published, so nothing shows until you're ready.

## What the build does

The build (run automatically by `.github/workflows/deploy.yml`) creates a real HTML page for
every published post and episode, with its own title, description, and link
preview tags. It also writes `sitemap.xml`, `robots.txt`, and `404.html`.
Submit `https://wheelerfs.com/sitemap.xml` in Google Search Console once the
first post is live.

## Service pages

Each file in `services/` is a service page at `wheelerfs.com/services/<file-name>`
(for example `services/magnet-validation.md`). Edit them the same way as blog
posts. The header fields are:

- `title`: the page heading
- `seoTitle`: the title shown in Google results and the browser tab
- `excerpt`: the intro sentence and Google description
- `icon`: the icon image (in `public/icons/`)
- `price` and `priceNote`: shown in the price box at the top
- `order`: the order in the footer's Services list

If you change a price, also update the pricing cards on the homepage
(`src/pages/Home.jsx`) and your Google Business Profile so they match.
