// Content model + defaults for the EduArc site. The admin dashboard saves edits to the
// database; pages read the merged result through `useSiteContent()`.
import { z } from "zod";

export const iconNames = [
  "route",
  "users",
  "compass",
  "shield",
  "map",
  "video",
  "user",
  "award",
  "bell",
  "layout",
  "graduation",
  "chart",
  "headset",
  "sparkles",
  "trending",
  "network",
  "building",
] as const;

const str = z.string().max(2000);
const iconItem = z.object({ icon: z.enum(iconNames), title: str, body: str });
const textItem = z.object({ title: str, body: str });

export const siteContentSchema = z.object({
  brand: z.object({ tagline: str, footerBlurb: str }),
  contact: z.object({ email: str, phone: str, website: str }),
  home: z.object({
    eyebrow: str,
    title: str,
    titleHighlight: str,
    lead: str,
    missionTitle: str,
    missionLead: str,
    quote: str,
    quoteHighlight: str,
    quoteSub: str,
    bannerTitle: str,
  }),
  about: z.object({
    title: str,
    lead: str,
    goal: str,
    advantagesTitle: str,
    advantagesLead: str,
    quote: str,
  }),
  pillars: z.array(iconItem).max(12),
  advantages: z.array(textItem).max(12),
  featuresPage: z.object({
    title: str,
    titleHighlight: str,
    lead: str,
    devicesTitle: str,
    devicesLead: str,
  }),
  features: z.array(iconItem).max(18),
  programsPage: z.object({
    title: str,
    lead: str,
    idealForTitle: str,
    processTitle: str,
    processLead: str,
  }),
  offers: z.array(iconItem).max(12),
  idealFor: z.array(str).max(20),
  steps: z.array(textItem).max(12),
  impactPage: z.object({ title: str, lead: str }),
  impacts: z.array(iconItem).max(12),
  testimonials: z.array(z.object({ quote: str, name: str, role: str })).max(12),
  contactPage: z.object({ title: str, titleHighlight: str, lead: str, thankYou: str }),
  cta: z.object({ title: str, lead: str }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type IconName = (typeof iconNames)[number];

export const defaultContent: SiteContent = {
  brand: {
    tagline: "Ambitious to Achievement",
    footerBlurb: "Career guidance and education support for schools and colleges.",
  },
  contact: {
    email: "partnerships@eduarc.in",
    phone: "+91 98765 43210",
    website: "www.eduarc.in",
  },
  home: {
    eyebrow: "Ambitious to Achievement",
    title: "Empowering students for a",
    titleHighlight: "brighter future.",
    lead: "Career guidance & education support platform for schools and colleges. Help students discover their potential, explore career paths and build a successful future.",
    missionTitle: "Guidance that meets every student where they are.",
    missionLead:
      "EduArc is a next‑generation education guidance platform that helps students make informed decisions about their academic and career journey.",
    quote: "Guidance today,",
    quoteHighlight: "success tomorrow.",
    quoteSub: "Our goal is simple — every student deserves the right guidance.",
    bannerTitle: "Right guidance today. Greater opportunities tomorrow.",
  },
  about: {
    title: "About EduArc.",
    lead: "EduArc is a next‑generation education guidance platform that helps students make informed decisions about their academic and career journey.",
    goal: "Our goal is simple — every student deserves the right guidance.",
    advantagesTitle: "Why partner with EduArc.",
    advantagesLead:
      "EduArc gives your institution the tools to support students beyond the classroom — with structured guidance, expert mentorship and real‑world career insights.",
    quote: "Guidance today, success tomorrow.",
  },
  pillars: [
    {
      icon: "route",
      title: "Personalized Roadmaps",
      body: "Structured guidance from 10th to career, tailored to each student's goals.",
    },
    {
      icon: "users",
      title: "Expert Mentors",
      body: "Connect with industry experts and experienced mentors for real career insights.",
    },
    {
      icon: "compass",
      title: "Skill & Career Exploration",
      body: "Discover your interests, explore career paths and build the right skills.",
    },
    {
      icon: "shield",
      title: "Trusted & Secure",
      body: "Built on secure infrastructure for safe data, privacy and reliable performance.",
    },
  ],
  advantages: [
    {
      title: "Enhance Student Success",
      body: "Better guidance leads to higher engagement, stronger performance and improved outcomes.",
    },
    {
      title: "Reduce Career Confusion",
      body: "Help students make informed decisions with expert advice and personalized roadmaps.",
    },
    {
      title: "Strengthen Institutional Reputation",
      body: "Showcase your commitment to student career growth and holistic development.",
    },
    {
      title: "Build Future‑Ready Students",
      body: "Prepare them with the right skills, knowledge and confidence for tomorrow's opportunities.",
    },
  ],
  featuresPage: {
    title: "A complete ecosystem.",
    titleHighlight: "For every student.",
    lead: "Designed to guide, support and empower students — and give institutions full visibility.",
    devicesTitle: "Accessible on all devices.",
    devicesLead:
      "Desktop, tablet and mobile — students and staff stay connected wherever they are.",
  },
  features: [
    {
      icon: "map",
      title: "Career Roadmaps",
      body: "Structured learning paths from 10th to higher education.",
    },
    {
      icon: "video",
      title: "Mentor Sessions",
      body: "Expert guidance through one‑on‑one and group sessions.",
    },
    {
      icon: "user",
      title: "Profile & Progress",
      body: "Track profile completion and set personal goals.",
    },
    { icon: "award", title: "Certificates", body: "Earn and download completion certificates." },
    {
      icon: "bell",
      title: "Notifications",
      body: "Stay updated with important alerts and opportunities.",
    },
    {
      icon: "layout",
      title: "Admin Dashboard",
      body: "Complete control for school and college administrators.",
    },
  ],
  programsPage: {
    title: "Programs for schools & colleges.",
    lead: "We offer flexible partnership models designed to meet the unique needs of your institution.",
    idealForTitle: "Every stage of the student journey.",
    processTitle: "Implementation process.",
    processLead: "Get started quickly with our simple 4‑step process.",
  },
  offers: [
    {
      icon: "graduation",
      title: "Student Access",
      body: "All enrolled students get access to EduArc's full suite of features.",
    },
    {
      icon: "chart",
      title: "Institution Dashboard",
      body: "Principals and counsellors can monitor usage, progress and outcomes.",
    },
    {
      icon: "headset",
      title: "Dedicated Support",
      body: "Account manager and technical support for smooth implementation.",
    },
  ],
  idealFor: [
    "High Schools (10th & 12th)",
    "Pre‑University Colleges (PUC)",
    "Degree Colleges",
    "Professional & Technical Institutions",
  ],
  steps: [
    {
      title: "Initial Consultation",
      body: "Discuss your institution's needs and the right partnership model.",
    },
    {
      title: "Setup & Customization",
      body: "Configure your institution details, branding and user access.",
    },
    {
      title: "Training & Launch",
      body: "Train your team and students, then go live with full support.",
    },
    { title: "Ongoing Support", body: "We provide continuous assistance and updates." },
  ],
  impactPage: {
    title: "Impact for your institution.",
    lead: "EduArc helps institutions create a more focused, engaged and future‑ready student community.",
  },
  impacts: [
    {
      icon: "sparkles",
      title: "Higher Student Engagement",
      body: "More active participation in learning and career planning.",
    },
    {
      icon: "trending",
      title: "Improved Academic Outcomes",
      body: "Better decision‑making leads to higher success rates.",
    },
    {
      icon: "network",
      title: "Stronger Alumni Network",
      body: "Students build lasting connections with mentors and industry experts.",
    },
    {
      icon: "building",
      title: "Institutional Growth",
      body: "Enhanced reputation and increased admissions through better results.",
    },
  ],
  testimonials: [
    {
      quote:
        "EduArc has been a game‑changer for our students. The structured roadmaps and mentor sessions have helped them gain clarity and confidence about their future.",
      name: "Dr. R. Sharma",
      role: "Principal, Sunrise PU College",
    },
    {
      quote:
        "The platform is easy to use, well‑designed and provides real value for our students. We highly recommend EduArc to other institutions.",
      name: "Ms. Priya Nair",
      role: "Principal, Green Valley High School",
    },
  ],
  contactPage: {
    title: "Let's build a brighter future",
    titleHighlight: "together.",
    lead: "Partner with EduArc and give your students the guidance, mentorship and opportunities they deserve.",
    thankYou:
      "For your time and consideration. Together, let's empower more students to achieve their dreams.",
  },
  cta: {
    title: "Let's build a brighter future together.",
    lead: "Partner with EduArc and give your students the guidance, mentorship and opportunities they deserve.",
  },
};

/** Saved data is layered over defaults per section so new fields always have a value. */
export function mergeContent(saved: unknown): SiteContent {
  if (!saved || typeof saved !== "object") return defaultContent;
  const merged: Record<string, unknown> = { ...defaultContent };
  for (const [key, def] of Object.entries(defaultContent)) {
    const value = (saved as Record<string, unknown>)[key];
    if (value === undefined || value === null) continue;
    merged[key] =
      Array.isArray(def) || typeof def !== "object" ? value : { ...def, ...(value as object) };
  }
  const parsed = siteContentSchema.safeParse(merged);
  return parsed.success ? parsed.data : defaultContent;
}

export const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const websiteHref = (site: string) =>
  /^https?:\/\//i.test(site) ? site : `https://${site}`;
export const initials = (name: string) =>
  name
    .replace(/^(dr|mr|mrs|ms|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
