import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminSetReceptionPassword, getReceptionAccess } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Panel, TextField } from "./fields";

const MIN = 8;

export function ReceptionAccessPanel() {
  const queryClient = useQueryClient();
  const fetchInfo = useServerFn(getReceptionAccess);
  const setPassword = useServerFn(adminSetReceptionPassword);
  const info = useQuery({ queryKey: ["reception-access"], queryFn: () => fetchInfo() });

  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (next.length < MIN) return setError(`Use at least ${MIN} characters.`);
    if (next !== confirm) return setError("The passwords don't match.");
    setBusy(true);
    try {
      const res = await setPassword({ data: { newPassword: next } });
      if (!res.ok) return setError(res.message);
      setNext("");
      setConfirm("");
      toast.success("Reception password saved");
      await queryClient.invalidateQueries({ queryKey: ["reception-access"] });
    } catch {
      setError("Couldn't save the password. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const configured = info.data?.configured;

  return (
    <div className="space-y-6">
      <Panel
        title={configured ? "Reset reception password" : "Set up reception access"}
        description="The reception desk signs in with its own password to see student details and update counselling status."
        className="max-w-xl"
      >
        <div className="flex items-center gap-2 rounded-xl bg-background/60 px-4 py-3 text-[14px]">
          {info.isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : configured ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-foreground">Reception access is active.</span>
            </>
          ) : (
            <span className="text-muted-foreground">
              No reception password yet — reception can't sign in.
            </span>
          )}
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <TextField
            label="New reception password"
            type="password"
            value={next}
            onChange={setNext}
            hint={`At least ${MIN} characters. Saving signs out anyone currently signed in at reception.`}
          />
          <TextField
            label="Confirm password"
            type="password"
            value={confirm}
            onChange={setConfirm}
          />
          {error && (
            <p role="alert" className="animate-rise text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-5">
            <Button type="submit" variant="pill" size="pill" disabled={busy || !next || !confirm}>
              {busy && <Loader2 className="animate-spin" />}
              Save reception password
            </Button>
            <Button asChild variant="text-link" size="inline">
              <a href="/reception" target="_blank" rel="noreferrer">
                Open reception desk <ExternalLink />
              </a>
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
