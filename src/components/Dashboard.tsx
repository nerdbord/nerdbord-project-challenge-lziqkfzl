"use client";
import React from "react";
import { getUserForms, deleteForm } from "@/actions/form";
import useSWR from "swr";
import { RedirectButton } from "./RedirectButton";

interface Form {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
}

export const Dashboard: React.FC = () => {
  const fetcher = async (): Promise<Form[]> => {
    try {
      const forms = (await getUserForms()) as Form[];
      return forms;
    } catch (error) {
      console.error("Error fetching forms:", error);
      throw error;
    }
  };

  const { data, error, mutate } = useSWR<Form[], Error>("forms", fetcher);

  const handleDelete = async (id: string) => {
    try {
      await deleteForm(id);
      mutate();
    } catch (error) {
      console.error("Error deleting form:", error);
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
    <div className="pt-16">
      <RedirectButton href="/">Back</RedirectButton>
      <h1>Dashboard</h1>
      <ul>
        {data && data.length === 0 && <li>No forms found</li>}
        {data &&
          data.map((form: Form) => (
            <li key={form.id}>
              <h2>{form.name}</h2>
              <p>{form.description ?? "No description provided"}</p>
              <button onClick={() => handleDelete(form.id)}>Delete</button>
            </li>
          ))}
      </ul>
    </div>
  );
};
