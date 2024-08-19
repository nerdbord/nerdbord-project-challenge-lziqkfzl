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
  const formFieldSchema = z.object({
    name: z.string(),
    type: z.enum([
      "text",
      "textarea",
      "select",
      "email",
      "number",
      "file",
      "radio",
      "checkbox",
      "password",
      "date",
      "time",
      "toggle",
      "url",
      "color",
    ]),
    label: z.string(),
    placeholder: z.string().optional(),
    required: z.boolean().optional(),
    class: z.string().optional(),
    options: z.array(z.string()).optional(),
  });

  const saveFormSchema = z.object({
    id: z.string().cuid().optional(),
    userId: z.string().cuid(),
    name: z.string().min(1, "Form name is required"),
    description: z.string().optional(),
    fields: z.array(formFieldSchema),
  });

  type SaveFormData = z.infer<typeof saveFormSchema>;

  const validatedData = saveFormSchema.parse(data);

  try {
    if (validatedData.id) {
      const updatedForm = await prisma.form.update({
        where: {
          id: validatedData.id,
        },
        data: {
          name: validatedData.name,
          description: validatedData.description,
          fields: validatedData.fields,
        },
      });
      return updatedForm;
    } else {
      const newForm = await prisma.form.create({
        data: {
          userId: validatedData.userId,
          name: validatedData.name,
          description: validatedData.description || "Wygenerowany przez AI",
          fields: validatedData.fields,
        },
      });
      return newForm;
    }
  } catch (error) {
    console.error("Error saving form:", error);
    throw new Error("Nie udało się zapisać formularza.");
  }
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
      return "No forms found for the user.";
    }

    return forms;
  } catch (error) {
    console.error("Failed to load forms:", error);
    return error;
  }
}
export const deleteForm = async (id: string) => {
  if (!id) {
    console.error("No form ID provided");
    return;
  }

  try {
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

export const getFormById = async (id: string) => {
  try {
    const form = await prisma.form.findUnique({
      where: { id },
    });
    if (!form) {
      console.error("Form not found");
      return;
    }
    return form;
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    throw error;
  }
};

export const saveSubmittedForm = async (data: {
  formId: string;
  fields: { [key: string]: any };
  userId?: string;
}) => {
  const saveSubmittedFormSchema = z.object({
    formId: z.string().cuid(),
    fields: z.record(z.any()),
    userId: z.string().cuid().optional(),
  });

  const validatedData = saveSubmittedFormSchema.parse(data);

  try {
    const newSubmission = await prisma.submitedForm.create({
      data: {
        formId: validatedData.formId,
        userId: validatedData.userId || "User not logged in",
        fields: validatedData.fields,
      },
    });
    return newSubmission;
  } catch (error) {
    console.error("Error saving submitted form:", error);
    throw new Error("Nie udało się zapisać wypełnionego formularza.");
  }
};
