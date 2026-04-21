import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Target Calendar
const CALENDAR_ID = 'amijares@sasorilabs.io';

// Service Account Credentials (from Secrets)
const GOOGLE_SERVICE_ACCOUNT_JSON = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');

async function getAccessToken(serviceAccount: any) {
  const { client_email, private_key, token_uri } = serviceAccount;
  
  // Scopes required for freebusy and event creation
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' ');

  // Create JWT Header
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: client_email,
    scope: scopes,
    aud: token_uri,
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedClaim = btoa(JSON.stringify(claim));
  const signatureInput = `${encodedHeader}.${encodedClaim}`;

  // Sign with Web Crypto API
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = private_key
    .replace(pemHeader, "")
    .replace(pemFooter, "")
    .replace(/\s/g, "");
  
  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signatureInput)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${signatureInput}.${encodedSignature}`;

  // Exchange JWT for Access Token
  const response = await fetch(token_uri, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to get access token: ${err}`);
  }

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, date, subscriber_id, company_name, email, slot } = body;

    console.log(`--- SASORI SERVICE ACCOUNT START ---`);
    console.log(`Action: ${action}, Calendar: ${CALENDAR_ID}`);

    if (!GOOGLE_SERVICE_ACCOUNT_JSON) {
      throw new Error("Missing GOOGLE_SERVICE_ACCOUNT_JSON secret.");
    }
    const serviceAccount = JSON.parse(GOOGLE_SERVICE_ACCOUNT_JSON);

    // 1. Get Access Token via Service Account Flow
    const access_token = await getAccessToken(serviceAccount);
    console.log("Service Account Token obtained.");

    if (action === 'get_slots') {
      const now = new Date();
      const selectedDateStart = new Date(`${date}T00:00:00Z`);
      const timeMinDate = selectedDateStart < now ? now : selectedDateStart;
      const timeMin = timeMinDate.toISOString();
      const timeMax = new Date(`${date}T23:59:59Z`).toISOString();
      
      console.log(`Querying FreeBusy. timeMin: ${timeMin}`);

      const freeBusyResponse = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${access_token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          items: [{ id: CALENDAR_ID }],
        }),
      });

      if (!freeBusyResponse.ok) {
        const err = await freeBusyResponse.text();
        return new Response(JSON.stringify({ error: `FreeBusy Error: ${err}` }), { status: 500, headers: corsHeaders });
      }

      const fbData = await freeBusyResponse.json();
      const busy = fbData.calendars?.[CALENDAR_ID]?.busy || [];
      console.log(`Found ${busy.length} busy periods.`);

      // Hardcoded Madrid (UTC+2) 07:00 - 22:00
      const availableSlots = [];
      const madridOffset = 2; 
      const localStart = 7;
      const localEnd = 22;

      for (let h = localStart; h < localEnd; h++) {
        for (let m of [0, 30]) {
          const slotStart = new Date(date);
          slotStart.setUTCHours(h - madridOffset, m, 0, 0);
          const slotEnd = new Date(slotStart.getTime() + 30 * 60000);

          if (slotStart < now) continue;

          const isBusy = busy.some((b: any) => {
            const bStart = new Date(b.start);
            const bEnd = new Date(b.end);
            return (slotStart < bEnd && slotEnd > bStart);
          });

          if (!isBusy) {
            availableSlots.push(slotStart.toISOString());
          }
        }
      }

      return new Response(JSON.stringify({ slots: availableSlots }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_event') {
      console.log(`Creating event for: ${email} at ${slot}`);
      const startTime = new Date(slot);
      const endTime = new Date(startTime.getTime() + 30 * 60000);

      const event = {
        summary: `[SasoriLabs] Primera Llamada - ${company_name || 'Prospecto'}`,
        description: `Llamada de diagnóstico técnico y estrategia.`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [{ email }, { email: CALENDAR_ID }],
        conferenceData: {
          createRequest: {
            requestId: `sasori-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
      };

      const createResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?conferenceDataVersion=1`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      if (!createResponse.ok) {
        const err = await createResponse.text();
        return new Response(JSON.stringify({ error: `Create Event Error: ${err}` }), { status: 500, headers: corsHeaders });
      }

      const eventData = await createResponse.json();
      
      // Update Supabase
      const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
      await supabase.from('onboarding_submissions').update({ 
        scheduled_at: startTime.toISOString(),
        meeting_link: eventData.hangoutLink || eventData.htmlLink 
      }).eq('subscriber_id', subscriber_id);

      return new Response(JSON.stringify({ 
        success: true, 
        meetLink: eventData.hangoutLink || eventData.htmlLink 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: corsHeaders });

  } catch (err) {
    console.error("Function Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
