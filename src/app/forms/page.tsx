import React from "react";
import { Dashboard } from "@/components/Dashboard";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {};

const page = async (props: Props) => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return <Dashboard />;
};

export default page;
