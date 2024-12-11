import { CreateSuperAdminForm } from "@/components/CreateSuperAdminForm";
import { doesSUExist } from "@/prisma/utils/permissions";
import { Card } from "flowbite-react";
import { notFound } from "next/navigation";

export default async function Page() {
  const suExists = await doesSUExist();

  if (suExists) notFound();

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl  flex-none">
        <CreateSuperAdminForm />
      </Card>
    </div>
  );
}
