import { supabase } from "@/integrations/supabase/client";

const SESSION_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export function trackEvent(
  eventType: string,
  eventData: Record<string, unknown> = {},
  page?: string
) {
  // Fire and forget — don't block the UI
  supabase
    .from("user_events")
    .insert([{
      event_type: eventType,
      event_data: eventData as any,
      session_id: SESSION_ID,
      page: page ?? window.location.pathname,
    }])
    .then(({ error }) => {
      if (error) console.warn("Analytics error:", error.message);
    });
}
