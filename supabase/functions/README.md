# Supabase Edge Functions — charts project

These deploy to the **charts** Supabase project (the one holding `chart_stats`,
`subscribers`, `feedback`, `chart_reactions`) — NOT `fyxa-platform`.

## notify-subscribers

Sends a release-day email to everyone in `subscribers` via Resend, with a
one-click unsubscribe link.

### One-time setup

1. **Verify a sending domain** in Resend. It must be a domain you own — **not a
   gmail.com address** (Resend can't verify Gmail and DMARC will block it). Use
   `mokhtartabari.ca` (add the TXT/DKIM records Resend shows; these are separate
   from the site's web-forwarding and won't affect it). Pick a from-address like
   `Mokhtar Tabari <updates@mokhtartabari.ca>`.
   To have replies land in your Gmail, set `REPLY_TO=tabari.mokhtar@gmail.com`
   (a secret, below) — subscribers who reply will reach your Gmail inbox.

2. **Install + log in** to the Supabase CLI, then link the charts project:
   ```bash
   supabase login
   supabase link --project-ref <CHARTS_PROJECT_REF>   # the charts project, e.g. vxgncxkneybpuwahfzhz
   ```

3. **Set secrets** (RESEND_API_KEY is in your macOS Keychain):
   ```bash
   supabase secrets set \
     RESEND_API_KEY="$(security find-generic-password -s resend-api-key-website -w)" \
     NOTIFY_SECRET="$(openssl rand -hex 24)" \
     FROM_EMAIL="Mokhtar Tabari <updates@mokhtartabari.ca>" \
     REPLY_TO="tabari.mokhtar@gmail.com" \
     --project-ref <CHARTS_PROJECT_REF>
   ```
   Save the `NOTIFY_SECRET` value — the orchestrator needs it. (SUPABASE_URL and
   SUPABASE_SERVICE_ROLE_KEY are injected automatically.)

4. **Deploy:**
   ```bash
   supabase functions deploy notify-subscribers --project-ref <CHARTS_PROJECT_REF>
   ```
   The function URL is `https://<CHARTS_PROJECT_REF>.functions.supabase.co/notify-subscribers`.

### Send a blast (wire into the orchestrator on release day)

```bash
curl -X POST "https://<CHARTS_PROJECT_REF>.functions.supabase.co/notify-subscribers" \
  -H "x-notify-secret: $NOTIFY_SECRET" \
  -H "content-type: application/json" \
  -d '{"subject":"New Canadian inflation data is out",
       "html":"<p>Statistics Canada just released new CPI figures — the charts have updated.</p><p><a href=\"https://mokhtartabari.github.io/charts/inflation/\">See the inflation charts →</a></p>"}'
```

In `content-machine-orchestrator`, add this call to the release-day step
(store `NOTIFY_SECRET` as a repo secret), right after it dispatches the
`*-release-day` event, with a subject/link matching the topic that released.

### Notes
- This sends to **all** subscribers (single opt-in; every email carries an
  Unsubscribe link). For true double opt-in, route signups through a small
  `subscribe` function that emails a confirm link and have the blast filter on
  `confirmed = true`.
- For large lists, switch the per-recipient loop to Resend's batch endpoint.
