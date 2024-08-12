"use client";
import React from "react";
import { getUserForms } from "@/actions/form";
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
      const forms = await getUserForms();
      return forms;
    } catch (error) {
      console.error("Error fetching forms:", error);
      throw error;
    }
  };

  const { data, error } = useSWR<Form[], Error>("forms", fetcher);

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading forms: {error.message}</div>;
  }

  return (
    <div>
      <RedirectButton href="/">Back</RedirectButton>
      <h1>Dashboard</h1>
      <ul>
        {data &&
          data.map((form: Form) => (
            <li key={form.id}>
              <h2>{form.name}</h2>
              <p>{form.description ?? "No description provided"}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};
