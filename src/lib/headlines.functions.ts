import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional().default(""),
  pubName: z.string().max(200).optional().default(""),
  street: z.string().max(200).optional().default(""),
  highSchool: z.string().max(200).optional().default(""),
  sections: z.array(z.string().min(1).max(100)).min(1).max(20),
});

export const generateHeadlines = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const itemSchema = z.object({
      headline: z.string(),
      body: z.string(),
    });
    const sectionsShape = data.sections.reduce<Record<string, z.ZodArray<typeof itemSchema>>>(
      (acc, label) => {
        acc[label] = z.array(itemSchema).length(2);
        return acc;
      },
      {},
    );

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/New_York",
    });

    const prompt = `You are writing headlines for a hyperlocal newspaper published TODAY, ${today}. Any event dates mentioned in the headlines or body must be either today or in the future relative to ${today}. Do not reference events from past months.

Location: ${data.city}${data.state ? ", " + data.state : ""}.
Publication: ${data.pubName || "the local paper"}.
${data.street ? `A main street: ${data.street}.` : ""}
${data.highSchool ? `The local high school: ${data.highSchool}.` : ""}

For headlines about local government, use the correct form of government for the city specified (e.g., mayor for cities like Boston, town administrator and select board for many Massachusetts towns, city manager for council-manager cities). Invent a plausible name for whoever holds that role. Match the title to the actual form of government in the city — do not call someone "Mayor" in a town that uses a Town Administrator system.

For each of these sections, return exactly 2 fresh, specific, locally-plausible news items (headline + 1-2 sentence body). Be concrete: use names, numbers, dates, places. When you reference a date, use ${today} or a future date (e.g. "this Saturday", "next Tuesday", a specific upcoming date). Tone: restrained editorial newspaper.

Sections: ${data.sections.join(", ")}

Return JSON with one key per section label, each containing an array of 2 items with "headline" and "body" fields.`;

    const { experimental_output } = await generateText({
      model,
      prompt,
      experimental_output: Output.object({
        schema: z.object(sectionsShape),
      }),
    });

    return experimental_output as Record<string, { headline: string; body: string }[]>;
  });
