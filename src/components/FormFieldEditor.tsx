"use client";
import React from "react";

type FormField = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  class?: string;
  options?: string[];
};

type FormFieldEditorProps = {
  field: FormField;
  onSave: (field: FormField) => void;
  onDelete: () => void;
};

export const FormFieldEditor: React.FC<FormFieldEditorProps> = ({
  field,
  onSave,
  onDelete,
}) => {
  const [editedField, setEditedField] = React.useState<FormField>(field);

  const handleFieldChange = (
    key: keyof FormField,
    value: string | string[]
  ) => {
    setEditedField({
      ...editedField,
      [key]:
        key === "options" && typeof value === "string"
          ? value.split(",").map((opt) => opt.trim())
          : value,
    });
  };

  const handleSave = () => {
    onSave(editedField);
  };

  return (
    <div className="flex flex-col gap-y-3">
      <label className="label-text mb-2">
        Label
        <input
          type="text"
          value={editedField.label || ""}
          onChange={(e) => handleFieldChange("label", e.target.value)}
          className="input input-bordered w-full mt-2"
        />
      </label>
      <label className="label-text mb-2">
        Placeholder
        <input
          type="text"
          value={editedField.placeholder || ""}
          onChange={(e) => handleFieldChange("placeholder", e.target.value)}
          className="input input-bordered w-full mt-2"
        />
      </label>
      <label className="label-text mb-2">
        Rodzaj pola
        <select
          value={editedField.type || "text"}
          onChange={(e) => handleFieldChange("type", e.target.value)}
          className="select select-bordered w-full mt-2"
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
      {editedField.type === "select" && (
        <label className="label">
          <span className="label-text">Opcje formularza</span>
          <input
            type="text"
            value={
              Array.isArray(editedField.options)
                ? editedField.options.join(", ")
                : ""
            }
            onChange={(e) => handleFieldChange("options", e.target.value)}
            placeholder="Opcje oddzielone przecinkami"
            className="input input-bordered w-full mt-2"
          />
        </label>
      )}
      <div className="flex justify-start mt-2 gap-2">
        <button type="button" onClick={handleSave} className="btn btn-success">
          Zapisz
        </button>
        <button type="button" onClick={onDelete} className="btn btn-error">
          Usuń
        </button>
      </div>
    </div>
  );
};
