import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { checkUserInDatabase } from "@/actions/user";
import { RedirectButton } from "@/components/RedirectButton";

type Props = {};

export const Header = async (props: Props) => {
  const user = await checkUserInDatabase();

  return (
    <div className="flex justify-between items-center navbar bg-base-100 fixed">
      <button>FormuLator</button>
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
