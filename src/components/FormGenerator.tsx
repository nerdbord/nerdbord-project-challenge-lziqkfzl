"use client";
import React, { useState, useEffect } from "react";
import { checkUserInDatabase } from "@/actions/user";
import { generateForm, saveForm } from "@/actions/form";
import { Form } from "@/components/Form";
import { FormFieldEditor } from "@/components/FormFieldEditor";
import { useRouter } from "next/navigation";

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
  const [formName, setFormName] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const restoreForm = async () => {
      const unsavedForm = sessionStorage.getItem("unsavedForm");
      if (unsavedForm) {
        const { form, formName, formDescription } = JSON.parse(unsavedForm);
        setForm(form);
        setFormName(formName);
        setFormDescription(formDescription);

        const user = await checkUserInDatabase();

        if (user && typeof user !== "string") {
          try {
            setLoading(true);
            const savedForm = await saveForm({
              userId: user.id,
              name: formName,
              description: formDescription || "Wygenerowany przez AI",
              fields: form.fields,
            });
            sessionStorage.removeItem("unsavedForm");
            setMsg("Formularz zapisany pomyślnie.");
          } catch (err) {
            setMsg("Nie udało się zapisać formularza. Spróbuj ponownie.");
          } finally {
            setLoading(false);
          }
        } else {
          setMsg("Aby zapisać formularz musisz być zalogowany.");
        }
      }
    };

    restoreForm();
  }, []);

  const handleSaveForm = async () => {
    if (!form) {
      setMsg("Nie ma formularza do zapisania.");
      return;
    }

    if (!formName.trim()) {
      setMsg("Proszę podać nazwę formularza.");
      return;
    }

    setLoading(true);
    setMsg(null);
    try {
      const user = await checkUserInDatabase();

      if (!user || typeof user === "string") {
        setMsg("Aby zapisać formularz musisz być zalogowany.");
        saveFormToSession();
        return;
      }

      const savedForm = await saveForm({
        userId: user.id,
        name: formName,
        description: formDescription || "Wygenerowany przez AI",
        fields: form.fields,
      });

      setMsg("Formularz zapisany pomyślnie. Przekierowywanie do formularzy...");
      sessionStorage.removeItem("unsavedForm");
      setTimeout(() => {
        router.push("/forms");
      }, 2000);
    } catch (err) {
      setMsg("Nie udało się zapisać formularza. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const saveFormToSession = () => {
    const formState = {
      form,
      formName,
      formDescription,
    };
    sessionStorage.setItem("unsavedForm", JSON.stringify(formState));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (isEdited !== null) return;
    setLoading(true);
    setMsg(null);
    try {
      e.preventDefault();
      const generatedForm = await generateForm(prompt);
      setForm(generatedForm);

      setFormName(extractFormTitleFromPrompt(prompt));
      setFormDescription(prompt);
    } catch (err) {
      setMsg(`Nie udało się wygenerować formularza - ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const extractFormTitleFromPrompt = (prompt: string): string => {
    const maxLength = 30;
    const trimmedTitle = prompt.trim().split(".")[0];
    return trimmedTitle.length > maxLength
      ? trimmedTitle.slice(0, maxLength) + "..."
      : trimmedTitle;
  };

  const handleFieldChange = (index: number, updatedField: FormField) => {
    if (!form) return;

    const updatedFields = [...form.fields];
    updatedFields[index] = updatedField;

    setForm({ ...form, fields: updatedFields });
    setIsEdited(null);
  };

  const startEditing = (index: number) => {
    setIsEdited(index);
  };

  const deleteField = (index: number) => {
    if (!form) return;

    const updatedFields = form.fields.filter((_, i) => i !== index);

    setForm({ ...form, fields: updatedFields });
    setIsEdited(null);
  };

  const handleReset = () => {
    setForm(null);
    setFormName("");
    setFormDescription("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container flex flex-col justify-center p-4 max-w-lg">
        {form ? (
          <div className="flex flex-col gap-y-3 border bg-white p-8 rounded-2xl mt-28">
            <div className="form-control mb-4">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Wpisz nazwę formularza"
                className="input input-bordered w-full bg-inherit"
              />
            </div>
            <div className="form-control mb-4">
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Wygenerowany przez AI"
                className="textarea textarea-bordered w-full noresize border  bg-inherit"
              />
            </div>

            {isEdited !== null ? (
              <FormFieldEditor
                field={form.fields[isEdited]}
                onSave={(updatedField) =>
                  handleFieldChange(isEdited, updatedField)
                }
                onDelete={() => deleteField(isEdited)}
              />
            ) : (
              <Form
                fields={form.fields}
                isEdited={isEdited}
                onStartEditing={startEditing}
              />
            )}
            {msg && (
              <p className="text-center text-accent absolute left-0 right-0 bottom-9">
                {msg}
              </p>
            )}
            <button
              type="button"
              className={`btn btn-accent w-full mt-2`}
              disabled={loading || isEdited !== null}
              onClick={handleSaveForm}
            >
              {loading ? "Zapisywanie..." : "Zapisz formularz"}
            </button>
            <button
              type="button"
              className="btn  w-full "
              onClick={handleReset}
            >
              Generuj nowy formularz
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mb-4">
            <h1 className="text-center text-3xl not-italic font-semibold leading-10">
              Generuj formularz za pomocą AI
            </h1>
            <p className="text-center text-base not-italic font-semibold leading-6 py-6">
              Stwórz formularz. Udostępnij go. Zbieraj dane.
            </p>
            <div className="form-control mb-4">
              <textarea
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Opisz, jakiego formularza potrzebujesz"
                className="input input-bordered w-full h-24 p-4 rounded-lg bg-white"
              />
            </div>
            <button type="submit" className={`btn btn-accent w-full`}>
              {loading ? "Generuje..." : "Wygeneruj mój formularz"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
