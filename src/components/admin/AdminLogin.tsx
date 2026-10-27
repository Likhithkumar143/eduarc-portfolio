import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { adminLogin } from "@/lib/admin.functions";
import { adminStatusQuery } from "@/lib/admin-status";
import { AmbientBlobs } from "@/components/site/Section";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFn = (opts: {
  data: { password: string };
}) => Promise<{ ok: true } | { ok: false; message: string }>;

export function AdminLogin({
  title = "Admin sign in",
  description = "Enter the admin password to manage your website.",
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
      setError(msg || "Couldn't sign in right now. Please check server configuration and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-gradient-soft px-5 py-16">
      <AmbientBlobs />
      <div className="animate-zoom-in w-full max-w-md">
        <div className="glass rounded-[2rem] p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <BrandLogo />
            <span className="glow-ring mt-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <LockKeyhole className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <h1 className="type-title mt-5 text-foreground">{title}</h1>
            <p className="mt-2 text-[15px] text-muted-foreground">{description}</p>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staff-password">Password</Label>
              <div className="relative">
                <Input
                  id="staff-password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl bg-background/70 pr-11 text-[16px]"
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {error && (
                <p role="alert" className="animate-rise text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
            <Button
              type="submit"
              variant="pill"
              size="pill"
              className="w-full"
              disabled={busy || !password}
            >
              {busy && <Loader2 className="animate-spin" />}
              Sign in
            </Button>
          </form>
        </div>
        <div className="mt-6 text-center">
          <Button asChild variant="text-link" size="inline" className="text-[15px]">
            <Link to="/">
              <ArrowLeft /> Back to website
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
