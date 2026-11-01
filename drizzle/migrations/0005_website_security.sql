-- Migration 0005: Website Security Monitoring & Threat Defense System
-- Creates tables for security incident logging and IP blocklist management.

CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  event_type text NOT NULL, -- 'failed_login', 'rate_limit_exceeded', 'sql_injection_attempt', 'xss_attempt', 'probing_attempt', 'unauthorized_access', 'bot_abuse', 'suspicious_request'
  severity text NOT NULL,   -- 'low', 'medium', 'high', 'critical'
  description text NOT NULL,
  path text NOT NULL,
  method text NOT NULL DEFAULT 'GET',
  status_code integer NOT NULL DEFAULT 200,
  user_agent text,
  country text DEFAULT 'IN',
  action_taken text NOT NULL DEFAULT 'logged', -- 'logged', 'blocked', 'rate_limited', 'locked_out'
  details jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indices for rapid querying and IP forensics in admin dashboard
CREATE INDEX IF NOT EXISTS security_events_created_at_idx ON public.security_events (created_at DESC);
CREATE INDEX IF NOT EXISTS security_events_ip_idx ON public.security_events (ip);
CREATE INDEX IF NOT EXISTS security_events_event_type_idx ON public.security_events (event_type);
CREATE INDEX IF NOT EXISTS security_events_severity_idx ON public.security_events (severity);

-- Table for temporary and permanent blocked IP addresses
CREATE TABLE IF NOT EXISTS public.blocked_ips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL UNIQUE,
  reason text NOT NULL,
  severity text NOT NULL DEFAULT 'high',
  blocked_by text NOT NULL DEFAULT 'system', -- 'system' | 'admin'
  expires_at timestamptz,                   -- NULL = permanent, or timestamp for auto-expiry
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blocked_ips_ip_idx ON public.blocked_ips (ip);
CREATE INDEX IF NOT EXISTS blocked_ips_expires_at_idx ON public.blocked_ips (expires_at);

-- Enable Row Level Security
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;

-- Allow public insert of security events, but read strictly restricted to service role (admin)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'security_events' AND policyname = 'Allow public insert of security events'
  ) THEN
    CREATE POLICY "Allow public insert of security events" ON public.security_events
      FOR INSERT TO public
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blocked_ips' AND policyname = 'Allow public read of blocked ips'
  ) THEN
    CREATE POLICY "Allow public read of blocked ips" ON public.blocked_ips
      FOR SELECT TO public
      USING (true);
  END IF;
END $$;
