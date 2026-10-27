import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { adminStatusQuery } from "@/lib/admin-status";
import { siteContentQuery } from "@/lib/site-content";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.fetchQuery(adminStatusQuery),
      context.queryClient.fetchQuery({ ...siteContentQuery, staleTime: 0 }),
    ]);
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard — EduArc" },
      {
        name: "description",
        content: "Sign in to manage EduArc website content, contact details and reception access.",
      },
      { property: "og:title", content: "Admin Dashboard — EduArc" },
      {
        property: "og:description",
        content: "Manage EduArc website content, contact details and reception access.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { data } = useSuspenseQuery(adminStatusQuery);
  return data.authenticated ? <AdminDashboard /> : <AdminLogin />;
}
