import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { changeAdminPassword } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Panel, TextField } from "./fields";

const MIN = 8;

type ChangeFn = (opts: {
  data: { currentPassword: string; newPassword: string };
}) => Promise<{ ok: true } | { ok: false; message: string }>;

export function PasswordPanel({
  title = "Change admin password",
  action = changeAdminPassword,
}: {
  title?: string;
  action?: ChangeFn;
}) {
  const change = useServerFn(action);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setDone(false);
    if (next.length < MIN) return setError(`Use at least ${MIN} characters.`);
    if (next !== confirm) return setError("The new passwords don't match.");
    if (next === current) return setError("Choose a password different from the current one.");
    setBusy(true);
    try {
      const res = await change({ data: { currentPassword: current, newPassword: next } });
      if (!res.ok) return setError(res.message);
      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
      toast.success("Password updated");
    } catch {
      setError("Couldn't update the password. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel
      title={title}
      description="Other signed‑in devices will be signed out after the change."
      className="max-w-xl"
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <TextField label="Current password" type="password" value={current} onChange={setCurrent} />
        <TextField
          label="New password"
          type="password"
          value={next}
          onChange={setNext}
          hint={`At least ${MIN} characters.`}
        />
        <TextField
          label="Confirm new password"
          type="password"
          value={confirm}
          onChange={setConfirm}
        />
        {error && (
          <p role="alert" className="animate-rise text-sm text-destructive">
            {error}
          </p>
        )}
        {done && (
          <p className="animate-rise flex items-center gap-2 text-sm text-brand">
            <CheckCircle2 className="h-4 w-4" /> Your password has been changed.
          </p>
        )}
        <Button
          type="submit"
          variant="pill"
          size="pill"
          disabled={busy || !current || !next || !confirm}
        >
          {busy && <Loader2 className="animate-spin" />}
          Update password
        </Button>
      </form>
    </Panel>
  );
}
