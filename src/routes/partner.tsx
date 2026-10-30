import { createFileRoute } from "@tanstack/react-router";
import { PartnerContent } from "@/components/site/sections/PartnerContent";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner With EDUARC — Career Guidance & Partnership" },
      {
        name: "description",
        content:
          "Submit your details for personalized career guidance, stream planning after Class 10/12, or institutional school partnerships.",
      },
      { property: "og:title", content: "Partner with EDUARC" },
      {
        property: "og:description",
        content:
          "Share your details and an EDUARC academic counsellor will reach out to guide you.",
      },
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
