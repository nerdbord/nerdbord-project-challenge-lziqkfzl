import { checkUserInDatabase } from "@/actions/user";
import { FormGenerator } from "@/components/FormGenerator";
import Landing from "@/components/Landing";
import { RedirectButton } from "@/components/RedirectButton";

export default async function Page() {
  const user = await checkUserInDatabase();

  return (
    <div className="space-y-4">
      <RedirectButton href="/dashboard">Dashboard</RedirectButton>
      {user ? <FormGenerator /> : <Landing />}
    </div>
  );
}
