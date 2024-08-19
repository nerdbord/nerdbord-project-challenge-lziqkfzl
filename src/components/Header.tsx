import React from "react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { HeaderButtons } from "@/components/HeaderButtons";
import { RedirectButton } from "@/components/RedirectButton";
import Logo from "@/assets/Logo.png";

type Props = {};

export const Header = async (props: Props) => {
  const user = await currentUser();

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
