# shaon.archive: Portfolio Website

A dark, cinematic single-page portfolio for shaon (artist, creative director, photographer). Plain HTML, CSS and JavaScript, no build step. The photo gallery is content-managed, so shaon can add, edit and remove photos directly on the live site, without touching code. Setup instructions for connecting this to GitHub and Netlify were given separately in chat. `ADDING-PHOTOS.md` here is for shaon.

## What's on the site

- **Hero**: name, role, and a way in to WasteTV or straight to contact
- **WasteTV**: heavily featured, with its own bold striped design treatment: the launch poster, the launch promo film, and two more episodes ("85mm: On a Saturday" and "After Hours")
- **Film**: three more videos: the "Questions" concept film, "A Windy Day in Brighton" (VHS style), and a short clip filmed at a gallery. Each loads and plays only once you scroll to it, so the page stays fast
- **Selected Work**: a 31-photo gallery with category filters (All, Street, Coast, Portraits, Black & White, Design) and a click-to-enlarge lightbox (arrow keys / swipe through). This is the part shaon can edit directly, see below
- **About**: a short bio
- **Contact**: Instagram and email, as two clear buttons

## Files in this folder

- `index.html`: the page structure and all text content
- `style.css`: all the styling (colours, layout, fonts)
- `script.js`: loads the gallery, the lightbox, scroll-reveal animation, gallery filter, and lazy video loading
- `content/gallery.json`: the actual list of gallery photos (image, title, description, categories). This is what shaon's content manager edits, and what `script.js` reads to build the grid. You can also hand-edit it directly, it's plain JSON
- `admin/`: the content manager shaon uses to edit `content/gallery.json` visually, see the setup instructions Claude gave you separately in chat
- `images/`: the photos, already resized and compressed for the web
- `video/`: seven films, each compressed for the web:
  - `wastetv-promo.mp4`: WasteTV launch promo (~30MB)
  - `wastetv-saturday.mp4`: "85mm: On a Saturday" (~25MB)
  - `kaleidoscope.mp4`: "After Hours" (~17MB)
  - `reel.mp4`: "Questions" (~17MB)
  - `windy-day.mp4`: "A Windy Day in Brighton" (~28MB)
  - `exhibition.mp4`: "A Day at the Gallery" (~1MB)

## Getting shaon set up to add their own photos

This is the main thing to do before handing the site over. It's a one-time, roughly 20 to 30 minute setup: get this folder onto GitHub, connect your existing Netlify site to that repo, then turn on two free Netlify features (Identity and Git Gateway) so shaon gets a login and a visual editor at `/admin`, no code on their end. Full step-by-step instructions for this were given in chat, not bundled as a file here. Once that's done, hand shaon the **`ADDING-PHOTOS.md`** file, it's written directly for them.

## Preview it locally

1. Open this whole folder in VS Code (`File > Open Folder…`).
2. Install the **Live Server** extension (search for it in the Extensions panel, the puzzle-piece icon on the left sidebar, by Ritwick Dey).
3. Right-click `index.html` in the file list and choose **"Open with Live Server"**.
4. Your browser opens automatically at something like `http://127.0.0.1:5500`, that's your site, running live. Any time you save a change, it refreshes automatically.

Double-clicking `index.html` to open it directly (without Live Server or another local web server) will show a page with no photos in it. That's because the gallery loads its data with a `fetch()` call, and browsers block that when a page is opened straight from disk. Always preview through Live Server or a real deployment.

## Making changes

- **Add, edit or remove gallery photos**: once the GitHub/Netlify setup (given in chat) is done, do this through `/admin` on the live site (or ask shaon to). To do it by hand instead, edit `content/gallery.json` directly, it's a plain list, each photo is one `{ ... }` entry with an image path, a title, a description, categories, and two on/off switches for "extra wide" and "black & white."
- **Swap a film**: replace the matching file in `video/` (keep the same filename, or update the `data-src` on its `.lazy-video` wrapper in `index.html`). Keep new clips under ~30MB so they still load reasonably fast, see the export note below.
- **Add another film**: copy one of the `.lazy-video` blocks in the Film or WasteTV section, give it a new `data-src`, and add a matching poster image.
- **Edit text**: the hero title, role line, tagline, film captions, About paragraph and Contact copy are all plain text in `index.html`, just type over them.
- **Change the Instagram link or email**: search `index.html` for `instagram.com/shaon.archive` or `muttasimshaon@gmail.com` and replace.
- **Change colours**: open `style.css` and edit the values at the very top under `:root` (e.g. `--bg`, `--text`, `--accent`).

## Exporting a new film cut for the web

If you swap in a new video, compress it first or it'll load slowly:

```
ffmpeg -i your-clip.mov -vf "scale=1280:-2" -c:v libx264 -preset slow -crf 26 -an -movflags +faststart video/your-file.mp4
```

(Drop `-an` if you want to keep the clip's audio, none of the current films have any, so the site doesn't show a sound button. If you add one with audio, you may want to bring that control back.)

Grab a poster frame (the still shown before it plays) with:

```
ffmpeg -ss 3 -i your-clip.mov -vframes 1 -vf "scale=1280:-2" images/your-poster.jpg
```

## Hosting it for free

You already have a site live on Netlify via drag-and-drop. The setup instructions given separately in chat walk you through connecting it to a GitHub repo without changing your live address, then turning on Identity and Git Gateway so shaon gets a login at /admin.

Starting completely fresh instead: push this folder to a new GitHub repository, then on [netlify.com](https://app.netlify.com), **Add new site → Import an existing project → Deploy with GitHub**, pick the repo, leave the build command empty, set the publish directory to `.`, deploy. Then enable Identity and Git Gateway (both free, both in Site settings) and invite shaon's email.

Either way, `/admin` (shaon's content manager) only works once the site is connected to a GitHub repo with Identity and Git Gateway turned on. A plain drag-and-drop deploy with nothing else changed won't support it.

## Notes

- The site works from any static host (Netlify, GitHub Pages, Vercel, etc.) since it's just plain files, no server or database needed, beyond what `/admin` needs (see above).
- All seven films are muted with no sound controls, since none of the source clips had usable audio worth keeping (they all had music/talking mixed with wind and crowd noise).
- Videos only download once you scroll to them (and pause again if you scroll away), so the page loads fast even with seven films on it.
- Images are already compressed for fast loading. If you add new photos, keep them under ~2000px wide and a few hundred KB each so the page stays fast. Decap CMS (the `/admin` editor) doesn't resize or compress images itself, whatever shaon uploads is what gets served, so it's worth mentioning to them if a photo looks huge.
- One photo from an earlier upload (a close-up of someone who appeared to be sleeping rough) wasn't used, didn't feel right putting it on a public portfolio without knowing if they'd consented to being photographed. Happy to talk it through if you feel differently.
- A low-res sunset beach clip from an earlier upload wasn't used either, the other films were clearly stronger and higher quality. Still have it if you want it added.
- A few images across the uploads weren't added because they weren't new, usable photos: one was an exact repeat of a photo already on the site, one was a screenshot of an Instagram grid rather than a standalone photo, and one was a screenshot of an app showing a photo already on the site.
