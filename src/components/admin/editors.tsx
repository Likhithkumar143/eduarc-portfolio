import type { ReactNode } from "react";
import type { SiteContent } from "@/content/eduarc";
import { IconSelect, ListEditor, ObjectFields, Panel, StringList, TextField } from "./fields";

type Update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
export type EditorProps = {
  draft: SiteContent;
  update: Update;
  onSave?: () => Promise<void>;
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
  return (
    <>
      <Panel
        title="Contact details"
        description="Used on the Contact page and in the footer of every page."
      >
        <div className="grid gap-5 md:grid-cols-3">
          <TextField
            label="Email"
            type="email"
            value={draft.contact.email}
            onChange={(email) => update("contact", { ...draft.contact, email })}
          />
          <TextField
            label="Phone"
            type="tel"
            value={draft.contact.phone}
            onChange={(phone) => update("contact", { ...draft.contact, phone })}
          />
          <TextField
            label="Website"
            value={draft.contact.website}
            onChange={(website) => update("contact", { ...draft.contact, website })}
          />
        </div>
      </Panel>
      <Panel title="Contact page text">
        <ObjectFields
          value={draft.contactPage}
          onChange={(v) => update("contactPage", v)}
          fields={[
            { key: "title", label: "Heading" },
            { key: "titleHighlight", label: "Highlighted words" },
            { key: "lead", label: "Intro text", long: true },
            { key: "thankYou", label: "Thank‑you message", long: true },
          ]}
        />
      </Panel>
    </>
  );
}

export function EditorStack({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}

export { MentorsEditor } from "./MentorsEditor";
