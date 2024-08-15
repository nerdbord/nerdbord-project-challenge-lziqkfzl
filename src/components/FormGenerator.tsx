"use client";
import React, { useState } from "react";
import { checkUserInDatabase } from "@/actions/user";
import { generateForm, saveForm } from "@/actions/form";
import { Form } from "@/components/Form";
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
        return;
      }

      const savedForm = await saveForm({
        userId: user.id,
        name: formName,
        description: formDescription || "Wygenerowany przez AI",
        fields: form.fields,
      });

      setMsg("Formularz zapisany pomyślnie. Przekierowywanie do formularzy...");
      setTimeout(() => {
        router.push("/forms");
      }, 2000);
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
      setMsg(`Nie udało się wygenerować formularza - ${err}`);
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

  const handleReset = () => {
    setForm(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container flex flex-col  justify-center p-4 max-w-lg ">
        {form ? (
          <div className="flex flex-col gap-y-3 border p-8 rounded-2xl mt-28">
            <div className="form-control mb-4  ">
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Wpisz nazwę formularza"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control mb-4">
              <textarea
                rows={3}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Wpisz krótki opis formularza"
                className="textarea textarea-bordered w-full noresize border"
              />
            </div>

            {isEdited !== null ? (
              <div className="flex flex-col gap-y-3">
                <label className="label-text mb-2">
                  Label
                  <input
                    type="text"
                    value={form?.fields[isEdited].label || ""}
                    onChange={(e) =>
                      handleFieldChange(isEdited, "label", e.target.value)
                    }
                    className="input input-bordered w-full mt-2"
                  />
                </label>
                <label className="label-text mb-2">
                  Placeholder
                  <input
                    type="text"
                    value={form?.fields[isEdited].placeholder || ""}
                    onChange={(e) =>
                      handleFieldChange(isEdited, "placeholder", e.target.value)
                    }
                    className="input input-bordered w-full mt-2"
                  />
                </label>
                <label className="label-text mb-2">
                  Rodzaj pola
                  <select
                    value={form?.fields[isEdited].type || "text"}
                    onChange={(e) =>
                      handleFieldChange(isEdited, "type", e.target.value)
                    }
                    className="select select-bordered w-full mt-2"
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Select</option>
                    <option value="email">Email</option>
                    <option value="number">Number</option>
                    <option value="file">File</option>
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                  </select>
                </label>
                {form?.fields[isEdited].type === "select" && (
                  <label className="label">
                    <span className="label-text">Typ formularza</span>
                    <input
                      type="text"
                      value={form?.fields[isEdited].options?.join(", ") || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          isEdited,
                          "options",
                          e.target.value
                            .split(",")
                            .map((opt) => opt.trim())
                            .join(",")
                        )
                      }
                      placeholder="Opcje oddzielone przecinkami"
                    />
                  </label>
                )}
                <button
                  type="button"
                  onClick={saveField}
                  className="btn btn-success mt-2"
                >
                  Zapisz
                </button>
              </div>
            ) : (
              <Form
                fields={form.fields}
                isEdited={isEdited}
                onStartEditing={startEditing}
              />
            )}
            {msg && <p className=" text-center text-pink-500">{msg}</p>}
            <button
              type="button"
              className={`btn btn-secondary w-full `}
              disabled={loading || isEdited !== null}
              onClick={handleSaveForm}
            >
              {loading ? "Zapisywanie..." : "Zapisz formularz"}
            </button>
            <button
              type="button"
              className={`btn btn-primary w-full `}
              disabled={loading || isEdited !== null}
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
                className="input input-bordered w-full h-24 p-4 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className={`btn btn-primary w-full`}
              disabled={loading || isEdited !== null}
            >
              {loading ? "Generuje..." : "Wygeneruj mój formularz"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
