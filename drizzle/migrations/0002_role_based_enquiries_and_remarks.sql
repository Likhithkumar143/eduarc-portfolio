-- Migration 0002: Add role selection, remarks, and role-specific fields to partner_enquiries
-- Server-only: inserts and reads go through server functions (reception session required to read).

ALTER TABLE public.partner_enquiries
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'Unknown',
  ADD COLUMN IF NOT EXISTS child_name text,
  ADD COLUMN IF NOT EXISTS designation text,
  ADD COLUMN IF NOT EXISTS mentor_expertise text,
  ADD COLUMN IF NOT EXISTS remarks text;

-- Drop check constraint on status if it exists and update to support new statuses
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'partner_enquiries_status_check'
  ) THEN
    ALTER TABLE public.partner_enquiries DROP CONSTRAINT partner_enquiries_status_check;
  END IF;
END $$;

ALTER TABLE public.partner_enquiries
  ADD CONSTRAINT partner_enquiries_status_check
  CHECK (status IS NULL OR status IN ('done', 'contact_again', 'not_available', 'contacted', 'follow_up', 'resolved'));

-- Make college and education nullable so student/parent/mentor forms without institution aren't blocked
ALTER TABLE public.partner_enquiries ALTER COLUMN college DROP NOT NULL;
ALTER TABLE public.partner_enquiries ALTER COLUMN education DROP NOT NULL;

-- Backfill any existing NULL roles as 'Unknown'
UPDATE public.partner_enquiries SET role = 'Unknown' WHERE role IS NULL;

-- Create index on role for fast filtering in reception dashboard
CREATE INDEX IF NOT EXISTS partner_enquiries_role_idx ON public.partner_enquiries (role);

