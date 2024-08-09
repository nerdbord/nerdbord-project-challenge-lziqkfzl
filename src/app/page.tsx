import { checkUserInDatabase } from "@/actions/user";
import { currentUser } from "@clerk/nextjs/server";
import { FormGenerator } from "@/components/FormGenerator";
import Landing from "@/components/Landing";

export default async function Page() {
  const user = await currentUser();
  const prisma_user = await checkUserInDatabase();

  console.log(prisma_user);

  return (
    <div className="space-y-4">{user ? <FormGenerator /> : <Landing />}</div>
  );
}
