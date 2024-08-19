"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Form } from "@/components/Form";
import { FormFieldEditor } from "@/components/FormFieldEditor";
import { getFormById, saveForm, deleteForm } from "@/actions/form";

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

export const FormDetails: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isEdited, setIsEdited] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { data: form, error, mutate } = useSWR<FormType>(id as string, fetcher);

  const handleFieldChange = (index: number, updatedField: FormField) => {
    if (!form) return;

    const updatedFields = [...form.fields];
    updatedFields[index] = updatedField;

    mutate({ ...form, fields: updatedFields }, false);
    setIsEdited(null);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!form) return;

    mutate({ ...form, name: e.target.value }, false);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (!form) return;

    mutate({ ...form, description: e.target.value }, false);
  };

  const startEditing = (index: number) => {
    setIsEdited(index);
  };

  const deleteField = (index: number) => {
    if (!form) return;

    const updatedFields = form.fields.filter((_, i) => i !== index);

    mutate({ ...form, fields: updatedFields }, false);
    setIsEdited(null);
  };

  const handleSaveForm = async () => {
    if (!form) return;

    try {
      await saveForm(form);
      setMsg("Formularz zapisany pomyślnie!");
      mutate();
      router.push("/forms");
    } catch (error) {
      setMsg(`Wystąpił bład podczas zapisywania formularza - ${error}`);
    }
  };

  const handleDeleteForm = async () => {
    if (!form?.id) return;

    setLoading(true);
    setMsg(null);

    try {
      await deleteForm(form.id);
      setMsg("Formularz usunięty pomyślnie!");
      setTimeout(() => {
        router.push("/forms");
      }, 2000);
    } catch (error) {
      setMsg(`Failed to delete the form, please try again - ${error}`);
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  if (error) return <div>Error loading form: {error.message}</div>;

  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <div className="container flex flex-col justify-center p-4 max-w-lg">
          {form ? (
            <div className="flex flex-col gap-y-3 border p-8 rounded-2xl mt-28 bg-white">
              <input
                type="text"
                className="text-xl input input-bordered w-full bg-inherit"
                value={form.name}
                onChange={handleNameChange}
                placeholder="Form Name"
              />
              <textarea
                className="text-md textarea textarea-bordered w-full bg-inherit"
                value={form.description}
                onChange={handleDescriptionChange}
                placeholder="Form Description"
                rows={3}
              />

              {isEdited !== null ? (
                <FormFieldEditor
                  field={form.fields[isEdited]}
                  onSave={(updatedField) =>
                    handleFieldChange(isEdited, updatedField)
                  }
                  onDelete={() => deleteField(isEdited)}
                />
              ) : (
                <Form
                  fields={form.fields}
                  isEdited={isEdited}
                  onStartEditing={startEditing}
                />
              )}
              {msg && <p className="text-center text-accent">{msg}</p>}

              <button
                type="button"
                className="btn btn-accent mt-6"
                onClick={handleSaveForm}
              >
                Zapisz zmiany
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowModal(true)}
                disabled={loading}
              >
                {loading ? "Usuwanie..." : "Usuń formularz"}
              </button>
            </div>
          ) : (
            <p>Ładowanie szczegółów formularza...</p>
          )}
        </div>
      </div>

      {/* DaisyUI Modal */}
      {showModal && (
        <div className="modal modal-open ">
          <div className="modal-box bg-white">
            <h3 className="text-2xl not-italic font-semibold leading-8">
              Na pewno?
            </h3>
            <p className="py-4">Formularz zostanie bezpowrotnie usunięty.</p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Anuluj
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteForm}
                disabled={loading}
              >
                {loading ? "Usuwanie..." : "Usuń"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
