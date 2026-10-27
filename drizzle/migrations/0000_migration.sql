-- Editable website content (single row, public read; writes only via server with admin session)
CREATE TABLE public.site_content (
  id text PRIMARY KEY DEFAULT 'main',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon, authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Site content is publicly readable"
ON public.site_content
FOR SELECT
TO anon, authenticated
USING (true);

-- Admin credential (single row). Server-only: no anon/authenticated access at all.
CREATE TABLE public.admin_credentials (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  username text NOT NULL DEFAULT 'eduarc',
  password_hash text NOT NULL,
  salt text NOT NULL,
  iterations integer NOT NULL,
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_credentials TO service_role;

ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;
