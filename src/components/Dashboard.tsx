"use client";
import React, { useState } from "react";
import { getUserForms, deleteForm } from "@/actions/form";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { PiTrashSimple } from "react-icons/pi";
import { BiPencil } from "react-icons/bi";
import Image from "next/image";
import formImg from "../assets/form.png";

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
        setMsg("Brak formularzy");
      }
      return forms;
    } catch (error) {
      setMsg("Błąd podczas pobierania formularzy: " + error);
      throw error;
    }
  };

  const { data, error, mutate } = useSWR<Form[], Error>("forms", fetcher);

  const handleDelete = async (id: string) => {
    try {
      await deleteForm(id);
      setMsg("Formularz usunięty");
      mutate();
    } catch (error) {
      setMsg("Wystąpił bład podczas usuwania formularza: " + error);
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
    <div className="pt-36 px-20 flex justify-center ">
      {msg && <p className="text-pink-600">{msg}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data.length === 0 && <p>No forms found</p>}
        {data &&
          data.length > 0 &&
          data.map((form: Form) => (
            <div
              key={form.id}
              className="card card-side bg-base-100 shadow-xl w-96"
            >
              <div className="card-body w-2/3">
                <h2 className="card-title">{form.name}</h2>
                <p>{form.description}</p>
                <div className="card-actions justify-end mt-8">
                  <button
                    className="btn btn-primary"
                    onClick={() => router.push(`/forms/${form.id}`)}
                  >
                    Edytuj
                    <BiPencil className="w-4 h-4" />
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(form.id);
                    }}
                  >
                    Usuń
                    <PiTrashSimple className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
