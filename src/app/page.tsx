import { checkUserInDatabase } from "@/actions/user";

export default async function Page() {
  const prisma_user = await checkUserInDatabase();
  console.log(prisma_user);

  return <div className="space-y-4">hello</div>;
}
