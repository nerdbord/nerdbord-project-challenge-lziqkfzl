"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { getFormById, saveSubmittedForm } from "@/actions/form";

type FormField = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  class?: string;
  options?: string[];
};

type FormType = {
  id: string;
  name: string;
  description: string;
  fields: FormField[];
  userId: string;
};

const fetcher = async (id: string): Promise<FormType> => {
  const formId = Array.isArray(id) ? id[0] : id;
  if (!formId) throw new Error("Invalid form ID");
  const fetchedForm = await getFormById(formId);
  return {
    id: fetchedForm?.id ?? "",
    name: fetchedForm?.name || "Unnamed Form",
    description: fetchedForm?.description || "",
    fields: (fetchedForm?.fields as FormField[]) || [],
    userId: fetchedForm?.userId || "",
  };
};

export const ReadyForm: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const { data: form, error } = useSWR<FormType>(id as string, fetcher);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    name: string
  ) => {
    const { type, checked, value, files } = e.target as HTMLInputElement;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files
            ? Array.from(files)
            : null
          : value,
    }));
  };

  const validateForm = () => {
    if (!form) return false;

    for (const field of form.fields) {
      if (field.required && !formValues[field.name]) {
        setMsg(`Pole "${field.label}" jest wymagane.`);
        return false;
      }
    }
    return true;
  };

  const handleSaveForm = async () => {
    if (!form) return;

    setMsg(null);

    if (!validateForm()) {
      setMsg("Wystąpił błąd podczas walidacji formularza");
      return;
    }

    setSaving(true);

    try {
      const result = await saveSubmittedForm({
        formId: form.id,
        fields: formValues,
        userId: form.userId,
      });
      router.push("/public/thankyou");
    } catch (error) {
      setMsg("Failed to save form: " + error);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <div>Error loading form: {error.message}</div>;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="container flex flex-col justify-center p-4 max-w-lg">
          {form ? (
            <div className="flex flex-col gap-y-3 border p-8 rounded-2xl mt-28 bg-white">
              <h2 className="text-center text-2xl not-italic font-semibold leading-8">
                {form.name}
              </h2>
              <p className="text-center text-base not-italic font-normal leading-6">
                {form.description}
              </p>

              {form.fields.map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-neutral-800 mb-2">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      placeholder={field.placeholder}
                      className="textarea textarea-bordered w-full bg-inherit"
                      onChange={(e) => handleInputChange(e, field.name)}
                    />
                  ) : field.type === "select" ? (
                    <select
                      className="select select-bordered w-full bg-inherit"
                      onChange={(e) => handleInputChange(e, field.name)}
                    >
                      {field.options?.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "radio" && field.options ? (
                    field.options.map((option, idx) => (
                      <div key={idx} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name={field.name}
                          value={option}
                          className="radio checked:bg-white mr-2"
                          onChange={(e) => handleInputChange(e, field.name)}
                        />
                        <label className="label-text text-neutral-800 bg-inherit">
                          {option}
                        </label>
                      </div>
                    ))
                  ) : field.type === "checkbox" ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name={field.name}
                        className="checkbox checkbox-bordered mr-2 bg-inherit"
                        onChange={(e) => handleInputChange(e, field.name)}
                      />
                      <label className="label-text text-neutral-800">
                        {field.label}
                      </label>
                    </div>
                  ) : field.type === "color" ? (
                    <input
                      type="color"
                      name={field.name}
                      className=" h-10 border-2 border-gray-300 rounded-md"
                      onChange={(e) => handleInputChange(e, field.name)}
                    />
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className={`${
                        field.type === "text" ||
                        field.type === "email" ||
                        field.type === "password" ||
                        field.type === "number"
                          ? "input input-bordered w-full bg-inherit"
                          : field.type === "file"
                          ? "file-input file-input-bordered w-full bg-inherit"
                          : "input input-bordered w-full bg-inherit"
                      }`}
                      onChange={(e) => handleInputChange(e, field.name)}
                    />
                  )}
                </div>
              ))}

              {msg && <p className="text-center text-pink-500">{msg}</p>}

              <button
                type="button"
                className="btn mt-6"
                onClick={handleSaveForm}
                disabled={saving}
              >
                {saving ? "Wysyłanie..." : "Wyślij moją odpowiedź"}
              </button>
            </div>
          ) : (
            <p>Ładowanie szczegółów formularza...</p>
          )}
        </div>
      </div>
    </>
  );
};
