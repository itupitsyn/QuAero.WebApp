import prisma from "@/prisma/utils/db";
import { Permission } from "@/types/permissions";

export const canCreateAdmins = async (token?: string) => {
  if (!token) return false;

  const data = await prisma.permissions.findFirst({
    where: {
      allowed: true,
      permission: Permission.CanCreateAdmins,
      user: {
        sessions: {
          some: {
            sessionToken: token,
            expires: {
              gte: new Date(),
            },
          },
        },
      },
    },
  });

  return !!data;
};
