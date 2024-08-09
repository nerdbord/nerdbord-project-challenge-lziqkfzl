"use client";
import React, { useState } from "react";
import { generateForm } from "@/actions/form";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    if (isEdited !== null) return;
    setLoading(true);
    setError(null);
    try {
      e.preventDefault();
      const generatedForm = await generateForm(prompt);
      setForm(generatedForm);
    } catch (err) {
      setError("Failed to generate form. Please try again.");
      setLoading(false);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Generator</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text">Prompt</span>
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt"
            className="input input-bordered w-full"
          />
        </div>
        <button
          type="submit"
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading || isEdited !== null}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {form && (
        <form>
          {form.fields.map((field, index) => (
            <div key={index} className="mb-4">
              {isEdited === index ? (
                <div className="space-y-2">
                  <label className="label">
                    <span className="label-text">Label</span>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        handleFieldChange(index, "label", e.target.value)
                      }
                    />
                  </label>
                  <label className="label">
                    <span className="label-text">Placeholder</span>
                    <input
                      type="text"
                      value={field.placeholder || ""}
                      onChange={(e) =>
                        handleFieldChange(index, "placeholder", e.target.value)
                      }
                    />
                  </label>
                  <label className="label">
                    <span className="label-text">Type</span>
                    <select
                      value={field.type}
                      onChange={(e) =>
                        handleFieldChange(index, "type", e.target.value)
                      }
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
                  {field.type === "select" && (
                    <label className="label">
                      <span className="label-text">Options</span>
                      <input
                        type="text"
                        value={field.options?.join(", ") || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "options",
                            e.target.value
                              .split(",")
                              .map((opt) => opt.trim())
                              .join(",")
                          )
                        }
                        placeholder="Comma-separated options"
                      />
                    </label>
                  )}
                  <button
                    type="button"
                    onClick={saveField}
                    className="btn btn-success mt-2"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <label className="label">
                    <span className="label-text">{field.label}</span>
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      placeholder={field.placeholder}
                      className="textarea textarea-bordered w-full"
                    />
                  ) : field.type === "select" ? (
                    <select className="select select-bordered w-full" disabled>
                      {field.options?.map((option, idx) => (
                        <option key={idx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input type={field.type} placeholder={field.placeholder} />
                  )}
                  <button
                    type="button"
                    onClick={() => startEditing(index)}
                    className="btn btn-info mt-2"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </form>
      )}
    </div>
  );
};
