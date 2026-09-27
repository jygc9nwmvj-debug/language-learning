# Local → GitHub → Cloudflare Pages

## Active deployment — 2026-09-27

Live test app: https://language-learning-abk.pages.dev/
Cloudflare Pages project: `language-learning`. Git integration: `main`.
Initial successful deployment: `de46e7d85343004be7f133f40cf67fa7753a5caf`.
Verified in the browser: HTTPS app loads and reports “Für offline bereit”.
Actual phone installation and airplane-mode tests remain user device checks.

## Prepared repository

GitHub: https://github.com/jygc9nwmvj-debug/language-learning
Branch: `main`. Build uses Node `24.21.0` via `.node-version`.

## First deployment

1. Sign in at https://dash.cloudflare.com/.
2. Workers & Pages → Create application → Pages → Import an existing Git repository.
3. Connect GitHub. Limit repository access to `language-learning` when choosing repositories.
4. Choose `language-learning` and `main`.
5. Framework preset: None (or React/Vite if offered).
6. Build command: `npm run build`.
7. Build output directory: `dist`.
8. Root directory: repository root (leave blank).
9. Save and Deploy. Open the resulting HTTPS `pages.dev` address.

The application needs no database, account service, API keys or paid add-ons.
`_headers` asks search engines not to index the prototype, but is not authentication.
Anyone with its public address can load it. Local learner state never gets pushed to GitHub;
it is stored separately in each browser/origin.

Audio remains labelled unreviewed development material. This is a personal test deployment,
not a reviewed public Mandarin course.

## Updates

Make changes locally, run `npm run build` and the relevant tests, commit and push `main`.
The connected Pages project builds and deploys automatically. Existing PWA tabs may keep the old
service worker until all tabs/app windows for that site are closed; reopen afterward.

## Phone test

1. Open the HTTPS address in Safari (iPhone) or Chrome (Android).
2. Wait for “Für offline bereit”. Start with sound and optional microphone.
3. On iPhone use Share → Add to Home Screen. On Android use the browser's Install/Add action.
4. Complete a few tasks, close and reopen; progress should remain.
5. After the initial download, enable airplane mode and reopen the same installed app.
6. Return the next day without previewing answers to test delayed recall.

`localhost` progress is separate from the HTTPS address. Use the app's export/import if you want to
transfer it; starting fresh on the phone is appropriate for the first device check.

## References

https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/
https://developers.cloudflare.com/pages/configuration/build-image/
https://developers.cloudflare.com/pages/configuration/headers/
