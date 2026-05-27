import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateHeadlines } from "@/lib/headlines.functions";
import { publisherSupabase } from "@/integrations/publisher/client";


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

type Config = {
  pubName: string;
  tagline: string;
  city: string;
  state: string;
  street: string;
  highSchool: string;
  sections: { id: string; templateLabel: string; label: string; enabled: boolean }[];
};

const DEFAULT_CONFIG: Config = {
  pubName: "Medford Mercury",
  tagline: "Your daily local read",
  city: "Medford",
  state: "Massachusetts",
  street: "Main Street",
  highSchool: "Medford High",
  sections: SECTIONS.map((s, i) => ({ id: String(i), templateLabel: s.label, label: s.label, enabled: true })),
};

type AiHeadlines = Record<string, { headline: string; body: string }[]>;

function Index() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [aiHeadlines, setAiHeadlines] = useState<AiHeadlines | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generate = useServerFn(generateHeadlines);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const enabled = config.sections.filter((s) => s.enabled);
      const labels = Array.from(new Set(enabled.map((s) => s.label || s.templateLabel)));
      if (labels.length === 0) {
        setError("Enable at least one section first.");
        setLoading(false);
        return;
      }
      const result = await generate({
        data: {
          city: config.city || "Town",
          state: config.state,
          pubName: config.pubName,
          street: config.street,
          highSchool: config.highSchool,
          sections: labels,
        },
      });
      setAiHeadlines(result);
    } catch (e) {
      console.error(e);
      setError("Could not generate headlines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Hero />
      <Configurator
        config={config}
        setConfig={setConfig}
        onGenerate={handleGenerate}
        loading={loading}
        error={error}
        onDownload={() => downloadHtml(config, aiHeadlines)}
      />
      <Mockup config={config} aiHeadlines={aiHeadlines} />
      <HowItWorks />
      <LaunchCTA config={config} hasAiContent={!!aiHeadlines} />
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
        <a href="#signup" className="inline-flex items-center justify-center rounded-sm border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted">Launch your paper</a>
      </div>
    </section>
  );
}

function Mockup({ config, aiHeadlines }: { config: Config; aiHeadlines: AiHeadlines | null }) {
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
              const sectionLabel = s.label || template?.label || "";
              const aiItems = aiHeadlines?.[sectionLabel];
              const items = aiItems && aiItems.length > 0
                ? aiItems
                : template?.items.map((it) => ({
                    headline: interpolate(it.headline, config),
                    body: interpolate(it.body, config),
                  })) ?? [];
              if (items.length === 0) return null;
              const isLastRow = i >= enabledSections.length - (enabledSections.length % 2 === 0 ? 2 : 1);
              return (
                <div key={s.id} className={`py-6 ${!isLastRow ? "border-b border-border/60" : ""} ${i % 2 === 1 ? "md:border-l md:border-border/60 md:pl-10" : ""}`}>
                  <p className="small-caps text-accent mb-4">{sectionLabel}</p>
                  <div className="space-y-5">
                    {items.map((it, j) => (
                      <article key={j}>
                        <h3 className="font-serif text-xl md:text-2xl leading-snug text-ink">{it.headline}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.body}</p>
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

function LaunchCTA({ config, hasAiContent }: { config: Config; hasAiContent: boolean }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedEmail = email.trim();
  const pubLabel = config.pubName?.trim() || config.city?.trim();
  const paperLabel = pubLabel ? `${pubLabel} paper` : "your paper";

  const handleSubmit = async () => {
    if (!trimmedEmail) {
      setError("Please enter your email.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await publisherSupabase.from("launch_requests").insert({
        email: trimmedEmail,
        city: config.city || null,
        state: config.state || null,
        pub_name: config.pubName || null,
        tagline: config.tagline || null,
        street: config.street || null,
        high_school: config.highSchool || null,
        sections: config.sections,
        has_ai_content: hasAiContent,
      });
      if (insertError) throw insertError;

      // Row saved — try to send a magic link. Don't gate success on this.
      try {
        const { error: otpError } = await publisherSupabase.auth.signInWithOtp({
          email: trimmedEmail,
          options: {
            emailRedirectTo: "https://daily-press-publisher.lovable.app/welcome",
          },
        });
        if (otpError) throw otpError;
        setMagicLinkSent(true);
      } catch (otpErr) {
        console.error("signInWithOtp failed", otpErr);
        setMagicLinkSent(false);
      }
      setDone(true);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="signup" className="mx-auto max-w-3xl px-6 py-24 border-t border-border text-center">
      {done ? (
        magicLinkSent ? (
          <>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Check your email.</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              We sent a link to {trimmedEmail} to set up your {paperLabel}. Open it from your email to continue.
            </p>
          </>
        ) : (
          <>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight">We saved your paper.</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Visit{" "}
              <a
                href="https://daily-press-publisher.lovable.app"
                className="underline hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                daily-press-publisher.lovable.app
              </a>{" "}
              to set it up — sign in with the same email.
            </p>
          </>
        )
      ) : (
        <>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight">Launch your paper.</h2>
          <p className="mt-4 text-muted-foreground text-lg">We'll set up your daily edition. Enter your email and we'll send you a link to continue.</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="launch-email" className="sr-only">Email address</label>
            <input
              id="launch-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@town.com"
              disabled={submitting}
              aria-label="Email address"
              className="flex-1 rounded-sm border border-border bg-paper px-4 py-3 text-sm outline-none focus:border-accent transition"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Launch your paper"}
            </button>
          </div>
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        </>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-5xl px-6 pb-16">
      <div className="h-px bg-accent/60" />
      <p className="mt-8 text-center text-xs text-muted-foreground">Daily Press - A framework for AI-powered local journalism </p>
    </footer>
  );
}

function interpolate(text: string, config: Config): string {
  const highSchool = config.highSchool.trim() || (config.city || "Town") + " High";
  return text
    .replaceAll("Medford City Council", (config.city || "Town") + " City Council")
    .replaceAll("Main Street", config.street || "Main Street")
    .replaceAll("Medford High", highSchool)
    .replaceAll("Faces of Medford", "Faces of " + (config.city || "Town"))
    .replaceAll("Medford", config.city || "Town");
}

function Configurator({
  config,
  setConfig,
  onGenerate,
  loading,
  error,
  onDownload,
}: {
  config: Config;
  setConfig: (c: Config) => void;
  onGenerate: () => void;
  loading: boolean;
  error: string | null;
  onDownload: () => void;
}) {
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
        
        <Field label="Main street name" hint="Optional" value={config.street} onChange={(v) => update({ street: v })} />
        <Field label="High school name" hint="Optional" value={config.highSchool} onChange={(v) => update({ highSchool: v })} />
      </div>

      <div className="mt-10">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 mb-4">
          <p className="small-caps text-accent">Sections</p>
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="sm:ml-auto w-full sm:w-auto rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="w-full sm:w-auto rounded-sm bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Download as HTML
          </button>
        </div>
        {error ? <p className="mb-3 text-sm text-destructive">{error}</p> : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.sections.map((s) => (
            <div key={s.id} className="flex items-center gap-3 border border-border rounded-sm px-4 py-3 bg-paper">
              <input
                id={`section-enabled-${s.id}`}
                type="checkbox"
                checked={s.enabled}
                onChange={(e) => updateSection(s.id, { enabled: e.target.checked })}
                aria-label={`Enable ${s.label || s.templateLabel} section`}
                className="h-4 w-4"
              />
              <label htmlFor={`section-label-${s.id}`} className="sr-only">{s.templateLabel} section label</label>
              <input
                id={`section-label-${s.id}`}
                type="text"
                value={s.label}
                onChange={(e) => updateSection(s.id, { label: e.target.value })}
                disabled={!s.enabled}
                aria-label={`${s.templateLabel} section label`}
                className="flex-1 bg-transparent text-sm outline-none disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function Field({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const reactId = React.useId();
  const inputId = `field-${reactId}`;
  return (
    <div className="block">
      <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {hint ? <span className="ml-2 text-xs font-normal text-muted-foreground">{hint}</span> : null}
      </label>
      <input id={inputId} type="text" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="w-full rounded-sm border border-border bg-paper px-4 py-2.5 text-sm outline-none focus:border-accent transition" />
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "edition";
}

function downloadHtml(config: Config, aiHeadlines: AiHeadlines | null) {
  const enabledSections = config.sections.filter((s) => s.enabled);
  const pubName = (config.pubName || "Daily Press").toUpperCase();
  const now = new Date();
  const today = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const ymd = now.toISOString().slice(0, 10);
  const cityState = [config.city, config.state].filter(Boolean).join(", ");

  const sectionsHtml = enabledSections.map((s) => {
    const template = SECTIONS.find((t) => t.label === s.templateLabel);
    const sectionLabel = s.label || template?.label || "";
    const aiItems = aiHeadlines?.[sectionLabel];
    const items = aiItems && aiItems.length > 0
      ? aiItems
      : template?.items.map((it) => ({
          headline: interpolate(it.headline, config),
          body: interpolate(it.body, config),
        })) ?? [];
    if (items.length === 0) return "";
    const articles = items.map((it) => `
      <article>
        <h3>${escapeHtml(it.headline)}</h3>
        <p>${escapeHtml(it.body)}</p>
      </article>`).join("");
    return `
      <div class="section">
        <p class="section-label">${escapeHtml(sectionLabel)}</p>
        ${articles}
      </div>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(config.pubName || "Daily Press")} — ${escapeHtml(today)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #ebe6dc; font-family: 'Inter', system-ui, sans-serif; color: #2b2620; padding: 40px 16px; }
  .paper { max-width: 960px; margin: 0 auto; background: #faf7f2; padding: 40px 24px; border: 1px solid rgba(40,30,15,0.1); box-shadow: 0 30px 60px -20px rgba(40,30,15,0.18), 0 8px 20px -8px rgba(40,30,15,0.12); }
  @media (min-width: 768px) { .paper { padding: 64px 56px; } }
  .masthead { text-align: center; }
  .rule { height: 1px; background: rgba(43,38,32,0.8); }
  .masthead h1 { font-family: 'Playfair Display', serif; font-weight: 900; letter-spacing: -0.02em; font-size: 40px; margin: 12px 0; color: #2b2620; }
  @media (min-width: 768px) { .masthead h1 { font-size: 72px; } }
  .tagline { font-family: 'Playfair Display', serif; font-style: italic; margin-top: 12px; color: #6b6358; }
  .dateline { margin-top: 8px; font-size: 12px; letter-spacing: 0.05em; color: #6b6358; }
  .grid { margin-top: 40px; display: grid; grid-template-columns: 1fr; column-gap: 40px; }
  @media (min-width: 768px) { .grid { grid-template-columns: 1fr 1fr; } }
  .section { padding: 24px 0; border-bottom: 1px solid rgba(40,30,15,0.15); }
  @media (min-width: 768px) { .grid > .section:nth-child(even) { border-left: 1px solid rgba(40,30,15,0.15); padding-left: 40px; } }
  .section-label { font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.15em; font-size: 11px; color: #7a8a6b; margin: 0 0 16px; font-weight: 500; }
  article { margin-bottom: 20px; }
  article h3 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 22px; line-height: 1.25; margin: 0; color: #2b2620; }
  @media (min-width: 768px) { article h3 { font-size: 26px; } }
  article p { margin: 8px 0 0; font-size: 14px; line-height: 1.6; color: #6b6358; }
  .footer-rule { height: 1px; background: rgba(40,30,15,0.15); margin-top: 32px; }
  .footer { font-family: 'Playfair Display', serif; font-style: italic; text-align: center; font-size: 12px; color: #6b6358; margin-top: 16px; }
</style>
</head>
<body>
  <div class="paper">
    <div class="masthead">
      <div class="rule"></div>
      <h1>${escapeHtml(pubName)}</h1>
      <div class="rule"></div>
      <p class="tagline">${escapeHtml(config.tagline || "Your daily local read")}</p>
      <p class="dateline">${escapeHtml(today)}${cityState ? " — " + escapeHtml(cityState) : ""}</p>
    </div>
    <div class="grid">${sectionsHtml}
    </div>
    <div class="footer-rule"></div>
    <p class="footer">Edition ${escapeHtml(today)} — published by ${escapeHtml(config.pubName || "Daily Press")}</p>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slugify(config.pubName || "edition")}-${ymd}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}



