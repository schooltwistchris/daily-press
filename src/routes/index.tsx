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
  return (
    <main className="min-h-screen">
      <Hero />
      <Mockup />
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

function Mockup() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="bg-paper px-6 py-10 md:px-14 md:py-16 shadow-[0_30px_60px_-20px_rgba(40,30,15,0.18),0_8px_20px_-8px_rgba(40,30,15,0.12)] border border-border/40">
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
            Saturday, May 23, 2026 - Medford, Massachusetts
          </p>
        </div>

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
          Edition May 23, 2026 - published by Medford Mercury
        </p>
      </div>
    </section>
  );
}
