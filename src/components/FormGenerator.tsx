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
        <button
          type="submit"
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      {form && (
        <form>
          {form.fields.map((field, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-2">
                {field.label}
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.placeholder}
                    className="textarea"
                    required={field.required}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    className="select"
                    required={field.required}
                  >
                    {field.options?.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="input"
                    required={field.required}
                  />
                )}
              </label>
            </div>
          ))}
        </form>
      )}
    </div>
  );
};
