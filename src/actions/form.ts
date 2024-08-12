"use server";

import { generateObject } from "ai";
import { z } from "zod";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { checkUserInDatabase } from "@/actions/user";

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
                "the type of the form field (e.g., text, number, email, textarea, select)"
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

            options: z
              .array(z.string())
              .optional()
              .describe("the options for select field"),
          })
        )
        .describe("the fields of the form"),
    }),
  });

  return result.object;
};

export const saveForm = async (data: any) => {
  const saveFormSchema = z.object({
    userId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    fields: z.array(
      z.object({
        name: z.string(),
        type: z.string(),
        label: z.string(),
        placeholder: z.string().optional(),
        required: z.boolean().optional(),
        options: z.array(z.string()).optional(),
      })
    ),
  });

  const parsedData = saveFormSchema.safeParse(data);

  if (!parsedData.success) {
    throw new Error("Invalid form data");
  }

  const { userId, name, description, fields } = parsedData.data;

  const form = await prisma.form.create({
    data: {
      name,
      description,
      userId,
      fields: {
        create: fields.map((field) => ({
          name: field.name,
          type: field.type,
          label: field.label,
          placeholder: field.placeholder,
          required: field.required ?? false,
          options: field.options ?? [],
        })),
      },
    },
    include: {
      fields: true,
    },
  });

  return form;
};

export async function getUserForms() {
  try {
    const user = await checkUserInDatabase();

    if (!user || typeof user === "string") {
      return "Authenticated user not found or has no ID.";
    }

    const forms = await prisma.form.findMany({
      where: { userId: user.id },
    });

    if (!forms || forms.length === 0) {
      return "No expenses found for the user.";
    }

    return forms;
  } catch (error) {
    console.error("Failed to load expenses:", error);
    return error;
  }
}

export const deleteForm = async (id: string) => {
  if (!id) {
    console.error("No form ID provided");
    return;
  }

  try {
    await prisma.formField.deleteMany({
      where: {
        formId: id,
      },
    });

    const form = await prisma.form.delete({
      where: {
        id,
      },
    });

    return form;
  } catch (error) {
    console.error("Error deleting form:", error);
    return;
  }
};
