import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { RedirectButton } from "@/components/RedirectButton";

type Props = {};

export const Header = async (props: Props) => {
  const user = await currentUser();
  console.log(user);

  return (
    <div className="flex justify-between items-center navbar bg-base-100 fixed border-b">
      <RedirectButton href="/">FormuLator</RedirectButton>
      <div>
        {user ? (
          <>
            <RedirectButton href="/dashboard">Moje formularze</RedirectButton>
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
