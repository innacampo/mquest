
CREATE TABLE public.user_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  page TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert events"
ON public.user_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE INDEX idx_user_events_type ON public.user_events (event_type);
CREATE INDEX idx_user_events_session ON public.user_events (session_id);
CREATE INDEX idx_user_events_created ON public.user_events (created_at);
