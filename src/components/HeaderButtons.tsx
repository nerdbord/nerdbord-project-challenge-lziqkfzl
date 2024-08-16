"use client";
import React from "react";
import { RedirectButton } from "@/components/RedirectButton";
import { usePathname } from "next/navigation";

type Props = {};

export const HeaderButtons = (props: Props) => {
  const pathname = usePathname();

  return (
    <div className="flex gap-6">
      {pathname === "/forms" && (
        <RedirectButton href="/">Nowy formularz</RedirectButton>
      )}
      {pathname === "/" && (
        <RedirectButton href="/forms">Moje formularze</RedirectButton>
      )}
    </div>
  );
};
