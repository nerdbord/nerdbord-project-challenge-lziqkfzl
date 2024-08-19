"use client";
import React from "react";
import { RedirectButton } from "@/components/RedirectButton";
import { usePathname } from "next/navigation";

type Props = {};

export const HeaderButtons = (props: Props) => {
  const pathname = usePathname();

  return (
    <div className="flex gap-6">
      {pathname === "/" ? (
        <RedirectButton href="/forms">Moje formularze</RedirectButton>
      ) : (
        <div className="flex gap-6">
          <RedirectButton href="/">Nowy formularz</RedirectButton>
          <RedirectButton href="/forms">Moje formularze</RedirectButton>
        </div>
      )}
    </div>
  );
};
