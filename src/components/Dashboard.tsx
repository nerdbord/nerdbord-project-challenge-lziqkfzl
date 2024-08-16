"use client";
import React, { useState } from "react";
import { getUserForms, deleteForm } from "@/actions/form";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { PiTrashSimple } from "react-icons/pi";
import { BiPencil } from "react-icons/bi";
import { IoShareSocialOutline } from "react-icons/io5";
import formImg from "../assets/form.png";
import Link from "next/link";

interface Form {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
}

export const Dashboard: React.FC = () => {
  const [msg, setMsg] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const router = useRouter();

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
    const url = `${window.location.origin}/preview/${id}`;
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
    <div className="pt-36 px-20 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {data && data.length === 0 && <p>No forms found</p>}
        {data &&
          data.length > 0 &&
          data.map((form: Form) => (
            <div
              key={form.id}
              className="card card-side  bg-base-100 shadow-xl w-auto"
            >
              <figure className="w-1/3 h-full">
                <img
                  src={formImg.src}
                  alt="Form"
                  className="object-cover h-full w-full"
                />
              </figure>
              <div className="card-body w-2/3 flex flex-col justify-between gap-20">
                <div>
                  <h2 className="card-title">{form.name}</h2>
                  <p>{form.description}</p>
                </div>
                {msg && <p className="text-pink-600">{msg}</p>}
                <div className="card-actions justify-start">
                  <button
                    className="btn btn-secondary flex gap-2 items-center w-36"
                    onClick={() => handleCopyUrl(form.id)}
                  >
                    {copiedId === form.id ? "Skopiowano" : "Udostępnij"}
                    <IoShareSocialOutline className="w-4 h-4" />
                  </button>
                  <button
                    className="btn btn-primary flex gap-2 items-center"
                    onClick={() => router.push(`/forms/${form.id}`)}
                  >
                    <p>Edytuj</p>
                    <BiPencil className="w-4 h-4" />
                  </button>

                  <button
                    className="btn btn-error flex gap-2 items-center"
                    onClick={() => handleDelete(form.id)}
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
