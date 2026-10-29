import type { ReactNode } from "react";
import type { SiteContent } from "@/content/eduarc";
import { IconSelect, ListEditor, ObjectFields, Panel, StringList, TextField } from "./fields";

type Update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
export type EditorProps = {
  draft: SiteContent;
  update: Update;
  onSave?: (explicitDraft?: SiteContent) => Promise<void>;
  isSaving?: boolean;
};

type IconItem = SiteContent["features"][number];
type TextItem = SiteContent["steps"][number];

function IconItems({
  label,
  items,
  onChange,
  max,
}: {
  label: string;
  items: IconItem[];
  onChange: (v: IconItem[]) => void;
  max: number;
}) {
  return (
    <ListEditor
      label={label}
      items={items}
      onChange={onChange}
      max={max}
      newItem={(): IconItem => ({ icon: "sparkles", title: "", body: "" })}
      itemTitle={(it) => it.title}
      renderItem={(it, set) => (
        <div className="grid gap-4 md:grid-cols-[200px_1fr]">
          <IconSelect value={it.icon} onChange={(icon) => set({ ...it, icon })} />
          <TextField label="Title" value={it.title} onChange={(title) => set({ ...it, title })} />
          <div className="md:col-span-2">
            <TextField
              label="Description"
              long
              value={it.body}
              onChange={(body) => set({ ...it, body })}
            />
          </div>
        </div>
      )}
    />
  );
}

function TextItems({
  label,
  items,
  onChange,
  max,
}: {
  label: string;
  items: TextItem[];
  onChange: (v: TextItem[]) => void;
  max: number;
}) {
  return (
    <ListEditor
      label={label}
      items={items}
      onChange={onChange}
      max={max}
      newItem={() => ({ title: "", body: "" })}
      itemTitle={(it) => it.title}
      renderItem={(it, set) => (
        <div className="space-y-4">
          <TextField label="Title" value={it.title} onChange={(title) => set({ ...it, title })} />
          <TextField
            label="Description"
            long
            value={it.body}
            onChange={(body) => set({ ...it, body })}
          />
        </div>
      )}
    />
  );
}

export function GeneralEditor({ draft, update }: EditorProps) {
  return (
    <>
      <Panel title="Brand" description="Shown in the footer on every page.">
        <ObjectFields
          value={draft.brand}
          onChange={(v) => update("brand", v)}
          fields={[
            { key: "tagline", label: "Tagline" },
            { key: "footerBlurb", label: "Footer description", long: true },
          ]}
        />
      </Panel>
      <Panel
        title="Call‑to‑action banner"
        description="The “Let’s build a brighter future” box near the bottom of most pages."
      >
        <ObjectFields
          value={draft.cta}
          onChange={(v) => update("cta", v)}
          fields={[
            { key: "title", label: "Heading", long: true },
            { key: "lead", label: "Text", long: true },
          ]}
        />
      </Panel>
    </>
  );
}

export function HomeEditor({ draft, update }: EditorProps) {
  return (
    <>
      <Panel title="Top of page" description="The first thing visitors see.">
        <ObjectFields
          value={draft.home}
          onChange={(v) => update("home", v)}
          fields={[
            { key: "eyebrow", label: "Small heading" },
            {
              key: "titleHighlight",
              label: "Highlighted words",
              hint: "Shown in the teal gradient after the heading.",
            },
            { key: "title", label: "Main heading", long: true },
            { key: "lead", label: "Intro text", long: true },
          ]}
        />
      </Panel>
      <Panel title="Mission & quote">
        <ObjectFields
          value={draft.home}
          onChange={(v) => update("home", v)}
          fields={[
            { key: "missionTitle", label: "Mission heading", long: true },
            { key: "missionLead", label: "Mission text", long: true },
            { key: "quote", label: "Quote" },
            { key: "quoteHighlight", label: "Quote highlight" },
            { key: "quoteSub", label: "Quote subtext", long: true },
            { key: "bannerTitle", label: "Banner heading", long: true },
          ]}
        />
      </Panel>
      <Panel title="Key strengths" description="The cards under the mission heading.">
        <IconItems
          label="Cards"
          items={draft.pillars}
          onChange={(v) => update("pillars", v)}
          max={12}
        />
      </Panel>
    </>
  );
}

export function AboutEditor({ draft, update }: EditorProps) {
  return (
    <>
      <Panel title="About page text">
        <ObjectFields
          value={draft.about}
          onChange={(v) => update("about", v)}
          fields={[
            { key: "title", label: "Heading" },
            { key: "quote", label: "Quote" },
            { key: "lead", label: "Intro text", long: true },
            { key: "goal", label: "Our goal", long: true },
            { key: "advantagesTitle", label: "Advantages heading" },
            { key: "advantagesLead", label: "Advantages text", long: true },
          ]}
        />
      </Panel>
      <Panel title="Advantages">
        <TextItems
          label="Advantages"
          items={draft.advantages}
          onChange={(v) => update("advantages", v)}
          max={12}
        />
      </Panel>
    </>
  );
}

export function FeaturesEditor({ draft, update }: EditorProps) {
  return (
    <>
      <Panel title="Features page text">
        <ObjectFields
          value={draft.featuresPage}
          onChange={(v) => update("featuresPage", v)}
          fields={[
            { key: "title", label: "Heading" },
            { key: "titleHighlight", label: "Highlighted words" },
            { key: "lead", label: "Intro text", long: true },
            { key: "devicesTitle", label: "Devices heading" },
            { key: "devicesLead", label: "Devices text" },
          ]}
        />
      </Panel>
      <Panel title="Platform features">
        <IconItems
          label="Features"
          items={draft.features}
          onChange={(v) => update("features", v)}
          max={18}
        />
      </Panel>
    </>
  );
}

export function ProgramsEditor({ draft, update }: EditorProps) {
  return (
    <>
      <Panel title="Programs page text">
        <ObjectFields
          value={draft.programsPage}
          onChange={(v) => update("programsPage", v)}
          fields={[
            { key: "title", label: "Heading" },
            { key: "idealForTitle", label: "“Ideal for” heading" },
            { key: "lead", label: "Intro text", long: true },
            { key: "processTitle", label: "Process heading" },
            { key: "processLead", label: "Process text" },
          ]}
        />
      </Panel>
      <Panel title="What we offer">
        <IconItems
          label="Offers"
          items={draft.offers}
          onChange={(v) => update("offers", v)}
          max={12}
        />
      </Panel>
      <Panel title="Ideal for">
        <StringList
          label="Institution types"
          items={draft.idealFor}
          onChange={(v) => update("idealFor", v)}
          max={20}
          placeholder="e.g. Degree Colleges"
        />
      </Panel>
      <Panel title="Implementation steps">
        <TextItems
          label="Steps"
          items={draft.steps}
          onChange={(v) => update("steps", v)}
          max={12}
        />
      </Panel>
    </>
  );
}

export function ImpactEditor({ draft, update }: EditorProps) {
  return (
    <>
      <Panel title="Impact page text">
        <ObjectFields
          value={draft.impactPage}
          onChange={(v) => update("impactPage", v)}
          fields={[
            { key: "title", label: "Heading" },
            { key: "lead", label: "Intro text", long: true },
          ]}
        />
      </Panel>
      <Panel title="Impact cards">
        <IconItems
          label="Cards"
          items={draft.impacts}
          onChange={(v) => update("impacts", v)}
          max={12}
        />
      </Panel>
      <Panel title="Testimonials">
        <ListEditor
          label="Testimonials"
          items={draft.testimonials}
          onChange={(v) => update("testimonials", v)}
          max={12}
          addLabel="Add testimonial"
          newItem={() => ({ quote: "", name: "", role: "" })}
          itemTitle={(t) => t.name}
          renderItem={(t, set) => (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <TextField
                  label="Quote"
                  long
                  value={t.quote}
                  onChange={(quote) => set({ ...t, quote })}
                />
              </div>
              <TextField label="Name" value={t.name} onChange={(name) => set({ ...t, name })} />
              <TextField
                label="Role & institution"
                value={t.role}
                onChange={(role) => set({ ...t, role })}
              />
            </div>
          )}
        />
      </Panel>
    </>
  );
}

export function ContactEditor({ draft, update }: EditorProps) {
  const contact = draft.contact;
  const contactPage = draft.contactPage;
  const socials = draft.socials;

  const updateContact = (patch: Partial<typeof contact>) => {
    update("contact", { ...contact, ...patch });
  };

  const updateContactPage = (patch: Partial<typeof contactPage>) => {
    update("contactPage", { ...contactPage, ...patch });
  };

  const updateSocials = (patch: Partial<typeof socials>) => {
    update("socials", { ...socials, ...patch });
  };

  return (
    <>
      {/* 1. Hero Section Banner */}
      <Panel
        title="Contact Hero Banner"
        description="Headlines, description and reassurance pills shown across the full-page counselor banner."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <TextField
            label="Eyebrow Badge"
            value={contactPage.badge || ""}
            onChange={(badge) => updateContactPage({ badge })}
            placeholder="Get in Touch"
          />
          <TextField
            label="Headline Start"
            value={contactPage.title}
            onChange={(title) => updateContactPage({ title })}
            placeholder="Let’s Build"
          />
          <TextField
            label="Headline Highlight"
            value={contactPage.titleHighlight}
            onChange={(titleHighlight) => updateContactPage({ titleHighlight })}
            placeholder="Brighter Futures Together"
          />
        </div>

        <TextField
          label="Hero Subtitle / Description"
          long
          value={contactPage.lead}
          onChange={(lead) => updateContactPage({ lead })}
          placeholder="Have questions, feedback, or want to collaborate?..."
        />

        <div className="grid gap-5 md:grid-cols-3 pt-2">
          <TextField
            label="Feature Pill 1"
            value={contactPage.pill1 || ""}
            onChange={(pill1) => updateContactPage({ pill1 })}
            placeholder="Quick Response"
          />
          <TextField
            label="Feature Pill 2"
            value={contactPage.pill2 || ""}
            onChange={(pill2) => updateContactPage({ pill2 })}
            placeholder="Dedicated Support"
          />
          <TextField
            label="Feature Pill 3"
            value={contactPage.pill3 || ""}
            onChange={(pill3) => updateContactPage({ pill3 })}
            placeholder="Real People"
          />
        </div>
      </Panel>

      {/* 2. Direct Contact Channels */}
      <Panel
        title="Direct Contact Channels"
        description="Information displayed on the 4 primary channel cards (Phone, Email, Location, Website)."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            label="Section Title"
            value={contactPage.channelsTitle || ""}
            onChange={(channelsTitle) => updateContactPage({ channelsTitle })}
            placeholder="Multiple Ways to Reach Us"
          />
          <TextField
            label="Section Subtitle"
            value={contactPage.channelsLead || ""}
            onChange={(channelsLead) => updateContactPage({ channelsLead })}
            placeholder="Choose the channel that works best for you..."
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2 pt-2">
          {/* Phone Card */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>📞 Phone Channel</span>
            </h3>
            <TextField
              label="Contact Phone Number"
              type="tel"
              value={contact.phone}
              onChange={(phone) => updateContact({ phone })}
              placeholder="+91 98765 43210"
            />
            <TextField
              label="Operating Schedule / Hours"
              value={contact.phoneHours || ""}
              onChange={(phoneHours) => updateContact({ phoneHours })}
              placeholder="Mon - Fri, 9:00 AM - 6:00 PM (IST)"
            />
          </div>

          {/* Email Card */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>✉️ Email Channel</span>
            </h3>
            <TextField
              label="Primary Email Address"
              type="email"
              value={contact.email}
              onChange={(email) => updateContact({ email })}
              placeholder="partnerships@eduarc.in"
            />
            <TextField
              label="Reply Commitment Note"
              value={contact.emailNote || ""}
              onChange={(emailNote) => updateContact({ emailNote })}
              placeholder="We reply within 24 hours"
            />
          </div>

          {/* Location Card */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>📍 Office Location</span>
            </h3>
            <TextField
              label="Physical Location"
              value={contact.location || ""}
              onChange={(location) => updateContact({ location })}
              placeholder="Bengaluru, Karnataka, India"
            />
            <TextField
              label="Appointment Note"
              value={contact.locationNote || ""}
              onChange={(locationNote) => updateContact({ locationNote })}
              placeholder="(By appointment only)"
            />
          </div>

          {/* Website Card */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>🌐 Website Channel</span>
            </h3>
            <TextField
              label="Official Website URL"
              value={contact.website}
              onChange={(website) => updateContact({ website })}
              placeholder="www.eduarc.in"
            />
            <TextField
              label="Explorer Note"
              value={contact.websiteNote || ""}
              onChange={(websiteNote) => updateContact({ websiteNote })}
              placeholder="Explore more about us"
            />
          </div>
        </div>
      </Panel>

      {/* 3. Social Media Channels */}
      <Panel
        title="Social Media Channels"
        description="Links and handles displayed across the 5 social media cards (Instagram, Facebook, X, LinkedIn, YouTube)."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {/* Instagram */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider block">
              Instagram
            </span>
            <TextField
              label="Handle"
              value={socials.instagramHandle || ""}
              onChange={(instagramHandle) => updateSocials({ instagramHandle })}
              placeholder="@eduarc_official"
            />
            <TextField
              label="URL"
              value={socials.instagramUrl || ""}
              onChange={(instagramUrl) => updateSocials({ instagramUrl })}
              placeholder="https://instagram.com/eduarc_official"
            />
          </div>

          {/* Facebook */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Facebook
            </span>
            <TextField
              label="Handle"
              value={socials.facebookHandle || ""}
              onChange={(facebookHandle) => updateSocials({ facebookHandle })}
              placeholder="/eduarc"
            />
            <TextField
              label="URL"
              value={socials.facebookUrl || ""}
              onChange={(facebookUrl) => updateSocials({ facebookUrl })}
              placeholder="https://facebook.com/eduarc"
            />
          </div>

          {/* X (Twitter) */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
              X (Twitter)
            </span>
            <TextField
              label="Handle"
              value={socials.twitterHandle || ""}
              onChange={(twitterHandle) => updateSocials({ twitterHandle })}
              placeholder="@eduarc_official"
            />
            <TextField
              label="URL"
              value={socials.twitterUrl || ""}
              onChange={(twitterUrl) => updateSocials({ twitterUrl })}
              placeholder="https://x.com/eduarc_official"
            />
          </div>

          {/* LinkedIn */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block">
              LinkedIn
            </span>
            <TextField
              label="Handle"
              value={socials.linkedinHandle || ""}
              onChange={(linkedinHandle) => updateSocials({ linkedinHandle })}
              placeholder="/company/eduarc"
            />
            <TextField
              label="URL"
              value={socials.linkedinUrl || ""}
              onChange={(linkedinUrl) => updateSocials({ linkedinUrl })}
              placeholder="https://linkedin.com/company/eduarc"
            />
          </div>

          {/* YouTube */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 space-y-3 md:col-span-2">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
              YouTube
            </span>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Handle"
                value={socials.youtubeHandle || ""}
                onChange={(youtubeHandle) => updateSocials({ youtubeHandle })}
                placeholder="@eduarc"
              />
              <TextField
                label="URL"
                value={socials.youtubeUrl || ""}
                onChange={(youtubeUrl) => updateSocials({ youtubeUrl })}
                placeholder="https://youtube.com/@eduarc"
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* 4. Dual Engagement & Direct Conversation Card */}
      <Panel
        title="Engagement & Message Card"
        description="Text for the dual 'Ready to Connect?' left column and 'Send Us a Message' right column."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column Settings */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">Left Column: Ready to Connect</h3>
            <TextField
              label="Eyebrow"
              value={contactPage.connectEyebrow || ""}
              onChange={(connectEyebrow) => updateContactPage({ connectEyebrow })}
              placeholder="— Ready to Connect?"
            />
            <TextField
              label="Title"
              value={contactPage.connectTitle || ""}
              onChange={(connectTitle) => updateContactPage({ connectTitle })}
              placeholder="We’re Here for What’s Next"
            />
            <TextField
              label="Description"
              long
              value={contactPage.connectLead || ""}
              onChange={(connectLead) => updateContactPage({ connectLead })}
              placeholder="Whether you’re a student, parent, educator..."
            />
          </div>

          {/* Right Column Settings */}
          <div className="rounded-2xl border border-border/80 bg-background/50 p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground">
              Right Column: Quick Contact & Banner
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Badge"
                value={contactPage.messageBadge || ""}
                onChange={(messageBadge) => updateContactPage({ messageBadge })}
                placeholder="Quick Contact"
              />
              <TextField
                label="Title"
                value={contactPage.messageTitle || ""}
                onChange={(messageTitle) => updateContactPage({ messageTitle })}
                placeholder="Send Us a Message"
              />
            </div>
            <TextField
              label="Topic Prompt Text"
              value={contactPage.messageLead || ""}
              onChange={(messageLead) => updateContactPage({ messageLead })}
              placeholder="Have a specific question or inquiry?..."
            />
            <TextField
              label="Direct Call Callout Title"
              value={contactPage.directCallTitle || ""}
              onChange={(directCallTitle) => updateContactPage({ directCallTitle })}
              placeholder="Prefer a direct conversation?"
            />
            <TextField
              label="Direct Call Callout Note"
              value={contactPage.directCallLead || ""}
              onChange={(directCallLead) => updateContactPage({ directCallLead })}
              placeholder="Call us during our working hours..."
            />
            <TextField
              label="Signature Quote"
              value={contactPage.signature || ""}
              onChange={(signature) => updateContactPage({ signature })}
              placeholder="“We’d love to hear from you!”"
            />
          </div>
        </div>
      </Panel>
    </>
  );
}

export function EditorStack({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

export { MentorsEditor } from "./MentorsEditor";
