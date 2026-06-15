GLOBAL MACRO DESK — deploy guide
================================

WHAT'S IN THIS FOLDER
  index.html                     the dashboard (this is the website)
  netlify.toml                   tells Netlify how to serve it + run the function
  netlify/functions/proxy.js     small server function that fetches the
                                 CORS-blocked sources (Brent, gold, MAS,
                                 foreign yields) and the news, reliably
  README.txt                     this file

WHY THE FUNCTION MATTERS
  Browsers block pages from reading many financial sources directly (a rule
  called CORS). The function runs on Netlify's SERVER, which isn't bound by
  that rule, so it fetches those sources and hands them to the page. This is
  what makes the news + data load reliably instead of intermittently.
  => Deploy on NETLIFY (not plain GitHub Pages) so the function runs.

------------------------------------------------------------
OPTION A — FASTEST (Netlify drag-and-drop, no GitHub) ~2 min
------------------------------------------------------------
  1. Go to  https://app.netlify.com/drop
  2. Drag THIS WHOLE FOLDER (macro-desk-site) onto the page.
  3. Wait for "Site is live". You get a URL like  your-name.netlify.app
  4. (optional) Site settings -> change site name to something tidy.
  Done. The function deploys automatically because it's in netlify/functions.

------------------------------------------------------------
OPTION B — GITHUB + NETLIFY (auto-redeploys when you edit) ~6 min
------------------------------------------------------------
  1. Create a GitHub repo (e.g. "macro-desk"), public or private.
  2. Upload the CONTENTS of this folder to the repo, keeping the structure:
       index.html
       netlify.toml
       netlify/functions/proxy.js
     (On github.com: "Add file" -> "Upload files" -> drag them in.
      To preserve the netlify/functions path, either drag the whole folder,
      or create the file at path  netlify/functions/proxy.js  manually.)
  3. Go to  https://app.netlify.com  -> "Add new site" -> "Import an
     existing project" -> connect GitHub -> pick your repo.
  4. Build settings: leave build command BLANK, publish directory ".".
     Click Deploy. Netlify reads netlify.toml and wires up the function.
  5. You get a live URL. Every time you push a change to GitHub, it redeploys.

------------------------------------------------------------
UPDATING / DAILY USE
------------------------------------------------------------
  * The page pulls fresh news + data every time it loads or you hit Refresh,
    so opening it each morning gives you that day's scan. Nothing to maintain.
  * Bookmark the URL on your phone for the morning 15-min scan.
  * To edit the dashboard later: change index.html and (Option B) push to
    GitHub, or (Option A) re-drag the folder to Netlify Drop.

NOTES
  * If a single cell still shows "unavailable", hit Refresh once — a source
    was momentarily slow. Every cell also links to its source as a backup.
  * The function only fetches a fixed allow-list of finance domains (see the
    top of proxy.js). That's deliberate, for safety.
