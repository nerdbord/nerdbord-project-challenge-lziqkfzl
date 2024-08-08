"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@/lib/openai";

export const generateForm = async (prompt: string) => {
  const result = await generateObject({
    model: openai("gpt-4o"),
    prompt: prompt,
    schema: z.object({
      fields: z
        .array(
          z.object({
            name: z.string().describe("the name of the form field"),
            type: z
              .string()
              .describe(
                "the type of the form field (e.g., text, number, email)"
              ),
            label: z.string().describe("the label for the form field"),
            placeholder: z
              .string()
              .optional()
              .describe("the placeholder for the form field"),
            required: z
              .boolean()
              .optional()
              .describe("whether the field is required or not"),
          })
        )
        .describe("the fields of the form"),
    }),
  });

  return result.object;
};
