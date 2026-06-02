# Lidia Daneshvar — Portfolio

Personal site. Three files, no framework, no build step.

## Files

- `index.html` — markup and content
- `styles.css` — design tokens, layout, typography
- `script.js` — mobile nav, email obfuscation, contact form mailto

## Local preview

Open `index.html` in any browser. No server or build step required.

For a local server (recommended so font-loading and fetch behave normally), Python's built-in works:

```
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Editing content

All copy is in `index.html`. Look for these conventions:

- **Selected work entries** are scaffold placeholders. Replace `[ bracketed ]` text with real project content. Add or remove `<li class="work__entry">` blocks to change the count.
- **Experience entries** are populated. Edit the `<li class="timeline__role">` blocks directly.
- **Contact** form uses a `mailto:` link assembled from the `data-user` and `data-domain` attributes on the form. To change the destination email, update those attributes (and the matching ones on the `.email-link` anchors).
- **Resume** request link is in the header nav. Update the `mailto:` href and the `data-*` attributes.

## Deployment

This is plain static HTML. It works on anything:

- **Vercel**: `vercel deploy` from this directory, or drag-drop on the Vercel dashboard.
- **Netlify**: drag-drop the folder onto netlify.com/drop.
- **GitHub Pages**: push to a repo, enable Pages, choose the branch.
- **Any static host**: upload the three files.

No environment variables, no secrets, nothing to configure.

## Design notes

- **Fonts**: Fraunces (display) + Inter (body), loaded from Google Fonts with `font-display: swap`.
- **Palette**: warm bone background, deep warm ink, terracotta accent. Defined as OKLCH tokens at the top of `styles.css`.
- **No tracking, no analytics, no third-party scripts** other than the Google Fonts stylesheet.
