"use client";
import React, { useState } from "react";
import { getUserForms, deleteForm } from "@/actions/form";
import useSWR from "swr";
import { RedirectButton } from "./RedirectButton";
import { useRouter } from "next/navigation";

interface Form {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
}

export const Dashboard: React.FC = () => {
  const [msg, setMsg] = useState<string>("");

  const router = useRouter();

  const fetcher = async (): Promise<Form[]> => {
    try {
      const forms: Form[] = (await getUserForms()) as Form[];
      if (!forms || forms.length === 0) {
        setMsg("No forms found");
        return [];
      }
      return forms;
    } catch (error) {
      setMsg("Error fetching forms: " + error);
      throw error;
    }
  };

  const { data, error, mutate } = useSWR<Form[], Error>("forms", fetcher);

  const handleDelete = async (id: string) => {
    try {
      await deleteForm(id);
      setMsg("Form deleted successfully");
      mutate();
    } catch (error) {
      setMsg("Error deleting form: " + error);
    }
  };

  const handleCopyURL = (id: string) => {
    const url = `${window.location.origin}/forms/preview/${id}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setMsg("URL copied to clipboard");
      })
      .catch(() => {
        setMsg("Failed to copy URL");
      });
  };

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading forms: {error.message}</div>;
  }

  return (
    <div className="pt-36 px-20">
      <RedirectButton href="/">Back to main</RedirectButton>

      {msg && <p className="text-pink-600">{msg}</p>}
      <div className="overflow-x-auto">
        {Array.isArray(data) && data.length === 0 && <p>No forms found</p>}
        {Array.isArray(data) && data.length > 0 && (
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((form: Form, index) => (
                <tr key={form.id}>
                  <th>{index + 1}</th>
                  <td
                    className="hover:cursor-pointer"
                    onClick={() => router.push(`/forms/${form.id}`)}
                  >
                    {form.name}
                  </td>
                  <td>{form.description}</td>
                  <td>
                    <button
                      className="btn btn-error mr-2"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(form.id);
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-warning"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCopyURL(form.id);
                      }}
                    >
                      Copy URL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
