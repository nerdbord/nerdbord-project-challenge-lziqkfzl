"use client";
import React, { useState, useEffect } from "react";
import { getFormById } from "@/actions/form";
import { Form } from "@/components/Form";
import { useParams } from "next/navigation";

type FormField = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  class?: string;
  options?: string[];
};

export const FormDetails = () => {
  const params = useParams();
  const id = params?.id;
  console.log("ID => ", id);
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
        if (form && form.fields) {
          setFormFields(
            form.fields.map((field) => ({
              ...field,
              placeholder: field.placeholder || undefined,
            }))
          );
        } else {
          setMsg("Form not found or it has no fields.");
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

  return (
    <div className="container mx-auto p-4 pt-16">
      {msg ? (
        <p className="text-pink-600">{msg}</p>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Form Details</h1>
          <div>
            {/*      dodac funkcjonalnosc */}
            <button className="btn btn-primary ">Delete</button>
            <button className="btn btn-secondary">Save</button>
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
