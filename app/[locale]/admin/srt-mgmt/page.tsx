import { SRTManagement } from "@/components/SRTManagement";
import { TOKEN } from "@/constants/cookies";
import prisma from "@/prisma/utils/db";
import { canCreateAdmins } from "@/utils/permissions";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page() {
  const token = cookies().get(TOKEN);
  const isSuperAdmin = await canCreateAdmins(token?.value);

  if (!isSuperAdmin) return notFound();

  const teams = await prisma.searchRescueTeam.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return <SRTManagement teams={teams} />;
}
