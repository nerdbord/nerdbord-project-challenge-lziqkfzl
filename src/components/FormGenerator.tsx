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
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    setError(null);
    try {
      e.preventDefault();
      const generatedForm = await generateForm(prompt);
      setForm(generatedForm);
    } catch (err) {
      setError("Failed to generate form. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (
    index: number,
    key: keyof FormField,
    value: any
  ) => {
    if (!form) return;
    const updatedFields = form.fields.map((field, i) =>
      i === index ? { ...field, [key]: value } : field
    );
    setForm({ ...form, fields: updatedFields });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const getDaisyUIClasses = (type: string) => {
    switch (type) {
      case "text":
      case "number":
      case "email":
      case "password":
        return "input input-bordered w-full";
      case "checkbox":
        return "checkbox checkbox-primary";
      case "radio":
        return "radio radio-primary";
      case "textarea":
        return "textarea textarea-bordered w-full";
      case "select":
        return "select select-bordered w-full";
      case "range":
        return "range range-primary";
      case "file":
        return "file-input file-input-bordered file-input-accent w-full max-w-xs";
      default:
        return "input input-bordered w-full";
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Form Generator</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-4">
        <div className="form-control">
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
        <div className="flex gap-2">
          <button
            type="submit"
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          {form && (
            <button className="btn btn-secondary" onClick={toggleEdit}>
              {isEditing ? "Save" : "Edit"}
            </button>
          )}
        </div>
      </form>
      {error && <p className="text-red-500">{error}</p>}

      {form && (
        <div>
          <form>
            {form.fields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        handleFieldChange(index, "label", e.target.value)
                      }
                      placeholder="Edit label"
                      className="input input-bordered"
                    />
                  ) : (
                    field.label
                  )}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    required={field.required}
                    onChange={(e) =>
                      isEditing &&
                      handleFieldChange(index, "placeholder", e.target.value)
                    }
                    className={getDaisyUIClasses(field.type)}
                  >
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={(e) =>
                      isEditing &&
                      handleFieldChange(index, "placeholder", e.target.value)
                    }
                    className={getDaisyUIClasses(field.type)}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    onChange={(e) =>
                      isEditing &&
                      handleFieldChange(index, "placeholder", e.target.value)
                    }
                    className={getDaisyUIClasses(field.type)}
                  />
                )}
              </div>
            ))}
          </form>
        </div>
      )}
    </div>
  );
};
