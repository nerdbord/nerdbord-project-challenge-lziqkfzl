"use client";
import React from "react";
import { useRouter } from "next/navigation";
type Props = {};

export const ThankYou = (props: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 w-2/5">
      <h1 className="text-center text-5xl not-italic font-normal">Dzięki!</h1>
      <p className="text-center text-base not-italic font-normal leading-6">
        Twoje odpowiedzi zostały wysłane
        <br />
        do właściciela formularza.
      </p>
      <div className="flex flex-col gap-3">
        <button className="btn btn-accent" onClick={() => router.back()}>
          Wypełnij ponownie
        </button>
        <button className="btn btn-ghost" onClick={() => router.push("/")}>
          Stwórz własny formularz z pomocą AI
        </button>
      </div>
    </div>
  );
};
