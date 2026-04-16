// ============================================================
// Supabase Edge Function: resend-webhook
// Receptor de eventos de Resend (Bounces, Complaints, Opens)
// Con validación de firma criptográfica mediante Svix
// Deploy: supabase functions deploy resend-webhook --no-verify-jwt
// ============================================================

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Webhook } from "https://esm.sh/svix@1.24.0";

// ── Environment Variables ─────────────────────────────────────
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_WEBHOOK_SECRET = Deno.env.get("RESEND_WEBHOOK_SECRET")!;

// ── Main Handler ──────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // Solo aceptamos POST de Resend
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // ── Paso 1: Validar Firma (Svix) ──────────────────────────
    const payload = await req.text();
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("[resend-webhook] Faltan headers de Svix");
      return new Response("Missing svix headers", { status: 401 });
    }

    if (!RESEND_WEBHOOK_SECRET) {
      console.error("[resend-webhook] RESEND_WEBHOOK_SECRET no configurado");
      return new Response("Configuration error", { status: 500 });
    }

    const wh = new Webhook(RESEND_WEBHOOK_SECRET);
    let evt: any;

    try {
      evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error("[resend-webhook] Firma inválida:", err);
      return new Response("Invalid signature", { status: 401 });
    }

    // ── Paso 2: Extraer Datos del Evento ──────────────────────
    const { type, data } = evt;
    const { tags } = data;

    // Los tags en el webhook de Resend vienen como un objeto: { subscriber_id: "...", campaign_id: "..." }
    const subscriber_id = tags?.subscriber_id;
    const campaign_id = tags?.campaign_id;

    console.log(`[resend-webhook] Evento recibido: ${type} | Subscriber: ${subscriber_id} | Campaign: ${campaign_id}`);

    if (!subscriber_id || !campaign_id) {
      console.warn("[resend-webhook] Evento sin tags de tracking. Ignorando.");
      return new Response("Ignored (no tags)", { status: 200 });
    }

    // ── Paso 3: Inicializar Supabase ──────────────────────────
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    // ── Paso 4: Lógica de Negocio ──────────────────────────────
    
    // A. Actualizar estado del suscriptor si es crítico (Bounce o Complaint)
    if (type === "email.bounced" || type === "email.complained") {
      const newStatus = type === "email.bounced" ? "bounced" : "complained";
      
      const { error: subUpdateError } = await supabase
        .from("subscribers")
        .update({ status: newStatus })
        .eq("id", subscriber_id);

      if (subUpdateError) {
        console.error(`[resend-webhook] Error actualizando suscriptor ${subscriber_id}:`, subUpdateError.message);
      } else {
        console.log(`[resend-webhook] Suscriptor ${subscriber_id} marcado como ${newStatus}`);
      }
    }

    // B. Actualizar log de email (Tracking de interacción)
    // El status en email_logs suele empezar como 'sent'
    // Mapeamos el tipo de evento al status del log
    const eventToStatus: Record<string, string> = {
      "email.delivered": "delivered",
      "email.opened": "opened",
      "email.clicked": "clicked",
      "email.bounced": "bounced",
      "email.complained": "complained",
    };

    const newLogStatus = eventToStatus[type];

    if (newLogStatus) {
      const { error: logUpdateError } = await supabase
        .from("email_logs")
        .update({ status: newLogStatus })
        .match({ subscriber_id, campaign_id });

      if (logUpdateError) {
        console.error(`[resend-webhook] Error actualizando log:`, logUpdateError.message);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("[resend-webhook] Error fatal:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
