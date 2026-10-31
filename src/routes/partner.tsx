import { createFileRoute } from "@tanstack/react-router";
import { PartnerContent } from "@/components/site/sections/PartnerContent";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      {
        title: "Partner with EDUARC — School Partnerships & Student Guidance Enquiries",
      },
      {
        name: "description",
        content:
          "Submit your details for personalized student career counselling, stream planning after Class 10/12, or turnkey school and college guidance partnerships with EDUARC.",
      },
      {
        name: "keywords",
        content:
          "partner with EDUARC, school guidance partnership, college career seminar request, student guidance enquiry, institutional workshop booking, student career consultation",
      },
      { property: "og:title", content: "Partner with EDUARC — Institutional Guidance Cohorts" },
      {
        property: "og:description",
        content:
          "Share your details and an EDUARC academic counsellor will reach out with structured guidance for your school, college, or student.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/partner" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/partner" }],
  }),
  component: PartnerPage,
});

function PartnerPage() {
  return (
    <div className="min-h-screen bg-[#FEFAF1]">
      <PartnerContent />
    </div>
  );
}
