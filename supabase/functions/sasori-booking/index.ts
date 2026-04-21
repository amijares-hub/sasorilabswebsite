import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
const GOOGLE_REFRESH_TOKEN = Deno.env.get('GOOGLE_REFRESH_TOKEN');
const CALENDAR_ID = 'primary'; // Use primary to avoid encoding issues with email IDs

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("JSON Parse Error in Request:", e);
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), { status: 400, headers: corsHeaders });
    }

    const { action, date, subscriber_id, company_name, email, slot } = body;
    console.log("--- SASORI BOOKING FUNCTION START ---");
    console.log(`Action: ${action}`);
    
    // Log credentials with masking for security verification
    if (GOOGLE_CLIENT_ID) {
      console.log(`Client ID: ${GOOGLE_CLIENT_ID.substring(0, 6)}...${GOOGLE_CLIENT_ID.slice(-6)}`);
    } else {
      console.error("Missing GOOGLE_CLIENT_ID");
    }
    
    if (GOOGLE_REFRESH_TOKEN) {
      console.log(`Refresh Token: ${GOOGLE_REFRESH_TOKEN.substring(0, 6)}...${GOOGLE_REFRESH_TOKEN.slice(-6)}`);
    } else {
      console.error("Missing GOOGLE_REFRESH_TOKEN");
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      const missing = [];
      if (!GOOGLE_CLIENT_ID) missing.push("GOOGLE_CLIENT_ID");
      if (!GOOGLE_CLIENT_SECRET) missing.push("GOOGLE_CLIENT_SECRET");
      if (!GOOGLE_REFRESH_TOKEN) missing.push("GOOGLE_REFRESH_TOKEN");
      console.error("Missing Google Credentials:", missing.join(", "));
      throw new Error(`Server Configuration Error: Missing ${missing.join(", ")}`);
    }

    // 1. Get Access Token
    console.log("Refreshing Google OAuth2 token...");
    const tokenParams = new URLSearchParams();
    tokenParams.append('client_id', GOOGLE_CLIENT_ID);
    tokenParams.append('client_secret', GOOGLE_CLIENT_SECRET);
    tokenParams.append('refresh_token', GOOGLE_REFRESH_TOKEN);
    tokenParams.append('grant_type', 'refresh_token');

    let tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Google Token Refresh Error Details:", errorText);
      return new Response(JSON.stringify({ 
        error: `Google Auth Error: ${errorText}`,
        detail: "Verificar GOOGLE_CLIENT_ID, SECRET y REFRESH_TOKEN"
      }), { status: 500, headers: corsHeaders });
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;
    console.log("Access token obtained successfully.");

    if (action === 'get_slots') {
      console.log(`Step: get_slots for date: ${date}`);
      if (!date) throw new Error("Missing date parameter for get_slots");

      // LOGICA DE FECHAS: Asegurarnos de que timeMin no sea pasado
      const now = new Date();
      const selectedDayMidnight = new Date(`${date}T00:00:00Z`);
      
      const timeMinDate = selectedDayMidnight < now ? now : selectedDayMidnight;
      const timeMin = timeMinDate.toISOString();
      const timeMax = new Date(`${date}T23:59:59Z`).toISOString();
      
      console.log(`Querying FreeBusy. timeMin: ${timeMin}, timeMax: ${timeMax}`);

      let freeBusyResponse = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${access_token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          items: [{ id: CALENDAR_ID || 'primary' }],
        }),
      });

      if (!freeBusyResponse.ok) {
        const errText = await freeBusyResponse.text();
        console.error("FreeBusy API Error Details:", errText);
        return new Response(JSON.stringify({ 
          error: `Google FreeBusy API Error: ${errText}`
        }), { status: 500, headers: corsHeaders });
      }

      const fbData = await freeBusyResponse.json();
      console.log("Raw Google FreeBusy Response:", JSON.stringify(fbData));

      // Intentar extraer ocupación de cualquier calendario devuelto
      const calendarKey = CALENDAR_ID || 'primary';
      const calendarData = fbData.calendars?.[calendarKey] || fbData.calendars?.['primary'] || (fbData.calendars ? Object.values(fbData.calendars)[0] : null);
      const busy = calendarData?.busy || [];
      console.log(`Found ${busy.length} busy periods for calendar.`);

      // 24/7 TEST: 00:00 a 24:00 Madrid (UTC+2)
      const availableSlots = [];
      const madridOffset = 2; // Hardcoded para abril
      const localStart = 0;
      const localEnd = 24;

      console.log(`24/7 TEST: Generating all slots 00:00-24:00 Madrid (UTC+${madridOffset})`);

      for (let h = localStart; h < localEnd; h++) {
        for (let m of [0, 30]) {
          const slotStart = new Date(date);
          slotStart.setUTCHours(h - madridOffset, m, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);

          // No permitir horas pasadas respecto a "ahora"
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

      console.log(`Final Slots Count: ${availableSlots.length}`);
      return new Response(JSON.stringify({ slots: availableSlots }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create_event') {
      console.log(`Step: create_event for: ${email} at ${slot}`);
      if (!slot || !email) throw new Error("Missing parameters for create_event");

      const startTime = new Date(slot);
      const endTime = new Date(startTime.getTime() + 30 * 60000);

      const event = {
        summary: `[SasoriLabs] Primera Llamada - ${company_name || 'Prospecto'}`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [{ email }],
        conferenceData: { createRequest: { requestId: `sasori-${Date.now()}`, conferenceSolutionKey: { type: 'hangoutsMeet' } } },
      };

      let createResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?conferenceDataVersion=1`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error("Calendar Event Creation Error:", errorText);
        return new Response(JSON.stringify({ 
          error: `Google Calendar Create Event Error: ${errorText}`
        }), { status: 500, headers: corsHeaders });
      }

      const eventData = await createResponse.json();
      const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
      await supabase.from('onboarding_submissions').update({ scheduled_at: startTime.toISOString() }).eq('subscriber_id', subscriber_id);

      return new Response(JSON.stringify({ success: true, meetLink: eventData.hangoutLink || eventData.htmlLink }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: corsHeaders });

  } catch (err) {
    console.error("CRITICAL FUNCTION ERROR:", err.message);
    return new Response(JSON.stringify({ 
      error: err.message,
      detail: "Refer to Supabase Edge Function logs for full context."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
