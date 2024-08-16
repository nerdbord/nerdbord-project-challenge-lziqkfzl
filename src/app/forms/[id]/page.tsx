import React from "react";
import { FormDetails } from "@/components/FormDetails";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {};

const page = async (props: Props) => {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }
  return <FormDetails />;
};

export default page;
