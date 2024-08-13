import { FormGenerator } from "@/components/FormGenerator";
import { Dashboard } from "@/components/Dashboard";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  const user = await currentUser();

  return user ? <Dashboard /> : <FormGenerator />;
}
