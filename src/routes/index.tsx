import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Daily Press — Hyperlocal newspapers, on autopilot" },
      {
        name: "description",
        content:
          "Daily Press is the framework powering AI-generated hyperlocal news. Design your masthead, pick your beats, deploy a daily edition that writes itself.",
      },
      { property: "og:title", content: "Daily Press" },
      {
        property: "og:description",
        content: "A framework for launching hyperlocal daily HTML newspapers.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
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
        body: "Team 6431, the Mustang Mechatronics, edged out Brookline in a 78–74 semifinal at WPI on Wednesday and will compete in Worcester next weekend.",
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
        headline: "Local Gallery Opens 'Faces of Medford' Exhibit",
        body: "Photographer Lena Ortiz spent two years documenting longtime residents. The opening reception is Friday at 6 p.m. at the Riverbend space.",
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        headline: "Farmers Market Saturday 9am–1pm at Riverside Plaza",
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
  return (
    <main className="min-h-screen">
      <Hero />
      <Mockup />
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
        <a
          href="https://medford-mercury.pages.dev"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-sm bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90"
        >
          See a live example
        </a>
        <a
          href="#signup"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center justify-center rounded-sm border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          Get notified at launch
        </a>
      </div>
    </section>
  );
}

function Mockup() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div
        className="bg-paper px-6 py-10 md:px-14 md:py-16 shadow-[0_30px_60px_-20px_rgba(40,30,15,0.18),0_8px_20px_-8px_rgba(40,30,15,0.12)] border border-border/40"
      >
        {/* Masthead */}
        <div className="text-center">
          <div className="h-px bg-ink/80" />
          <h2 className="font-serif font-black tracking-tight text-4xl sm:text-5xl md:text-7xl py-3 text-ink">
            MEDFORD MERCURY
          </h2>
          <div className="h-px bg-ink/80" />
          <p className="font-serif italic mt-3 text-muted-foreground">
            Your daily local read
          </p>
          <p className="mt-2 text-xs tracking-wide text-muted-foreground">
            Saturday, May 23, 2026 · Medford, Massachusetts
          </p>
        </div>

        {/* Body */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-10">
          {SECTIONS.map((s, i) => (
            <div
              key={s.label}
              className={`py-6 ${i < SECTIONS.length - (SECTIONS.length % 2 === 0 ? 2 : 1) ? "border-b border-border/60" : ""} ${i % 2 === 1 ? "md:border-l md:border-border/60 md:pl-10" : ""}`}
            >
              <p className="small-caps text-accent mb-4">{s.label}</p>
              <div className="space-y-5">
                {s.items.map((it) => (
                  <article key={it.headline}>
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
          ))}
        </div>

        <div className="mt-8 h-px bg-border" />
        <p className="font-serif italic text-center text-xs text-muted-foreground mt-4">
          Edition May 23, 2026 — published by Medford Mercury
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
