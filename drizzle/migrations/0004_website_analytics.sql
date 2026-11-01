-- Migration 0004: Essential Website Analytics
-- Stores privacy-conscious visitor events, pageviews, referrals, device categories, and CTA conversions.

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visitor_id text NOT NULL,
  event_type text NOT NULL, -- 'page_view', 'cta_click', 'contact_click', 'enquiry_submit'
  path text NOT NULL,
  referrer text,
  source text DEFAULT 'direct', -- 'direct', 'organic', 'referral', 'social'
  device_type text DEFAULT 'desktop', -- 'mobile', 'tablet', 'desktop'
  browser text DEFAULT 'other',
  os text DEFAULT 'other',
  country text DEFAULT 'IN',
  event_label text, -- e.g. 'cta:book_mentor', 'link:tel', 'link:email', 'form:partner_enquiry'
  duration_seconds integer DEFAULT 0,
  is_new_visitor boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indices for rapid querying in admin dashboard
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON public.analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_event_type_idx ON public.analytics_events (event_type);
CREATE INDEX IF NOT EXISTS analytics_events_path_idx ON public.analytics_events (path);
CREATE INDEX IF NOT EXISTS analytics_events_visitor_id_idx ON public.analytics_events (visitor_id);
CREATE INDEX IF NOT EXISTS analytics_events_session_id_idx ON public.analytics_events (session_id);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow public insert of analytics, read only for service role (admin)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'analytics_events' AND policyname = 'Allow public insert of analytics'
  ) THEN
    CREATE POLICY "Allow public insert of analytics" ON public.analytics_events
      FOR INSERT TO public
      WITH CHECK (true);
  END IF;
END $$;
