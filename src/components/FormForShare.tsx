"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { getFormById, saveSubmittedForm } from "@/actions/form";
import { checkUserInDatabase } from "@/actions/user";

type FormField = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

const isFormField = (field: unknown): field is FormField => {
  return (
    typeof field === "object" &&
    field !== null &&
    "name" in field &&
    "type" in field &&
    "label" in field
  );
};

export const FormForShare = () => {
  const params = useParams();
  const id = params?.id;

  const [msg, setMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string | boolean }>(
    {}
  );

  const fetcher = async (id: string) => {
    try {
      const form = await getFormById(id);
      return form;
    } catch (error) {
      setMsg("Error fetching form details: " + error);
      return null;
    }
  };

  const { data: form, error } = useSWR(id ? String(id) : null, fetcher);

  if (error)
    return <p className="text-pink-600">Error fetching form details.</p>;
  if (!form) return <p className="text-pink-600">Loading...</p>;

  const handleFieldChange = (fieldName: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("formData:", formData);

    const user = await checkUserInDatabase();

    try {
      const submissionData = {
        formId: id,
        userId: user?.id || "User not logged in",
        fields: formData,
      };

      await saveSubmittedForm(submissionData);
      setMsg("Form submitted successfully");
    } catch (error) {
      setMsg("Error submitting form: " + error);
    }
  };

  const renderFormField = (field: FormField, index: number) => {
    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-left mb-2">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder || ""}
              required={field.required}
              className="w-full p-2 border border-gray-300 rounded"
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-left mb-2">{field.label}</label>
            <textarea
              name={field.name}
              placeholder={field.placeholder || ""}
              required={field.required}
              className="w-full p-2 border border-gray-300 rounded"
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            />
          </div>
        );
      case "checkbox":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-left mb-2">
              <input
                type="checkbox"
                name={field.name}
                checked={(formData[field.name] as boolean) || false}
                onChange={(e) =>
                  handleFieldChange(field.name, e.target.checked)
                }
              />
              {` ${field.label}`}
            </label>
          </div>
        );
      case "select":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-left mb-2">{field.label}</label>
            <select
              name={field.name}
              required={field.required}
              className="w-full p-2 border border-gray-300 rounded"
              value={(formData[field.name] as string) || ""}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 pt-40 text-center">
      <h1 className="text-2xl font-bold mb-4">Wypełnij formularz</h1>
      {msg && <p className="text-pink-600">{msg}</p>}
      <form onSubmit={handleSubmit}>
        {Array.isArray(form.fields) &&
          form.fields
            .filter(isFormField)
            .map((field, index) => renderFormField(field, index))}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};
