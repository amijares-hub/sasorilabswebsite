import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
const GOOGLE_REFRESH_TOKEN = Deno.env.get('GOOGLE_REFRESH_TOKEN');
const CALENDAR_ID = 'amijares@sasorilabs.io';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, date, subscriber_id, company_name, email, slot } = await req.json();

    // 1. Get Access Token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });
    const { access_token } = await tokenResponse.json();

    if (action === 'get_slots') {
      // 2. Fetch Busy Slots
      const timeMin = new Date(`${date}T00:00:00Z`).toISOString();
      const timeMax = new Date(`${date}T23:59:59Z`).toISOString();

      const freeBusyResponse = await fetch('https://www.googleapis.com/calendar/v3/freeBusy/query', {
        method: 'POST',
        headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeMin,
          timeMax,
          items: [{ id: CALENDAR_ID }],
        }),
      });
      const { calendars } = await freeBusyResponse.json();
      const busy = calendars[CALENDAR_ID].busy;

      // 3. Generate Available Slots (07:00 - 22:00 Tenerife)
      // Tenerife is WEST (UTC+1) usually, but we calculate based on local time logic.
      const availableSlots = [];
      const startHour = 7;
      const endHour = 22;

      for (let h = startHour; h < endHour; h++) {
        for (let m of [0, 30]) {
          const slotStart = new Date(date);
          slotStart.setHours(h, m, 0, 0);
          
          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + 30);

          // Check if slot is in the past
          if (slotStart < new Date()) continue;

          // Check collision with busy blocks + 15 min buffer
          const isBusy = busy.some((b: any) => {
            const bStart = new Date(b.start);
            const bEnd = new Date(b.end);
            // 15 min buffer before and after
            const bufferedBStart = new Date(bStart.getTime() - 15 * 60000);
            const bufferedBEnd = new Date(bEnd.getTime() + 15 * 60000);
            
            return (slotStart < bufferedBEnd && slotEnd > bufferedBStart);
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
      // 4. Create Calendar Event
      const startTime = new Date(slot);
      const endTime = new Date(startTime.getTime() + 30 * 60000);

      const event = {
        summary: `[SasoriLabs] Primera Llamada de Contacto - ${company_name}`,
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

      const createResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?conferenceDataVersion=1`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      const eventData = await createResponse.json();

      // 5. Update Supabase
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      await supabase
        .from('onboarding_submissions')
        .update({ scheduled_at: startTime.toISOString() })
        .eq('subscriber_id', subscriber_id);

      return new Response(JSON.stringify({ success: true, meetLink: eventData.hangoutLink }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Invalid action', { status: 400 });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
