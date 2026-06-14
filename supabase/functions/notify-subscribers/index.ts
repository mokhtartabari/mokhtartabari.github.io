// notify-subscribers — Supabase Edge Function
//
// Sends a release-day email to all subscribers via Resend, and handles
// one-click unsubscribe. Deploy to the CHARTS Supabase project.
//
// Secrets to set (supabase secrets set ... ):
//   RESEND_API_KEY  - your Resend API key
//   NOTIFY_SECRET   - shared secret; the orchestrator sends it to authorize a blast
//   FROM_EMAIL      - a verified Resend sender, e.g. "Mokhtar Tabari <updates@mokhtartabari.ca>"
// Auto-provided by Supabase at runtime: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// Trigger a blast (from the orchestrator, on a StatCan release day):
//   curl -X POST "$FUNCTION_URL" \
//     -H "x-notify-secret: $NOTIFY_SECRET" -H "content-type: application/json" \
//     -d '{"subject":"New Canadian inflation data is out","html":"<p>…</p>"}'
//
// Unsubscribe link (auto-appended to every email):
//   GET "$FUNCTION_URL?unsubscribe=<confirm_token>"

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE = "https://mokhtartabari.github.io";

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

function htmlPage(msg: string) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><body style="font-family:Georgia,serif;max-width:32rem;margin:4rem auto;padding:0 1rem;line-height:1.5">${msg}</body>`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // One-click unsubscribe: GET ?unsubscribe=<confirm_token>
  if (req.method === "GET" && url.searchParams.has("unsubscribe")) {
    const token = url.searchParams.get("unsubscribe")!;
    await admin().from("subscribers").delete().eq("confirm_token", token);
    return htmlPage(`You've been unsubscribed. <a href="${SITE}/charts/">Back to the charts →</a>`);
  }

  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  // Authorize the blast with the shared secret.
  if (req.headers.get("x-notify-secret") !== Deno.env.get("NOTIFY_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { subject, html } = await req.json().catch(() => ({}));
  if (!subject || !html) {
    return new Response("Body must include { subject, html }", { status: 400 });
  }

  const { data: subs, error } = await admin()
    .from("subscribers")
    .select("email, confirm_token");
  if (error) return new Response(error.message, { status: 500 });

  const from = Deno.env.get("FROM_EMAIL")!;
  const key = Deno.env.get("RESEND_API_KEY")!;
  let sent = 0;

  for (const s of subs ?? []) {
    const unsub = `${url.origin}${url.pathname}?unsubscribe=${s.confirm_token}`;
    const body = {
      from,
      to: s.email,
      subject,
      html: `${html}<hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="font-size:12px;color:#888">You're receiving this because you signed up at
        <a href="${SITE}/charts/">${SITE.replace("https://", "")}/charts</a>.
        <a href="${unsub}">Unsubscribe</a>.</p>`,
    };
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) sent++;
  }

  return Response.json({ sent, total: subs?.length ?? 0 });
});
