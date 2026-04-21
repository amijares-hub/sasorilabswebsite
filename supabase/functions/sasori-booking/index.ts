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

  console.log("--- SASORI BOOKING FUNCTION START ---");
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      console.error("JSON Parse Error in Request:", e);
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), { status: 400, headers: corsHeaders });
    }
    
    console.log("Request body received:", body);
    const { action, date, subscriber_id, company_name, email, slot } = body;

    console.log(`Action: ${action}`);

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

    let tokenResponse;
    try {
      tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenParams.toString(),
      });
    } catch (fErr) {
      console.error("Fetch error during token refresh:", fErr);
      throw new Error(`Failed to contact Google OAuth: ${fErr.message}`);
    }

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Google Token Refresh Error Details:", errorText);
      throw new Error(`Google Auth Error: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;
    console.log("Access token obtained successfully.");

    if (action === 'get_slots') {
      console.log(`Step: get_slots for date: ${date}`);
      
      if (!date) throw new Error("Missing date parameter for get_slots");

      const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
      const timeMax = new Date(`${date}T23:59:59Z`).toISOString();
      console.log(`Querying FreeBusy from ${timeMin} to ${timeMax}`);

      let freeBusyResponse;
      try {
        freeBusyResponse = await fetch('https://www.googleapis.com/calendar/v3/freeBusy/query', {
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
      } catch (fErr) {
        console.error("Fetch error during FreeBusy query:", fErr);
        throw new Error(`Failed to contact Google FreeBusy API: ${fErr.message}`);
      }

      if (!freeBusyResponse.ok) {
        const errText = await freeBusyResponse.text();
        console.error("FreeBusy API Error Details:", errText);
        throw new Error(`Google FreeBusy API Error: ${errText}`);
      }

      const fbData = await freeBusyResponse.json();
      console.log("FreeBusy data received:", JSON.stringify(fbData));
      
      const busy = fbData.calendars?.[CALENDAR_ID]?.busy || fbData.calendars?.['primary']?.busy || [];
      console.log(`Found ${busy.length} busy periods.`);

      // 3. Generate Available Slots (07:00 - 22:00 UTC)
      const availableSlots = [];
      const startHour = 8; 
      const endHour = 20;

      console.log(`Generating slots between ${startHour}:00 and ${endHour}:00 UTC for date ${date}`);

      for (let h = startHour; h < endHour; h++) {
        for (let m of [0, 30]) {
          const slotStart = new Date(date);
          slotStart.setUTCHours(h, m, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);

          if (slotStart < new Date()) {
            continue;
          }

          const isBusy = busy.some((b: any) => {
            const bStart = new Date(b.start);
            const bEnd = new Date(b.end);
            const bufferedBStart = new Date(bStart.getTime() - 15 * 60000);
            const bufferedBEnd = new Date(bEnd.getTime() + 15 * 60000);
            return (slotStart < bufferedBEnd && slotEnd > bufferedBStart);
          });

          if (!isBusy) {
            availableSlots.push(slotStart.toISOString());
          }
        }
      }

      console.log(`Total available slots generated: ${availableSlots.length}`);
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
        summary: `[SasoriLabs] Primera Llamada de Contacto - ${company_name || 'Prospecto'}`,
        description: `En esta primera llamada de contacto nos presentaremos y trataremos a detalle las necesidades del cliente.`,
        start: { dateTime: startTime.toISOString() },
        end: { dateTime: endTime.toISOString() },
        attendees: [{ email }],
        conferenceData: {
          createRequest: {
            requestId: `sasori-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      };

      console.log("Sending event creation request to Google...");
      let createResponse;
      try {
        createResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?conferenceDataVersion=1`, {
          method: 'POST',
          headers: { 
            Authorization: `Bearer ${access_token}`, 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(event),
        });
      } catch (fErr) {
        console.error("Fetch error during event creation:", fErr);
        throw new Error(`Failed to contact Google Calendar API: ${fErr.message}`);
      }

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error("Calendar Event Creation Error Details:", errorText);
        throw new Error(`Google Calendar Create Event Error: ${errorText}`);
      }

      const eventData = await createResponse.json();
      console.log("Event created successfully:", eventData.id);

      // 5. Update Supabase
      console.log("Updating Supabase record...");
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { error: dbError } = await supabase
        .from('onboarding_submissions')
        .update({ scheduled_at: startTime.toISOString() })
        .eq('subscriber_id', subscriber_id);

      if (dbError) {
        console.warn("DB Update Error (Non-critical):", dbError);
      } else {
        console.log("Supabase record updated successfully.");
      }

      return new Response(JSON.stringify({ 
        success: true, 
        meetLink: eventData.hangoutLink || eventData.htmlLink 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("No valid action specified.");
    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400, headers: corsHeaders });

  } catch (err) {
    console.error("CRITICAL FUNCTION ERROR:", err.message);
    if (err.stack) console.error("Stack trace:", err.stack);
    
    return new Response(JSON.stringify({ 
      error: err.message,
      detail: "Refer to Supabase Edge Function logs for full context."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
