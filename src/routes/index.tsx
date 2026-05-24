import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

type SectionTemplate = {
  id: string;
  defaultLabel: string;
  items: { headline: string; body: string }[];
};

const SECTION_TEMPLATES: SectionTemplate[] = [
  {
    id: "gov",
    defaultLabel: "Local Government",
    items: [
      {
        headline: "{City} City Council Approves New Bike Lane on {Street}",
        body: "The 1.2-mile protected lane will run from Salem Street to the riverfront, with construction set to begin in early July pending utility coordination.",
      },
      {
        headline: "Mayor {Mayor} Announces Budget Surplus for Fiscal Year",
        body: "The $3.4M surplus, attributed to higher-than-expected meals tax revenue, will be directed toward school facilities and pothole repair, {Mayor} said Friday.",
      },
    ],
  },
  {
    id: "schools",
    defaultLabel: "Schools",
    items: [
      {
        headline: "{HighSchool} Robotics Team Advances to State Finals",
        body: "Team 6431 edged out their semifinal opponent 78–74 on Wednesday and will compete in the state championship next weekend.",
      },
      {
        headline: "School Committee Reviews Updated Bell Schedule",
        body: "Proposed changes would push the high school start to 8:30 a.m. beginning in September, aligning with state guidance on adolescent sleep.",
      },
    ],
  },
  {
    id: "arts",
    defaultLabel: "Arts & Culture",
    items: [
      {
        headline: "{City} Theatre Announces Summer Concert Series",
        body: "Headliners include several national touring acts plus a hometown set from a {City}-born songwriter. Tickets go on sale Monday at 10 a.m.",
      },
      {
        headline: "Local Gallery Opens 'Faces of {City}' Exhibit",
        body: "A local photographer spent two years documenting longtime residents. The opening reception is Friday at 6 p.m. at the Riverbend space.",
      },
    ],
  },
  {
    id: "community",
    defaultLabel: "Community",
    items: [
      {
        headline: "{City} Farmers Market Saturday 9am–1pm",
        body: "Twenty-two vendors this week, including a new produce stand and live fiddle music from a local string band.",
      },
      {
        headline: "Free Yoga in the Park Sunday Morning",
        body: "An instructor leads an all-levels flow at 8 a.m. on the south lawn. Mats provided while supplies last.",
      },
    ],
  },
];

type Config = {
  pubName: string;
  tagline: string;
  city: string;
  state: string;
  mayor: string;
  street: string;
  highSchool: string;
  sections: { id: string; label: string; enabled: boolean }[];
};

const DEFAULT_CONFIG: Config = {
  pubName: "Medford Mercury",
  tagline: "Your daily local read",
  city: "Medford",
  state: "Massachusetts",
  mayor: "Lungo-Koehn",
  street: "Main Street",
  highSchool: "Medford High",
  sections: SECTION_TEMPLATES.map((s) => ({
    id: s.id,
    label: s.defaultLabel,
    enabled: true,
  })),
};

function interpolate(text: string, config: Config): string {
  const highSchool =
    config.highSchool.trim() || `${config.city || "Town"} High`;
  return text
    .replaceAll("{City}", config.city || "Town")
    .replaceAll("{Mayor}", config.mayor || "the mayor")
    .replaceAll("{Street}", config.street || "Main Street")
    .replaceAll("{HighSchool}", highSchool);
}

function todayLong(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

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
        
          href="#configurator"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("configurator")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center justify-center rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        >
          Try the demo
        </a>
        
          href="https://medford-mercury.pages.dev"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-sm border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          See a live example
        </a>
      </div>
    </section>
  );
}

function Configurator({
  config,
  setConfig,
}: {
  config: Config;
  setConfig: (c: Config) => void;
}) {
  const update = <K extends keyof Config>(key: K, value: Config[K]) =>
    setConfig({ ...config, [key]: value });

  const updateSection = (
    id: string,
    patch: Partial<{ label: string; enabled: boolean }>,
  ) =>
    setConfig({
      ...config,
      sections: config.sections.map((s) =>
        s.id === id ? { ...s, ...patch } : s,
      ),
    });

  return (
    <section
      id="configurator"
      className="mx-auto max-w-5xl px-6 pb-12 border-t border-border pt-16"
    >
      <p className="small-caps text-accent">Build your edition</p>
      <h2 className="font-serif text-4xl md:text-5xl mt-4 tracking-tight">
        Design your paper.
      </h2>
      <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
        Change anything below. The mockup updates as you type.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <Field
          label="Publication name"
          value={config.pubName}
          onChange={(v) => update("pubName", v)}
        />
        <Field
          label="Tagline"
          value={config.tagline}
          onChange={(v) => update("tagline", v)}
        />
        <Field
          label="City"
          value={config.city}
          onChange={(v) => update("city", v)}
        />
        <Field
          label="State"
          value={config.state}
          onChange={(v) => update("state", v)}
        />
        <Field
          label="Mayor's last name"
          value={config.mayor}
          onChange={(v) => update("mayor", v)}
          hint="Optional"
        />
        <Field
          label="Main street name"
          value={config.street}
          onChange={(v) => update("street", v)}
          hint="Optional"
        />
        <Field
          label="High school name"
          value={config.highSchool}
          onChange={(v) => update("highSchool", v)}
          hint="Optional"
        />
      </div>

      <div className="mt-10">
        <p className="small-caps text-accent mb-4">Sections</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.sections.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 border border-border rounded-sm px-4 py-3 bg-paper"
            >
              <input
                type="checkbox"
                checked={s.enabled}
                onChange={(e) =>
                  updateSection(s.id, { enabled: e.target.checked })
                }
                className="h-4 w-4 accent-current text-accent"
              />
              <input
                type="text"
                value={s.label}
                onChange={(e) =>
                  updateSection(s.id, { label: e.target.value })
                }
                disabled={!s.enabled}
                className="flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {hint && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-border bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent transition"
      />
    </label>
  );
}

function Mockup({ config }: { config: Config }) {
  const activeSections = config.sections
    .map((s) => {
      const template = SECTION_TEMPLATES.find((t) => t.id === s.id);
      if (!template || !s.enabled) return null;
      return {
        label: s.label || template.defaultLabel,
        items: template.items.map((it) => ({
          headline: interpolate(it.headline, config),
          body: interpolate(it.body, config),
        })),
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  const pubName = (config.pubName || "Daily Press").toUpperCase();
  const dateline = `${todayLong()} · ${config.city || "Your City"}, ${config.state || ""}`.replace(
    /, $/,
    "",
  );

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="bg-paper px-6 py-10 md:px-14 md:py-16 shadow-[0_30px_60px_-20px_rgba(40,30,15,0.18),0_8px_20px_-8px_rgba(40,30,15,0.12)] border border-border/40">
        {/* Masthead */}
        <div className="text-center">
          <div className="h-px bg-ink/80" />
          <h2 className="font-serif font-black tracking-tight text-4xl sm:text-5xl md:text-7xl py-3 text-ink">
            {pubName}
          </h2>
          <div className="h-px bg-ink/80" />
          <p className="font-serif italic mt-3 text-muted-foreground">
            {config.tagline || "Your daily local read"}
          </p>
          <p className="mt-2 text-xs tracking-wide text-muted-foreground">
            {dateline}
          </p>
        </div>

        {/* Body */}
        {activeSections.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground italic">
            Toggle a section on above to see today's edition.
          </p>
        ) : (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10">
            {activeSections.map((s, i) => {
              const isLastRow =
                i >= activeSections.length - (activeSections.length % 2 === 0 ? 2 : 1);
              return (
                <div
                  key={s.label + i}
                  className={`py-6 ${!isLastRow ? "border-b border-border/60" : ""} ${i % 2 === 1 ? "md:border-l md:border-border/60 md:pl-10" : ""}`}
                >
                  <p className="small-caps text-accent mb-4">{s.label}</p>
                  <div className="space-y-5">
                    {s.items.map((it, j) => (
                      <article key={j}>
                        <h3 className="font-serif text-xl md:text-2xl leading-snug text-ink">
                          {it.headline}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {it.body}
                        </p>
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
          Edition {todayLong()} — published by {config.pubName || "Daily Press"}
        </p>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Design your edition",
      body: "Pick your publication name, sections, and visual style. Daily Press generates your starter kit.",
    },
    {
      n: 2,
      title: "Deploy in minutes",
      body: "One-click setup to GitHub Actions and Cloudflare Pages. Your edition publishes daily on its own.",
    },
    {
      n: 3,
      title: "AI writes the news",
      body: "Each morning, Claude pulls local sources and writes your day's edition. You stay in editorial control.",
    },
  ];
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 border-t border-border">
      <p className="small-caps text-accent">How it works</p>
      <h2 className="font-serif text-4xl md:text-5xl mt-4 tracking-tight">
        Three steps to a daily edition.
      </h2>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {steps.map((s) => (
          <div key={s.n}>
            <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground font-serif text-lg flex items-center justify-center">
              {s.n}
            </div>
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
    <section
      id="signup"
      className="mx-auto max-w-3xl px-6 py-24 border-t border-border text-center"
    >
      <h2 className="font-serif text-4xl md:text-5xl tracking-tight">
        Be first to launch.
      </h2>
      <p className="mt-4 text-muted-foreground text-lg">
        Daily Press opens this summer. Drop your email and we'll let you know.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim()) setDone(true);
        }}
        className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@town.com"
          disabled={done}
          className="flex-1 rounded-sm border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-accent transition"
        />
        <button
          type="submit"
          disabled={done}
          className="rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-100"
        >
          {done ? "You're on the list ✓" : "Notify me"}
        </button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 pb-16">
      <div className="h-px bg-accent/60" />
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Daily Press · A framework for AI-powered local journalism · Built by the
        team behind Medford Mercury
      </p>
    </footer>
  );
}
      
