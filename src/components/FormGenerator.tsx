"use client";
import React, { useState, useEffect } from "react";
import { generateForm as generateFormAction } from "@/actions/form";

type FormField = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
};

type Form = {
  fields: FormField[];
};

export const FormGenerator: React.FC = () => {
  const [form, setForm] = useState<Form | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const generateForm = async (prompt: string): Promise<Form | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateFormAction(prompt);
      return result;
    } catch (err) {
      setError("Failed to generate form. Please try again.");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const generatedForm = await generateForm(prompt);
    setForm(generatedForm);
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
            <div key={index}>
              <label>
                {field.label} {field.type}
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              </label>
            </div>
          ))}
        </form>
      )}
    </div>
  );
};
