import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/impact")({
  beforeLoad: () => {
    throw redirect({ to: "/testimonials", statusCode: 301 });
  },
});
