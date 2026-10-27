import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/mentor")({
  beforeLoad: () => {
    throw redirect({ to: "/mentors" });
  },
});
