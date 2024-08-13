"use client";
import React, { useState, useEffect } from "react";
import { getFormById, deleteForm, saveForm } from "@/actions/form";
import { Form } from "@/components/Form";
import { useParams, useRouter } from "next/navigation";

type FormField = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  class?: string;
  options?: string[];
};

const isFormField = (field: any): field is FormField => {
  return (
    typeof field === "object" &&
    field !== null &&
    typeof field.name === "string" &&
    typeof field.type === "string" &&
    typeof field.label === "string"
  );
};

export const FormDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [isEdited, setIsEdited] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchForm = async () => {
      if (!id) {
        setMsg("No form ID provided");
        return;
      }

      try {
        const form = await getFormById(String(id));
        if (form && Array.isArray(form.fields)) {
          const validFields = form.fields.filter(isFormField);
          setFormFields(
            validFields.map((field: FormField) => ({
              ...field,
              placeholder: field.placeholder || undefined,
            }))
          );
        } else {
          setMsg("Form not found or it has no valid fields.");
        }
      } catch (error) {
        setMsg("Error fetching form details: " + error);
      }
    };

    fetchForm();
  }, [id]);

  const handleFieldChange = (
    index: number,
    field: keyof FormField,
    value: string
  ) => {
    const updatedFields = [...formFields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value,
    };
    setFormFields(updatedFields);
  };

  const startEditing = (index: number) => {
    setIsEdited(index);
  };

  const saveField = () => {
    setIsEdited(null);
  };

  const handleDeleteForm = async () => {
    if (!id) return;

    try {
      await deleteForm(String(id));
      setMsg("Form deleted successfully.");
      router.push("/forms");
    } catch (error) {
      setMsg("Error deleting form: " + error);
    }
  };
  const handleSaveForm = async () => {
    if (!id) return;

    try {
      await saveForm({
        id: String(id),
        fields: formFields,
      });
      setMsg("Form saved successfully.");
    } catch (error) {
      setMsg("Error saving form: " + error);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-40">
      {msg ? (
        <p className="text-pink-600">{msg}</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Form Details</h1>
          <div className="mb-4">
            <button className="btn btn-primary mr-2" onClick={handleDeleteForm}>
              Delete
            </button>
            <button className="btn btn-secondary" onClick={handleSaveForm}>
              Save
            </button>
          </div>

          <Form
            fields={formFields}
            isEdited={isEdited}
            onFieldChange={handleFieldChange}
            onStartEditing={startEditing}
            onSaveField={saveField}
          />
        </>
      )}
    </div>
  );
};
