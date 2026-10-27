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

export const mentorGuideStepSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(1000),
});

export const mentorReasonSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(1000),
});

export const mentorBeneficiarySchema = z.object({
  target: z.string().max(200),
  benefit: z.string().max(1000),
});

export const mentorImpactMetricSchema = z.object({
  label: z.string().max(200),
  value: z.string().max(100),
});

export const mentorCardStatSchema = z.object({
  label: z.string().max(50),
  value: z.string().max(50),
});

export const mentorProfileSchema = z.object({
  id: z.string().max(100),
  name: z.string().max(200),
  role: z.string().max(200).default("Career Guidance & Student Counselling Mentor"),
  designation: z.string().max(250),
  location: z.string().max(200),
  email: z.string().max(200),
  imageUrl: z.string().max(2_000_000).default(""),
  shortBio: z.string().max(400).default(""),
  cardStats: z.array(mentorCardStatSchema).default([]),
  about: z.string().max(5000),
  howICanGuide: z.array(mentorGuideStepSchema).default([]),
  whyConnect: z.array(mentorReasonSchema).default([]),
  whoCanBenefit: z.array(mentorBeneficiarySchema).default([]),
  impactNotice: z
    .string()
    .max(500)
    .default("Verified EDUARC activity metrics can be added as the programme grows."),
  impactMetrics: z.array(mentorImpactMetricSchema).default([]),
  message: z.string().max(5000),
  tagline: z
    .string()
    .max(300)
    .default("Learn with direction. Grow with confidence. Build your future with EDUARC."),
});

export type MentorProfile = z.infer<typeof mentorProfileSchema>;
export type MentorGuideStep = z.infer<typeof mentorGuideStepSchema>;
export type MentorReason = z.infer<typeof mentorReasonSchema>;
export type MentorBeneficiary = z.infer<typeof mentorBeneficiarySchema>;
export type MentorImpactMetric = z.infer<typeof mentorImpactMetricSchema>;
export type MentorCardStat = z.infer<typeof mentorCardStatSchema>;

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
  mentors: z.array(mentorProfileSchema).default([]),
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
  mentors: [
    {
      id: "dr-gayathri-g-n",
      name: "Dr. Gayathri G N",
      role: "Career Guidance & Student Counselling Mentor",
      designation: "Associate Professor · Ph.D. in Computer Science & Engineering",
      location: "Tumkur, Karnataka, India",
      email: "gaytri.infosea@gmail.com",
      imageUrl: "",
      shortBio:
        "Helping students move from confusion to clarity with informed academic choices and future career roadmaps.",
      cardStats: [
        { label: "Experience", value: "7+ Yrs" },
        { label: "Research", value: "6 Pubs" },
        { label: "Education", value: "Ph.D." },
      ],
      about:
        "Choosing the right career path after Class 10 or Class 12 can be challenging for students and parents. With so many courses, streams, and career opportunities available, finding the right direction can make all the difference.\n\nDr. Gayathri G N is an experienced academician with over 7 years of experience in teaching, student mentoring, academic assessment, and research guidance.\n\nThrough EDUARC, she aims to help students discover their interests, explore suitable career options, make informed academic decisions, and build a clear roadmap for their future.\n\nWith her academic and research background, she brings an informed perspective to higher education, emerging career opportunities, and long-term academic planning.\n\nHer goal is simple: to help students move from confusion to clarity and make confident decisions about their future, with parents feeling informed and supported throughout the journey.",
      howICanGuide: [
        {
          title: "Discover Your Career",
          description:
            "Understand your interests, recognise your strengths, and explore career options that align with your aspirations.",
        },
        {
          title: "Choose the Right Stream",
          description:
            "Explore Science, Commerce, and Humanities after Class 10 and understand which pathways may suit your interests and future goals.",
        },
        {
          title: "Find the Right Course",
          description:
            "Discover degree programmes, college options, and educational pathways after Class 12.",
        },
        {
          title: "Build Your Career Roadmap",
          description:
            "Get a clearer plan for your next academic steps, skill development, and future career exploration.",
        },
        {
          title: "Explore Future Opportunities",
          description:
            "Discover emerging careers, new industries, and opportunities beyond the options you already know.",
        },
        {
          title: "Guidance for Students & Parents",
          description:
            "Make informed education decisions through supportive discussions about academic choices, career possibilities, and future goals.",
        },
      ],
      whyConnect: [
        {
          title: "7+ Years of Academic Experience",
          description: "Teaching, student mentoring, and academic guidance.",
        },
        {
          title: "Ph.D. in Computer Science & Engineering",
          description: "A strong academic foundation and understanding of higher education.",
        },
        {
          title: "Research Experience",
          description:
            "6 research publications across cloud security, cryptography, computer networks, and machine learning.",
        },
        {
          title: "Student-Focused Guidance",
          description:
            "Support for exploring interests, evaluating options, and planning future learning.",
        },
        {
          title: "A Wider View of Opportunities",
          description:
            "Academic and research experience that helps introduce students to emerging technology fields and higher education possibilities.",
        },
      ],
      whoCanBenefit: [
        {
          target: "Class 10 Students",
          benefit: "Explore streams and plan the next stage of education.",
        },
        {
          target: "Class 12 Students",
          benefit: "Understand undergraduate courses and future career pathways.",
        },
        {
          target: "Parents",
          benefit: "Gain clarity about available academic options and support their children's decisions.",
        },
        {
          target: "Students Exploring Their Future",
          benefit: "Discover opportunities, set goals, and identify useful next steps.",
        },
      ],
      impactNotice: "Verified EDUARC activity metrics can be added as the programme grows.",
      impactMetrics: [
        { label: "Students counselled", value: "To be updated" },
        { label: "Counselling sessions completed", value: "To be updated" },
        { label: "Career awareness workshops conducted", value: "To be updated" },
        { label: "Schools associated", value: "To be updated" },
        { label: "Colleges associated", value: "To be updated" },
      ],
      message:
        "Every student has different interests, strengths, and dreams. Choosing a career should not be about following the crowd, but about understanding the possibilities and making informed decisions.\n\nMy aim is to help students explore their options, identify a suitable direction, and approach their academic journey with greater clarity and confidence. I also believe parents play an important role in this process, and the right guidance can help families make decisions together.\n\nThrough EDUARC, let us turn career confusion into clarity and possibilities into purposeful action.",
      tagline: "Learn with direction. Grow with confidence. Build your future with EDUARC.",
    },
  ],
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
  if (parsed.success) return parsed.data;

  // If saved mentors failed validation due to old schema, fall back to updated default mentors
  if (merged.mentors) {
    const fallback = { ...merged, mentors: defaultContent.mentors };
    const retry = siteContentSchema.safeParse(fallback);
    if (retry.success) return retry.data;
  }
  return defaultContent;
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
