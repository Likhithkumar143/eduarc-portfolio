import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { adminLogin } from "@/lib/admin.functions";
import { adminStatusQuery } from "@/lib/admin-status";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type LoginFn = (opts: {
  data: { password: string };
}) => Promise<{ ok: true } | { ok: false; message: string }>;

export function AdminLogin({
  title = "Staff Sign In",
  description = "Enter the authorized password to access this workspace.",
  action = adminLogin,
  statusKey = adminStatusQuery.queryKey,
}: {
  title?: string;
  description?: string;
  action?: LoginFn;
  statusKey?: readonly unknown[];
}) {
  const login = useServerFn(action);
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password) return;
    setBusy(true);
    setError(null);
    try {
      const res = await login({ data: { password } });
      if (!res.ok) {
        setError(res.message);
        return;
      }
      await queryClient.invalidateQueries({ queryKey: statusKey });
    } catch (err) {
      console.error("Admin login error:", err);
      const msg = err instanceof Error ? err.message : "";
      setError(
        msg || "Couldn't sign in right now. Please check server configuration and try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-surface/50 px-5 py-16">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-3xl border border-hairline bg-white p-8 md:p-10 shadow-lift">
          <div className="flex flex-col items-center text-center">
            <BrandLogo />
            <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy text-brand-gold shadow-sm">
              <LockKeyhole className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-navy mt-4">{title}</h1>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-xs">
              {description}
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="staff-password" className="text-xs font-semibold text-brand-navy">
                  Access Password
                </Label>
                <Badge variant="gold" className="text-[10px] py-0 px-2">
                  Encrypted Session
                </Badge>
              </div>
              <div className="relative">
                <Input
                  id="staff-password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl border-hairline bg-surface/40 pr-11 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-brand-gold"
                  aria-invalid={!!error}
                  placeholder="Enter staff password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-brand-navy transition-colors cursor-pointer"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <p role="alert" className="mt-2 text-xs text-destructive font-medium">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="pill-gold"
              size="pill"
              className="w-full text-sm font-bold justify-center mt-2"
              disabled={busy || !password}
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying Credentials...
                </>
              ) : (
                "Authenticate & Open Workspace"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-gold shrink-0" />
            <span>Authenticated via secure HTTP-only session cookie</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Button asChild variant="pill-outline" size="pill-sm" className="bg-white/80">
            <Link to="/" className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Public Website</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
