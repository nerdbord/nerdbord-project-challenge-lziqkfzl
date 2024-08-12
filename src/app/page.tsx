import { checkUserInDatabase } from "@/actions/user";
import { FormGenerator } from "@/components/FormGenerator";
import { RedirectButton } from "@/components/RedirectButton";

export default async function Page() {
  return <FormGenerator />;
}
