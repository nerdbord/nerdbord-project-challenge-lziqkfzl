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
  isEdited: number | null;
  onStartEditing: (index: number) => void;
};

export const Form: React.FC<FormComponentProps> = ({
  fields,
  isEdited,
  onStartEditing,
}) => {
  return (
    <form>
      {fields.map((field, index) => (
        <div key={index} className="mb-4 flex flex-col">
          {isEdited === index ? null : (
            <div className="mb-4 flex space-x-4">
              {field.type === "radio" || field.type === "checkbox" ? (
                <div className="flex items-center w-full space-x-4">
                  <label className="flex items-center space-x-2 flex-grow">
                    <input
                      type={field.type}
                      className={`${
                        field.type === "radio"
                          ? "radio radio-bordered"
                          : "checkbox checkbox-bordered"
                      }`}
                    />
                    <span className="label-text text-neutral-800">
                      {field.label}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onStartEditing(index)}
                    className="btn self-end"
                  >
                    Edytuj
                  </button>
                </div>
              ) : field.type === "color" ? (
                <div className="flex items-center w-full space-x-4">
                  <label className="flex items-center space-x-2 flex-grow">
                    <input
                      type="color"
                      className="w-16 h-10 border-2 border-gray-300 rounded-md"
                    />
                    <span className="label-text text-neutral-800">
                      {field.label}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => onStartEditing(index)}
                    className="btn self-end"
                  >
                    Edytuj
                  </button>
                </div>
              ) : (
                <div className="flex items-center w-full space-x-4">
                  <div className="flex-grow">
                    <label className="label ">
                      <span className="label-text text-neutral-800">
                        {field.label}
                      </span>
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        placeholder={field.placeholder}
                        className="textarea textarea-bordered w-full bg-inherit"
                      />
                    ) : field.type === "select" ? (
                      <select className="select select-bordered w-full  bg-inherit">
                        {field.options?.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className={`${
                          field.type === "text" ||
                          field.type === "email" ||
                          field.type === "password" ||
                          field.type === "number"
                            ? "input input-bordered w-full bg-inherit"
                            : field.type === "file"
                            ? "file-input file-input-bordered w-full bg-inherit"
                            : "input input-bordered w-full bg-inherit"
                        }`}
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onStartEditing(index)}
                    className="btn btn-ghost self-end"
                  >
                    Edytuj
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </form>
  );
};
