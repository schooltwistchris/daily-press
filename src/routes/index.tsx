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
  return <div>Sections loaded: {SECTIONS.length}</div>;
}
