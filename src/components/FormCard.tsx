import React from "react";
import { IoShareSocialOutline } from "react-icons/io5";
import { BiPencil } from "react-icons/bi";
import { IoEyeOutline, IoCheckmarkOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import formImg from "../assets/form.png";
import { RedirectButton } from "./RedirectButton";

interface FormCardProps {
  id: string;
  name: string;
  description?: string | null;
  copiedId: string | null;
  onCopyUrl: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FormCard: React.FC<FormCardProps> = ({
  id,
  name,
  description,
  copiedId,
  onCopyUrl,
  onDelete,
}) => {
  const router = useRouter();

  return (
    <div className="card card-side bg-base-100 shadow-xl w-auto bg-white">
      <figure className="w-1/3 h-full">
        <img
          src={formImg.src}
          alt="Form"
          className="object-cover h-full w-full"
        />
      </figure>
      <div className="card-body w-2/3 flex flex-col justify-between gap-20">
        <div>
          <h2 className="card-title">{name}</h2>
          <p>{description}</p>
        </div>
        <div className="card-actions justify-start">
          <button
            className="btn btn-accent flex gap-2 items-center"
            onClick={() => router.push(`/forms/${id}`)}
          >
            <p>Edytuj</p>
            <BiPencil className="w-4 h-4" />
          </button>
          <button
            className="btn btn-outline text-black border-black flex gap-2 items-center w-36"
            onClick={() => onCopyUrl(id)}
          >
            {copiedId === id ? (
              <>
                Skopiowano <IoCheckmarkOutline />
              </>
            ) : (
              <>
                Udostępnij <IoShareSocialOutline className="w-4 h-4" />
              </>
            )}
          </button>

          <RedirectButton
            href={`/public/${id}`}
            className="btn btn-outline text-black border-black flex items-center"
          >
            <IoEyeOutline />
          </RedirectButton>
        </div>
      </div>
    </div>
  );
};
