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

type FormComponentProps = {
  fields: FormField[];
  isEdited?: number | null;
  onFieldChange: (index: number, field: keyof FormField, value: string) => void;
  onStartEditing: (index: number) => void;
  onSaveField: () => void;
};

export const Form: React.FC<FormComponentProps> = ({
  fields,
  isEdited,
  onFieldChange,
  onStartEditing,
  onSaveField,
}) => {
  return (
    <form>
      {fields.map((field, index) => (
        <div key={index} className="mb-4">
          {isEdited === index ? (
            <div className="space-y-2">
              <label className="label">
                <span className="label-text">Label</span>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) =>
                    onFieldChange(index, "label", e.target.value)
                  }
                />
              </label>
              <label className="label">
                <span className="label-text">Placeholder</span>
                <input
                  type="text"
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    onFieldChange(index, "placeholder", e.target.value)
                  }
                />
              </label>
              <label className="label">
                <span className="label-text">Type</span>
                <select
                  value={field.type}
                  onChange={(e) => onFieldChange(index, "type", e.target.value)}
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
                    value={
                      Array.isArray(field.options)
                        ? field.options.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      onFieldChange(
                        index,
                        "options",
                        e.target.value
                          .split(",")
                          .map((opt) => opt.trim())
                          .join(", ")
                      )
                    }
                    placeholder="Comma-separated options"
                  />
                </label>
              )}
              <button
                type="button"
                onClick={onSaveField}
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
                <select className="select select-bordered w-full">
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
                onClick={() => onStartEditing(index)}
                className="btn btn-info mt-2"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </form>
  );
};
