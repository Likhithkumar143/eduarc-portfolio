-- Student details submitted through the public "Partner with us" form.
-- Server-only: inserts and reads go through server functions (reception session required to read).
CREATE TABLE public.partner_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 10 AND 15),
  whatsapp text NOT NULL CHECK (char_length(whatsapp) BETWEEN 10 AND 15),
  email text NOT NULL CHECK (char_length(email) BETWEEN 5 AND 255),
  college text NOT NULL CHECK (char_length(college) BETWEEN 2 AND 150),
  education text NOT NULL CHECK (char_length(education) BETWEEN 2 AND 100),
  status text CHECK (status IN ('done', 'contact_again', 'not_available')),
  status_updated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.partner_enquiries TO service_role;

ALTER TABLE public.partner_enquiries ENABLE ROW LEVEL SECURITY;

CREATE INDEX partner_enquiries_created_at_idx ON public.partner_enquiries (created_at DESC);

-- Reception desk credential (single row), set by the admin. Server-only.
CREATE TABLE public.reception_credentials (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  username text NOT NULL DEFAULT 'reception',
  password_hash text NOT NULL,
  salt text NOT NULL,
  iterations integer NOT NULL,
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.reception_credentials TO service_role;

ALTER TABLE public.reception_credentials ENABLE ROW LEVEL SECURITY;