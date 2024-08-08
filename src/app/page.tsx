import { checkUserInDatabase } from "@/actions/user";
import { FormGenerator } from "@/components/FormGenerator";

export default async function Page() {
  const prisma_user = await checkUserInDatabase();

  return (
    <div className="space-y-4">
      <FormGenerator />
    </div>
  );
}
