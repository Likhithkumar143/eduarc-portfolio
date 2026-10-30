import { createFileRoute } from "@tanstack/react-router";
import { ProgramsSection } from "@/components/site/sections/ProgramsSection";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Our Programs — EDUARC Connect" },
      {
        name: "description",
        content:
          "Explore the career guidance sessions, workshops and seminars conducted by EDUARC at various schools and colleges across India.",
      },
      { property: "og:title", content: "Our Programs — EDUARC Connect" },
      {
        property: "og:description",
        content:
          "Explore the career guidance sessions, workshops and seminars conducted by EDUARC at various schools and colleges.",
      },
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
