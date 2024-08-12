"use client";
import React, { useState } from "react";
import { checkUserInDatabase } from "@/actions/user";
import { generateForm, saveForm } from "@/actions/form";
import { Form } from "@/components/Form";

type FormField = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  class?: string;
  options?: string[];
};

type Form = {
  fields: FormField[];
};

export const FormGenerator: React.FC = () => {
  const [form, setForm] = useState<Form | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<number | null>(null);

  const handleSaveForm = async () => {
    if (!form) {
      setMsg("Nie ma formularza do zapisania.");
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const user = await checkUserInDatabase();

      if (!user || typeof user === "string") {
        setMsg("Nie znaleziono użytkownika w bazie danych.");
        return;
      }

      const savedForm = await saveForm({
        userId: user.id,
        name: "Wygenerowany Formularz",
        description: "Dynamically generated form",
        fields: form.fields,
      });
      console.log("Formularz zapisany pomyślnie", savedForm);
    } catch (err) {
      setMsg("Nie udało się zapisać formularza. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (isEdited !== null) return;
    setLoading(true);
    setMsg(null);
    try {
      e.preventDefault();
      const generatedForm = await generateForm(prompt);
      setForm(generatedForm);
    } catch (err) {
      setMsg("Nie udało się wygenerować formularza. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (
    index: number,
    field: keyof FormField,
    value: string
  ) => {
    if (!form) return;

    const updatedFields = [...form.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value,
    };

    setForm({ ...form, fields: updatedFields });
  };

  const startEditing = (index: number) => {
    setIsEdited(index);
  };

  const saveField = () => {
    setIsEdited(null);
  };

  return (
    <div className="flex items-center justify-center h-svh">
      <div className="container flex flex-col justify-center p-4 max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Generuj formularz za pomocą AI
        </h1>
        <p className="mb-4 text-center">
          Stwórz formularz. Udostępnij go. Zbieraj dane.
        </p>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="form-control mb-4">
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Opisz, jakiego formularza potrzebujesz"
              className="input input-bordered w-full"
            />
          </div>
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading || isEdited !== null}
          >
            {loading ? "Generuje..." : "Wygeneruj mój formularz"}
          </button>
          {/*       <button
            type="button"
            className={`btn btn-secondary ${loading ? "loading" : ""}`}
            disabled={loading || isEdited !== null}
            onClick={handleSaveForm}
          >
            {loading ? "Saving..." : "Save"}
          </button> */}
        </form>
        {msg && <p className="text-red-500">{msg}</p>}
        {form && (
          <Form
            fields={form.fields}
            isEdited={isEdited}
            onFieldChange={handleFieldChange}
            onStartEditing={startEditing}
            onSaveField={saveField}
          />
        )}
      </div>
    </div>
  );
};
