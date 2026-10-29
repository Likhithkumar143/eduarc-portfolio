import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportError } from "../lib/error-reporting";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { siteContentQuery } from "@/lib/site-content";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center p-8 rounded-2xl border border-hairline bg-surface/50">
        <span className="type-eyebrow text-brand-gold">Error 404</span>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-brand-navy">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The requested page could not be located. It may have been moved or updated.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild variant="pill-gold" size="pill-sm">
            <Link to="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center p-8 rounded-2xl border border-hairline bg-surface/50">
        <span className="type-eyebrow text-destructive">Application Notice</span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-brand-navy">
          Unable to display this view
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We encountered an unexpected condition. Please refresh the page or return to the main
          portal.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            variant="pill"
            size="pill-sm"
          >
            Retry
          </Button>
          <Button asChild variant="pill-outline" size="pill-sm">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EDUARC — Education & Career Guidance Platform" },
      {
        name: "description",
        content:
          "EDUARC connects schools, colleges, and students with structured career roadmaps, verified academic mentorship, and future-ready guidance.",
      },
      { name: "author", content: "EDUARC" },
      { name: "theme-color", content: "#142744" },
      { property: "og:site_name", content: "EDUARC" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-brand-gold-soft selection:text-brand-navy">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-navy focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
        >
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isAdmin = useRouterState({
    select: (s) => /^\/(admin|reception)(\/|$)/.test(s.location.pathname),
  });

  return (
    <QueryClientProvider client={queryClient}>
      {!isAdmin && <SiteHeader />}
      <main id="main-content" className="flex-1 focus:outline-none">
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      {!isAdmin && <SiteFooter />}
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
