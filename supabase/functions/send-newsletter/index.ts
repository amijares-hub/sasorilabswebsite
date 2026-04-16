// ============================================================
// Supabase Edge Function: send-newsletter
// Motor de dispatch masivo — SASORILABS Newsletter Engine
// Deploy: supabase functions deploy send-newsletter
// Trigger: POST { campaign_id: "uuid" } con Authorization header
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ── Environment Variables ─────────────────────────────────────
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ── Constants ─────────────────────────────────────────────────
const FROM_EMAIL = "SasoriLabs <support@sasorilabs.io>";
const SITE_URL = "https://www.sasorilabs.io";
const BATCH_SIZE = 100; // Resend Batch API limit per request

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── Type Definitions ──────────────────────────────────────────
interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  lang: string | null;
  unsubscribe_token: string;
}

interface Campaign {
  id: string;
  subject_es: string;
  subject_en: string | null;
  content_es: string;
  content_en: string | null;
  status: string;
}

interface ResendEmail {
  from: string;
  to: string[];
  subject: string;
  html: string;
}

interface EmailLog {
  subscriber_id: string;
  campaign_id: string;
  email: string;
  type: string;
  status: string;
}

// ── HTML Template ─────────────────────────────────────────────
function buildCampaignEmailHTML(
  subject: string,
  content: string,
  lang: string,
  unsubscribeToken: string
): string {
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${subject}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #0a0a0a; font-family: 'Inter', sans-serif; color: #ffffff; }
  .container { max-width: 600px; margin: 0 auto; }
  .header { padding: 40px 40px 20px; border-bottom: 1px solid rgba(226,6,19,0.2); }
  .logo { font-size: 20px; font-weight: 900; letter-spacing: 0.3em; color: #E20613; }
  .content { padding: 50px 40px; }
  .subject-line { font-size: 28px; font-weight: 900; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 30px; }
  .body-content { font-size: 16px; color: rgba(255,255,255,0.7); line-height: 1.9; }
  .body-content h2 { color: #E20613; font-size: 20px; font-weight: 900; margin: 30px 0 15px; }
  .body-content p { margin-bottom: 20px; }
  .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 0 40px; }
  .footer { padding: 30px 40px; text-align: center; }
  .footer-logo { font-size: 14px; font-weight: 900; letter-spacing: 0.3em; color: rgba(255,255,255,0.2); }
  .unsubscribe { display: block; margin-top: 15px; font-size: 10px; color: rgba(255,255,255,0.2); text-decoration: none; letter-spacing: 0.1em; }
  .cta-btn { display: inline-block; background: #E20613; color: #fff; text-decoration: none; font-size: 11px; font-weight: 900; letter-spacing: 0.3em; padding: 14px 32px; border-radius: 50px; margin-top: 30px; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><div class="logo">SASORILABS</div></div>
  <div class="content">
    <h1 class="subject-line">${subject}</h1>
    <div class="body-content">${content}</div>
    <a href="${SITE_URL}/blog" class="cta-btn">LEER MÁS →</a>
  </div>
  <div class="divider"></div>
  <div class="footer">
    <div class="footer-logo">SASORILABS</div>
    <a href="${SITE_URL}/unsubscribe?token=${unsubscribeToken}" class="unsubscribe">
      Cancelar suscripción / Unsubscribe
    </a>
  </div>
</div>
</body>
</html>`;
}

// ── Utility: split array into chunks ─────────────────────────
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ── JSON Response Helper ──────────────────────────────────────
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

// ── Main Handler ──────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }

  try {
    // ── Step 1: Parse & validate request body ─────────────────
    const body = await req.json().catch(() => ({}));
    const { campaign_id } = body as { campaign_id?: string };

    if (!campaign_id) {
      return jsonResponse({ error: "campaign_id is required in the request body" }, 400);
    }

    // ── Step 2: Initialize Supabase (Service Role — bypasses RLS) ──
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // ── Step 3: Load campaign from DB ─────────────────────────
    const { data: campaign, error: campaignError } = await supabase
      .from("newsletter_campaigns")
      .select("id, subject_es, subject_en, content_es, content_en, status")
      .eq("id", campaign_id)
      .single<Campaign>();

    if (campaignError || !campaign) {
      return jsonResponse(
        { error: "Campaign not found", detail: campaignError?.message },
        404
      );
    }

    // ── Step 4: Guard against re-sends ────────────────────────
    if (campaign.status !== "draft") {
      return jsonResponse(
        {
          error: `Campaign cannot be sent. Current status: '${campaign.status}'. Only 'draft' campaigns can be dispatched.`,
        },
        409
      );
    }

    // ── Step 5: Mark campaign as 'sending' ───────────────────
    await supabase
      .from("newsletter_campaigns")
      .update({ status: "sending" })
      .eq("id", campaign_id);

    // ── Step 6: Load active subscribers ──────────────────────
    const { data: subscribers, error: subsError } = await supabase
      .from("subscribers")
      .select("id, email, name, lang, unsubscribe_token")
      .eq("status", "active");

    if (subsError) {
      await supabase
        .from("newsletter_campaigns")
        .update({ status: "failed" })
        .eq("id", campaign_id);
      return jsonResponse(
        { error: "Failed to load subscribers", detail: subsError.message },
        500
      );
    }

    if (!subscribers || subscribers.length === 0) {
      // Revert to draft — no subscribers to send to
      await supabase
        .from("newsletter_campaigns")
        .update({ status: "draft" })
        .eq("id", campaign_id);
      return jsonResponse({ error: "No active subscribers found" }, 404);
    }

    // ── Step 7: Build email batches ───────────────────────────
    const batches = chunkArray(subscribers as Subscriber[], BATCH_SIZE);
    let totalSent = 0;
    const emailLogs: EmailLog[] = [];

    for (const batch of batches) {
      // Map each subscriber to a Resend email object
      const emails: ResendEmail[] = batch.map((sub) => {
        const isEnglish = sub.lang === "en";

        // Language fallback: if EN content missing, fall back to ES
        const subject = isEnglish
          ? (campaign.subject_en ?? campaign.subject_es)
          : campaign.subject_es;

        const content = isEnglish
          ? (campaign.content_en ?? campaign.content_es)
          : campaign.content_es;

        return {
          from: FROM_EMAIL,
          to: [sub.email],
          subject,
          html: buildCampaignEmailHTML(
            subject,
            content,
            sub.lang ?? "es",
            sub.unsubscribe_token
          ),
          tags: [
            { name: "subscriber_id", value: sub.id },
            { name: "campaign_id", value: campaign.id },
          ],
        };
      });

      // ── Step 8: Send batch via Resend Batch API ────────────
      const resendRes = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emails),
      });

      if (!resendRes.ok) {
        const resendErr = await resendRes.json();
        console.error(`[send-newsletter] Resend batch error (batch size: ${batch.length}):`, resendErr);

        // Mark campaign as failed and abort
        await supabase
          .from("newsletter_campaigns")
          .update({ status: "failed" })
          .eq("id", campaign_id);

        return jsonResponse(
          { error: "Resend Batch API failed", detail: resendErr },
          502
        );
      }

      // Accumulate successful sends
      totalSent += batch.length;

      batch.forEach((sub) => {
        emailLogs.push({
          subscriber_id: sub.id,
          campaign_id,
          email: sub.email,
          type: "campaign",
          status: "sent",
        });
      });
    }

    // ── Step 9: Bulk-insert email logs ────────────────────────
    if (emailLogs.length > 0) {
      const { error: logError } = await supabase
        .from("email_logs")
        .insert(emailLogs);

      if (logError) {
        console.warn("[send-newsletter] Could not insert email_logs:", logError.message);
        // Non-fatal: emails were sent, just logging failed
      }
    }

    // ── Step 10: Mark campaign as 'sent' ──────────────────────
    await supabase
      .from("newsletter_campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        sent_count: totalSent,
      })
      .eq("id", campaign_id);

    console.log(`[send-newsletter] Campaign ${campaign_id} dispatched. Sent: ${totalSent} emails in ${batches.length} batch(es).`);

    return jsonResponse({
      success: true,
      campaign_id,
      sent_count: totalSent,
      batches: batches.length,
    });

  } catch (err) {
    console.error("[send-newsletter] Fatal error:", err);
    return jsonResponse({ error: String(err) }, 500);
  }
});
