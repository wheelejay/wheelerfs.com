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
4. Preview it with `npm run dev`, then publish with `npm run deploy`.

Images: put them in `public/` (e.g. `public/blog/audit.jpg`) and reference
them as `![Description](/blog/audit.jpg)`.

## Podcast episodes

Same as posts, using `podcast/_template.md`. Episodes also take either:

- `embed`: the player URL from your podcast host's embed code (Spotify for
  Creators, Buzzsprout, YouTube, and others), or
- `audio`: a direct link to an MP3 file.

The Podcast page and nav link only appear once at least one episode is
published, so nothing shows until you're ready.

## What the build does

`npm run build` (and therefore `npm run deploy`) creates a real HTML page for
every published post and episode, with its own title, description, and link
preview tags. It also writes `sitemap.xml`, `robots.txt`, and `404.html`.
Submit `https://wheelerfs.com/sitemap.xml` in Google Search Console once the
first post is live.
