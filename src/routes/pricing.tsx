import { createFileRoute, redirect } from "@tanstack/react-router";

// Pricing was removed from the site; keep the old address working by sending visitors home.
export const Route = createFileRoute("/pricing")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
