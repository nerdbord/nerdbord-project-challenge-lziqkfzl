"use client";
import React, { useState } from "react";
import { getUserForms, deleteForm } from "@/actions/form";
import useSWR from "swr";
import { FormCard } from "@/components/FormCard";

interface Form {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
}

export const Dashboard: React.FC = () => {
  const [msg, setMsg] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetcher = async (): Promise<Form[]> => {
    try {
      const forms = (await getUserForms()) as Form[];
      if (!forms || forms.length === 0) {
        setMsg("Brak formularzy");
      }
      return forms;
    } catch (error) {
      setMsg("Błąd podczas pobierania formularzy: " + error);
      throw error;
    }
  };

  const { data, error, mutate } = useSWR<Form[], Error>("forms", fetcher);

  const handleDelete = async (id: string) => {
    try {
      await deleteForm(id);
      mutate();
    } catch (error) {
      setMsg("Wystąpił błąd podczas usuwania formularza");
      return;
    } finally {
      setCopiedId(null);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleCopyUrl = (id: string) => {
    const url = `${window.location.origin}/public/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading forms: {error.message}</div>;
  }

  return (
    <div className="pt-36 px-20 flex justify-center min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-full">
        {data && data.length === 0 && <p>No forms found</p>}
        {data &&
          data.length > 0 &&
          data.map((form: Form) => (
            <FormCard
              key={form.id}
              id={form.id}
              name={form.name}
              description={form.description}
              copiedId={copiedId}
              onCopyUrl={handleCopyUrl}
              onDelete={handleDelete}
            />
          ))}
      </div>
    </div>
  );
};
