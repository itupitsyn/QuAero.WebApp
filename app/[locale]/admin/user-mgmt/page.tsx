import { UserManagement } from "@/components/UserManagement";
import { TOKEN } from "@/constants/cookies";
import prisma from "@/prisma/utils/db";
import { ArrayItem } from "@/types/common";
import { UserApiModel } from "@/types/models";
import { Permission } from "@/types/permissions";
import { isSomeEnum } from "@/utils/common";
import { canCreateAdmins } from "@/utils/permissions";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page() {
  const token = cookies().get(TOKEN);
  const isSuperAdmin = await canCreateAdmins(token?.value);

  if (!isSuperAdmin) return notFound();

  const [users, srts] = await Promise.all([
    prisma.user.findMany({
      select: {
        createdAt: true,
        updatedAt: true,
        email: true,
        id: true,
        login: true,
        name: true,
        image: true,
        Permission: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.searchRescueTeam.findMany({ select: { name: true, id: true } }),
  ]);

  const constructUser = (user: ArrayItem<typeof users>): UserApiModel => {
    const { Permission: prmsArray, ...result } = user;
    const permissions: UserApiModel["permissions"] = {
      [Permission.CanCreateAdmins]: false,
      [Permission.CanCreateEmployee]: false,
      [Permission.CanCreateSRT]: false,
      [Permission.CanCreateSRTManager]: false,
    };

    const isSomeEnumPrm = isSomeEnum(Permission);
    prmsArray.forEach((item) => {
      const prmKey = item.permission;
      if (isSomeEnumPrm(prmKey)) {
        permissions[prmKey] = item.allowed;
      }
    });

    return { ...result, permissions };
  };

  return <UserManagement users={users.map(constructUser)} srts={srts} />;
}
