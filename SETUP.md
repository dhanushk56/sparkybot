# SparkyBot + Dashboard

This package has two parts:

- Everything at the top level (`main.py`, `cogs/`, `utils/`) is the Discord bot — same as what's running on your Wispbyte server now, with the dashboard API endpoints added.
- `dashboard/` is a separate Next.js website. It deploys to Vercel on its own and talks to your bot over the internet.

## 1. Bot side (Wispbyte)

Nothing about how you start the bot changes. Just:

1. Upload these files over your existing bot files (or replace them).
2. In the Wispbyte panel, add an environment variable:
   - `DASHBOARD_API_SECRET` — make up a long random password. Example: open any password generator and use a 32+ character string.
3. Restart the bot. Your API is already reachable at `78.154.103.38:13792` (port 25567 inside the container, mapped by Wispbyte).

## 2. Dashboard side (Vercel)

1. Push the `dashboard/` folder to its own GitHub repo (or upload it directly in Vercel).
2. In Vercel, set these environment variables (Project Settings → Environment Variables):

   | Variable | Value |
   |---|---|
   | `DISCORD_CLIENT_ID` | From the Discord Developer Portal → your app → OAuth2 |
   | `DISCORD_CLIENT_SECRET` | Same page, click "Reset Secret" if you don't have it |
   | `SESSION_SECRET` | Any long random string (32+ characters) |
   | `BOT_API_URL` | `http://78.154.103.38:13792` |
   | `BOT_API_SECRET` | Must be the exact same value as `DASHBOARD_API_SECRET` on the bot |

3. In the Discord Developer Portal → OAuth2 → Redirects, add:
   `https://your-vercel-domain.vercel.app/api/auth/callback`
4. Deploy.

If step 3 is skipped, login will fail with a redirect mismatch error — that's the most common thing to get wrong.

## Notes

- The dashboard currently manages: prefix, mod-log channel, welcome/goodbye channels + toggle, and 5 AutoMod toggles. More settings pages can be added the same way later.
- If `BOT_API_URL` is unreachable (bot offline, port not exposed), the dashboard shows "bot is offline" instead of crashing — it won't take your site down.
