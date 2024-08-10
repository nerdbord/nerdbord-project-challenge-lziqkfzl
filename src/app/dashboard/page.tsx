import React from "react";
import { Dashboard } from "@/components/Dashboard";

type Props = {};

const forms = [
  {
    id: "1",
    name: "Sample Form 1",
    description: "This is a sample form",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Sample Form 2",
    description: "Another sample form",
    createdAt: "2024-02-01T00:00:00Z",
  },
];

const page = (props: Props) => {
  return <Dashboard />;
};

export default page;
