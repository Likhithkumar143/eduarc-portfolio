-- Migration 0003: Privacy Policy consent and optional marketing communication preferences
-- Preserves all existing records and schema; adds nullable/defaulted consent columns.

ALTER TABLE public.partner_enquiries
  ADD COLUMN IF NOT EXISTS consent_given boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS consent_timestamp timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS consent_version text DEFAULT '2026.1',
  ADD COLUMN IF NOT EXISTS marketing_consent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS marketing_consent_timestamp timestamptz;

-- Backfill legacy records to reflect implicit consent at time of their enquiry submission
UPDATE public.partner_enquiries
SET
  consent_given = true,
  consent_timestamp = created_at,
  consent_version = 'legacy'
WHERE consent_timestamp IS NULL;

-- Create index for filtering marketing communications consent in reception / exports
CREATE INDEX IF NOT EXISTS partner_enquiries_marketing_consent_idx ON public.partner_enquiries (marketing_consent);

