import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

type Section = {
  label: string;
  items: { headline: string; body: string }[];
};

const SECTIONS: Section[] = [
  {
    label: "Local Government",
    items: [
      {
        headline: "Medford City Council Approves New Bike Lane on Main Street",
        body: "The 1.2-mile protected lane will run from Salem Street to the Mystic River, with construction set to begin in early July pending utility coordination.",
      },
      {
        headline: "Mayor Lungo-Koehn Announces Budget Surplus for Fiscal Year",
        body: "The $3.4M surplus, attributed to higher-than-expected meals tax revenue, will be directed toward school facilities and pothole repair, the mayor said Friday.",
      },
    ],
  },
  {
    label: "Schools",
    items: [
      {
        headline: "Medford High Robotics Team Advances to State Finals",
        body: "Team 6431, the Mustang Mechatronics, edged out Brookline in a 78-74 semifinal at WPI on Wednesday and will compete in Worcester next weekend.",
      },
      {
        headline: "School Committee Reviews Updated Bell Schedule",
        body: "Proposed changes would push the high school start to 8:30 a.m. beginning in September, aligning with state guidance on adolescent sleep.",
      },
    ],
  },
  {
    label: "Arts & Culture",
    items: [
      {
        headline: "Chevalier Theatre Announces Summer Concert Series",
        body: "Headliners include Jason Isbell, Lake Street Dive, and a hometown set from Tracy Bonham. Tickets go on sale Monday at 10 a.m.",
      },
      {
        headline: "Local Gallery Opens Faces of Medford Exhibit",
        body: "Photographer Lena Ortiz spent two years documenting longtime residents. The opening reception is Friday at 6 p.m. at the Riverbend space.",
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        headline: "Farmers Market Saturday 9am-1pm at Riverside Plaza",
        body: "Twenty-two vendors this week, including a new stand from Wright-Locke Farm and live fiddle music from the Mystic River String Band.",
      },
      {
        headline: "Free Yoga in the Park Sunday Morning",
        body: "Instructor Priya Menon leads an all-levels flow at 8 a.m. in Hormel Stadium's south lawn. Mats provided while supplies last.",
      },
    ],
  },
];

function Index() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  return (
    <main className="min-h-screen">
      <Hero />
      <Configurator config={config} setConfig={setConfig} />
      <Mockup config={config} />
      <HowItWorks />
      <Signup />
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 md:pt-36 md:pb-28">
      <p className="small-caps text-accent">For Hyperlocal Publishers</p>
      <h1 className="font-serif mt-6 text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tight text-foreground">
        Launch your town's daily paper in an afternoon.
      </h1>
      <p className="mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
        Daily Press is the framework powering AI-generated hyperlocal news.
        Design your masthead, pick your beats, deploy a daily edition that
        writes itself.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <a href="https://medford-mercury.pages.dev" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90">See a live example</a>
        <a href="#signup" className="inline-flex items-center justify-center rounded-sm border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted">Get notified at launch</a>
      </div>
    </section>
  );
}

function Mockup({ config }: { config: Config }) {
  const enabledSections = config.sections.filter((s) => s.enabled);
  const pubName = (config.pubName || "Daily Press").toUpperCase();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const cityState = [config.city, config.state].filter(Boolean).join(", ");
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="bg-paper px-6 py-10 md:px-14 md:py-16 shadow-[0_30px_60px_-20px_rgba(40,30,15,0.18),0_8px_20px_-8px_rgba(40,30,15,0.12)] border border-border/40">
        <div className="text-center">
          <div className="h-px bg-ink/80" />
          <h2 className="font-serif font-black tracking-tight text-4xl sm:text-5xl md:text-7xl py-3 text-ink">
            {pubName}
          </h2>
          <div className="h-px bg-ink/80" />
          <p className="font-serif italic mt-3 text-muted-foreground">{config.tagline || "Your daily local read"}</p>
          <p className="mt-2 text-xs tracking-wide text-muted-foreground">{today} - {cityState}</p>
        </div>

        {enabledSections.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground italic">Toggle a section on above to see today's edition.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {enabledSections.map((s, i) => {
              const template = SECTIONS.find((t) => t.label === s.templateLabel);
              if (!template) return null;
              const isLastRow = i >= enabledSections.length - (enabledSections.length % 2 === 0 ? 2 : 1);
              return (
                <div key={s.id} className={`py-6 ${!isLastRow ? "border-b border-border/60" : ""} ${i % 2 === 1 ? "md:border-l md:border-border/60 md:pl-10" : ""}`}>
                  <p className="small-caps text-accent mb-4">{s.label || template.label}</p>
                  <div className="space-y-5">
                    {template.items.map((it, j) => (
                      <article key={j}>
                        <h3 className="font-serif text-xl md:text-2xl leading-snug text-ink">{interpolate(it.headline, config)}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{interpolate(it.body, config)}</p>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 h-px bg-border" />
        <p className="font-serif italic text-center text-xs text-muted-foreground mt-4">
          Edition {today} - published by {config.pubName || "Daily Press"}
        </p>
      </div>
    </section>
  );
}
function HowItWorks() {
  const steps = [
    { n: 1, title: "Design your edition", body: "Pick your publication name, sections, and visual style. Daily Press generates your starter kit." },
    { n: 2, title: "Deploy in minutes", body: "One-click setup to GitHub Actions and Cloudflare Pages. Your edition publishes daily on its own." },
    { n: 3, title: "AI writes the news", body: "Each morning, Claude pulls local sources and writes your day's edition. You stay in editorial control." },
  ];
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 border-t border-border">
      <p className="small-caps text-accent">How it works</p>
      <h2 className="font-serif text-4xl md:text-5xl mt-4 tracking-tight">Three steps to a daily edition.</h2>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {steps.map((s) => (
          <div key={s.n}>
            <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground font-serif text-lg flex items-center justify-center">{s.n}</div>
            <h3 className="font-serif text-2xl mt-6 tracking-tight">{s.title}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Signup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section id="signup" className="mx-auto max-w-3xl px-6 py-24 border-t border-border text-center">
      <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Be first to launch.</h2>
      <p className="mt-4 text-muted-foreground text-lg">Daily Press opens this summer. Drop your email and we'll let you know.</p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@town.com" disabled={done} className="flex-1 rounded-sm border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-accent transition" />
        <button type="button" onClick={() => { if (email.trim()) setDone(true); }} disabled={done} className="rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-100">
          {done ? "You're on the list" : "Notify me"}
        </button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 pb-16">
      <div className="h-px bg-accent/60" />
      <p className="mt-8 text-center text-xs text-muted-foreground">Daily Press - A framework for AI-powered local journalism - Built by the team behind Medford Mercury</p>
    </footer>
  );
}
type Config = {
  pubName: string;
  tagline: string;
  city: string;
  state: string;
  mayor: string;
  street: string;
  highSchool: string;
  sections: { id: string; templateLabel: string; label: string; enabled: boolean }[];
};

const DEFAULT_CONFIG: Config = {
  pubName: "Medford Mercury",
  tagline: "Your daily local read",
  city: "Medford",
  state: "Massachusetts",
  mayor: "Lungo-Koehn",
  street: "Main Street",
  highSchool: "Medford High",
  sections: SECTIONS.map((s, i) => ({ id: String(i), templateLabel: s.label, label: s.label, enabled: true })),
};

function interpolate(text: string, config: Config): string {
  const highSchool = config.highSchool.trim() || (config.city || "Town") + " High";
  return text
    .replaceAll("Medford City Council", (config.city || "Town") + " City Council")
    .replaceAll("Mayor Lungo-Koehn", "Mayor " + (config.mayor || "the mayor"))
    .replaceAll("the mayor said", (config.mayor || "the mayor") + " said")
    .replaceAll("Main Street", config.street || "Main Street")
    .replaceAll("Medford High", highSchool)
    .replaceAll("Faces of Medford", "Faces of " + (config.city || "Town"))
    .replaceAll("Medford", config.city || "Town");
}

function Configurator({ config, setConfig }: { config: Config; setConfig: (c: Config) => void }) {
  const update = (patch: Partial<Config>) => setConfig({ ...config, ...patch });
  const updateSection = (id: string, patch: Partial<{ label: string; enabled: boolean }>) =>
    setConfig({ ...config, sections: config.sections.map((s) => (s.id === id ? { ...s, ...patch } : s)) });

  return (
    <section id="configurator" className="mx-auto max-w-5xl px-6 pb-12 border-t border-border pt-16">
      <p className="small-caps text-accent">Build your edition</p>
      <h2 className="font-serif text-4xl md:text-5xl mt-4 tracking-tight">Design your paper.</h2>
      <p className="mt-4 text-muted-foreground text-lg max-w-2xl">Change anything below. The mockup updates as you type.</p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <Field label="Publication name" value={config.pubName} onChange={(v) => update({ pubName: v })} />
        <Field label="Tagline" value={config.tagline} onChange={(v) => update({ tagline: v })} />
        <Field label="City" value={config.city} onChange={(v) => update({ city: v })} />
        <Field label="State" value={config.state} onChange={(v) => update({ state: v })} />
        <Field label="Mayor's last name" hint="Optional" value={config.mayor} onChange={(v) => update({ mayor: v })} />
        <Field label="Main street name" hint="Optional" value={config.street} onChange={(v) => update({ street: v })} />
        <Field label="High school name" hint="Optional" value={config.highSchool} onChange={(v) => update({ highSchool: v })} />
      </div>

      <div className="mt-10">
        <p className="small-caps text-accent mb-4">Sections</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.sections.map((s) => (
            <div key={s.id} className="flex items-center gap-3 border border-border rounded-sm px-4 py-3 bg-paper">
              <input type="checkbox" checked={s.enabled} onChange={(e) => updateSection(s.id, { enabled: e.target.checked })} className="h-4 w-4" />
              <input type="text" value={s.label} onChange={(e) => updateSection(s.id, { label: e.target.value })} disabled={!s.enabled} className="flex-1 bg-transparent text-sm outline-none disabled:opacity-50" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {hint ? <span className="ml-2 text-xs font-normal text-muted-foreground">{hint}</span> : null}
      </span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-sm border border-border bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent transition" />
    </label>
  );
}


