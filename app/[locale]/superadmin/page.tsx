import { CreateSuperAdminForm } from "@/components/CreateSuperAdminForm";
import { doesSUExist } from "@/prisma/utils/permissions";
import { notFound } from "next/navigation";

export default async function Page() {
  const suExists = await doesSUExist();

  if (suExists) notFound();

  return <CreateSuperAdminForm />;
}
