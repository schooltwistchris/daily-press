import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional().default(""),
  pubName: z.string().max(200).optional().default(""),
  mayor: z.string().max(100).optional().default(""),
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

    const prompt = `Generate plausible local newspaper headlines for ${data.city}${data.state ? ", " + data.state : ""}.
Publication: ${data.pubName || "the local paper"}.
${data.mayor ? `Mayor's last name: ${data.mayor}.` : ""}
${data.street ? `A main street: ${data.street}.` : ""}
${data.highSchool ? `The local high school: ${data.highSchool}.` : ""}

For each of these sections, return exactly 2 fresh, specific, locally-plausible news items (headline + 1-2 sentence body). Be concrete: use names, numbers, dates, places. Tone: restrained editorial newspaper.

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
