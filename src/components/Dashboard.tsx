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
      const forms = (await getUserForms()) as Form[];
      if (!forms || forms.length === 0) {
        setMsg("No forms found");
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
      setMsg("Error deleting form" + error);
      return;
    }
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
        {data && data.length === 0 && <p>No forms found</p>}
        {data && data.length > 0 && (
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Nazwa</th>
                <th>Opis</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((form: Form, index) => (
                <tr
                  key={form.id}
                  className="hover:cursor-pointer"
                  onClick={() => router.push(`/${form.id}`)}
                >
                  <th>{index + 1}</th>

                  <td>{form.name}</td>
                  <td>{form.description}</td>
                  <td>
                    <button
                      className="btn btn-error"
                      onClick={(event) => {
                        event.preventDefault();
                        handleDelete(form.id);
                      }}
                    >
                      Delete
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
