import { useId, useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitEnquiry } from "@/lib/enquiry.functions";
import { enquirySchema, type EnquiryInput } from "@/lib/enquiry";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<keyof EnquiryInput, string>>;

const empty: EnquiryInput = {
  fullName: "",
  phone: "",
  whatsapp: "",
  email: "",
  college: "",
  education: "",
};

function validate(values: EnquiryInput): Errors {
  const r = enquirySchema.safeParse(values);
  if (r.success) return {};
  const errors: Errors = {};
  for (const issue of r.error.issues) {
    const key = issue.path[0] as keyof EnquiryInput;
    errors[key] ??= issue.message;
  }
  return errors;
}

export function PartnerForm() {
  const submit = useServerFn(submitEnquiry);
  const [values, setValues] = useState<EnquiryInput>(empty);
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<keyof EnquiryInput, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [doneName, setDoneName] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  const effective: EnquiryInput = {
    ...values,
    whatsapp: sameAsPhone ? values.phone : values.whatsapp,
  };
  const errors = validate(effective);
  const show = (k: keyof EnquiryInput) => (submitted || touched[k] ? errors[k] : undefined);

  const set = (k: keyof EnquiryInput) => (v: string) => setValues((s) => ({ ...s, [k]: v }));
  const blur = (k: keyof EnquiryInput) => () => setTouched((t) => ({ ...t, [k]: true }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    if (Object.keys(errors).length > 0) return;
    setBusy(true);
    try {
      await submit({ data: { ...effective, website: honeypot } });
      setDoneName(effective.fullName.trim().split(/\s+/)[0] ?? "");
      setValues(empty);
      setSameAsPhone(false);
      setTouched({});
      setSubmitted(false);
    } catch {
      setServerError("Couldn't send your details right now. Please try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  if (doneName !== null) {
    return (
      <div className="glass animate-zoom-in rounded-[2rem] p-10 text-center md:p-14" role="status">
        <span className="glow-ring mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 className="h-8 w-8" strokeWidth={1.75} />
        </span>
        <h2 className="type-title mt-6 text-foreground">
          Thank you{doneName ? `, ${doneName}` : ""}.
        </h2>
        <p className="type-lead mx-auto mt-3 max-w-md text-muted-foreground">
          We've received your details. Our counselling team will contact you soon.
        </p>
        <Button
          variant="pill-outline"
          size="pill"
          className="mt-8"
          onClick={() => setDoneName(null)}
        >
          Submit another response
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="glass rounded-[2rem] p-7 md:p-10"
      aria-label="Partner with us"
    >
      <h2 className="type-title text-foreground">Your details</h2>
      <p className="mt-2 text-[15px] text-muted-foreground">All fields are required.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Field label="Full name" error={show("fullName")} className="md:col-span-2">
          {(id, invalid) => (
            <Input
              id={id}
              autoComplete="name"
              value={values.fullName}
              onChange={(e) => set("fullName")(e.target.value)}
              onBlur={blur("fullName")}
              aria-invalid={invalid}
              maxLength={100}
              className={inputClass}
              placeholder="e.g. Ananya Rao"
            />
          )}
        </Field>

        <Field label="Contact number" error={show("phone")}>
          {(id, invalid) => (
            <PhoneInput
              id={id}
              value={values.phone}
              onChange={set("phone")}
              onBlur={blur("phone")}
              invalid={invalid}
            />
          )}
        </Field>

        <Field label="WhatsApp number" error={sameAsPhone ? undefined : show("whatsapp")}>
          {(id, invalid) => (
            <PhoneInput
              id={id}
              value={sameAsPhone ? values.phone : values.whatsapp}
              onChange={set("whatsapp")}
              onBlur={blur("whatsapp")}
              invalid={invalid}
              disabled={sameAsPhone}
            />
          )}
        </Field>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-hairline bg-background/60 px-4 py-3 text-[14px] text-foreground transition-colors hover:bg-background/90 md:col-span-2">
          <Checkbox checked={sameAsPhone} onCheckedChange={(v) => setSameAsPhone(v === true)} />
          WhatsApp number is the same as my contact number
        </label>

        <Field label="Email ID" error={show("email")} className="md:col-span-2">
          {(id, invalid) => (
            <Input
              id={id}
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={(e) => set("email")(e.target.value)}
              onBlur={blur("email")}
              aria-invalid={invalid}
              maxLength={255}
              className={inputClass}
              placeholder="you@example.com"
            />
          )}
        </Field>

        <Field label="College name" error={show("college")}>
          {(id, invalid) => (
            <Input
              id={id}
              autoComplete="organization"
              value={values.college}
              onChange={(e) => set("college")(e.target.value)}
              onBlur={blur("college")}
              aria-invalid={invalid}
              maxLength={150}
              className={inputClass}
              placeholder="e.g. Sunrise PU College"
            />
          )}
        </Field>

        <Field label="Education" error={show("education")}>
          {(id, invalid) => (
            <Input
              id={id}
              value={values.education}
              onChange={(e) => set("education")(e.target.value)}
              onBlur={blur("education")}
              aria-invalid={invalid}
              maxLength={100}
              className={inputClass}
              placeholder="e.g. 12th / PUC, B.Com 2nd year"
            />
          )}
        </Field>

        {/* Hidden from people; catches bots. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {serverError && (
        <p role="alert" className="animate-rise mt-5 text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" variant="pill" size="pill" className="mt-8 w-full" disabled={busy}>
        {busy ? <Loader2 className="animate-spin" /> : <Send />}
        Submit details
      </Button>
      <p className="mt-4 text-center text-[12px] text-muted-foreground">
        By submitting, you agree to be contacted by EduArc about counselling.
      </p>
    </form>
  );
}

const inputClass = "h-12 rounded-xl bg-background/70 text-[16px]";

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error: string | undefined;
  className?: string;
  children: (id: string, invalid: boolean) => ReactNode;
}) {
  const id = useId();
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-[13px] font-medium text-foreground">
        {label}
      </Label>
      {children(id, !!error)}
      {error && <p className="animate-rise text-[13px] text-destructive">{error}</p>}
    </div>
  );
}

function PhoneInput({
  id,
  value,
  onChange,
  onBlur,
  invalid,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  invalid: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[16px] text-muted-foreground">
        +91
      </span>
      <Input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d+\s-]/g, "").slice(0, 16))}
        onBlur={onBlur}
        aria-invalid={invalid}
        disabled={disabled}
        className={cn(inputClass, "pl-12 disabled:opacity-70")}
        placeholder="98765 43210"
      />
    </div>
  );
}
