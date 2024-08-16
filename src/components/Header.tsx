import React from "react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { HeaderButtons } from "@/components/HeaderButtons";
import { RedirectButton } from "@/components/RedirectButton";

type Props = {};

export const Header = async (props: Props) => {
  const user = await currentUser();

  return (
    <div className="flex justify-between items-center navbar bg-base-100 fixed  px-20 py-12">
      <RedirectButton href="/">FormuLator</RedirectButton>
      <div className="flex gap-6">
        {user ? (
          <>
            <HeaderButtons />
            <UserButton />
          </>
        ) : (
          <>
            <SignInButton>
              <button>Logowanie</button>
            </SignInButton>
            <SignUpButton>
              <button>Załóż konto</button>
            </SignUpButton>
          </>
        )}
      </div>
    </div>
  );
};
