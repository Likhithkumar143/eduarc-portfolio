import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { enquiriesQuery, receptionStatusQuery } from "@/lib/reception-queries";
import { receptionLogin } from "@/lib/enquiry.functions";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ReceptionDashboard } from "@/components/reception/ReceptionDashboard";

export const Route = createFileRoute("/reception")({
  loader: async ({ context }) => {
    const status = await context.queryClient.fetchQuery(receptionStatusQuery);
    if (status.authenticated) await context.queryClient.prefetchQuery(enquiriesQuery);
  },
  head: () => ({
    meta: [
      { title: "Reception Desk — EduArc" },
      {
        name: "description",
        content: "EduArc reception desk: student enquiries and counselling status.",
      },
      { property: "og:title", content: "Reception Desk — EduArc" },
      {
        property: "og:description",
        content: "Student enquiries and counselling status for the EduArc team.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ReceptionPage,
});

function ReceptionPage() {
  const { data } = useSuspenseQuery(receptionStatusQuery);
  return data.authenticated ? (
    <ReceptionDashboard />
  ) : (
    <AdminLogin
      title="Reception sign in"
      description="Enter the reception password to see student enquiries."
      action={receptionLogin}
      statusKey={receptionStatusQuery.queryKey}
    />
  );
}
