"use server";

import { generateText, generateObject } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";

//custom Nerdbord OpenAI client
const openai = createOpenAI({
  fetch: async (url, options) => {
    const fullUrl =
      "https://training.nerdbord.io/api/v1/openai/chat/completions";
    console.log(`Fetching ${fullUrl}`);
    const result = await fetch(fullUrl, options);
    console.log(`Fetched ${fullUrl}`);
    console.log();
    return result;
  },
});

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
