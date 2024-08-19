"use client";
import React, { useEffect, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { HeaderButtons } from "@/components/HeaderButtons";
import { RedirectButton } from "@/components/RedirectButton";
import { usePathname } from "next/navigation";
import Logo from "@/assets/Logo.png";

type Props = {};

export const Header = (props: Props) => {
  const { isLoaded, user } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const pathname = usePathname();
  const isPublic = pathname.startsWith("/public");

  useEffect(() => {
    if (isLoaded) {
      setIsLoading(false);
    }
  }, [isLoaded]);

  if (!user && isPublic) return null;

  return (
    <div className="flex justify-between items-center navbar fixed bg-white shadow-md  px-20 h-20">
      <RedirectButton className="btn btn-ghost" href="/">
        <img src={Logo.src} alt="logo" />
      </RedirectButton>
      <div className="flex gap-6">
        {user ? (
          <div className="flex gap-20">
            <HeaderButtons />
            <UserButton />
          </div>
        ) : (
          <>
            <SignInButton>
              <button className="btn btn-ghost">Logowanie</button>
            </SignInButton>
            <SignUpButton>
              <button className="btn btn-accent">Załóż konto</button>
            </SignUpButton>
          </>
        )}
      </div>
    </div>
  );
};
