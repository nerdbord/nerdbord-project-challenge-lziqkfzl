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
      console.log(result);
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
    <div>
      <h1>Form Generator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter prompt"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {form && (
        <form>
          {form.fields.map((field, index) => (
            <div key={index}>
              <label>
                {field.label}
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
