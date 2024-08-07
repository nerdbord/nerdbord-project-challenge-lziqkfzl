"use server";

import { generateText, DeepPartial, streamObject, generateObject } from "ai";
import { createStreamableValue } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const generateTextAction = async () => {
  const result = await generateText({
    model: openai("gpt-4o"),
    temperature: 1,
    prompt: "Tell me a joke.",
  });
  return result.text;
};

export const describeImage = async () => {
  const result = await generateText({
    model: openai("gpt-4o"),
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Describe the image in detail." },
          {
            type: "image",
            image:
              "https://github.com/vercel/ai/blob/main/examples/ai-core/data/comic-cat.png?raw=true",
          },
        ],
      },
    ],
  });
  return result.text;
};

export const generateJoke = async () => {
  const result = await generateObject({
    model: openai("gpt-4o"),
    prompt: "Tell me a joke.",
    schema: z.object({
      setup: z.string().describe("the setup of the joke"),
      punchline: z.string().describe("the punchline of the joke"),
    }),
  });

  console.log(result.object);
};

generateJoke();
