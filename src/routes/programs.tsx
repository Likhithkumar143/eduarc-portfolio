import { createFileRoute } from "@tanstack/react-router";
import { ProgramsSection } from "@/components/site/sections/ProgramsSection";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Career Guidance Programs & School Workshops — EDUARC" },
      {
        name: "description",
        content:
          "Explore the career guidance sessions, student workshops, and institutional seminars conducted by EDUARC at leading schools and colleges across India.",
      },
      {
        name: "keywords",
        content:
          "school career workshops, college career guidance seminars, student guidance programs, career counselling sessions, STEM career guidance, commerce stream workshops, EDUARC programs",
      },
      { property: "og:title", content: "Career Guidance Programs & School Workshops — EDUARC" },
      {
        property: "og:description",
        content:
          "Documented career guidance sessions, student workshops, and institutional seminars conducted by EDUARC across India.",
      },
      { property: "og:url", content: "https://eduarc-connect.in/programs" },
      { property: "og:image", content: "https://eduarc-connect.in/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://eduarc-connect.in/og-image.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://eduarc-connect.in/programs" }],
  }),
  component: ProgramsPage,
});

function ProgramsPage() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <ProgramsSection />
    </div>
  );
}
