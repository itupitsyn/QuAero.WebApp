import prisma from "@/prisma/utils/db";
import { Permission } from "@/types/permissions";
import { isSomeEnum } from "./common";

export const canCreateAdmins = async (token?: string) => {
  if (!token) return false;

  const data = await prisma.permission.findFirst({
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

export const getUserPermissions = async (
  token?: string,
): Promise<Partial<Record<Permission, { allowed: boolean; srts: { id: string; name: string }[] }>>> => {
  if (!token) return {};

  const data = await prisma.permission.findMany({
    where: {
      allowed: true,
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

  return Object.fromEntries(data.map(({ permission, allowed }) => [permission, allowed]));
};

export const validatePermissionArray = (data: string[]): data is Permission[] => {
  const permissionValidator = isSomeEnum(Permission);
  if (!Array.isArray(data) || data.some((item) => !permissionValidator(item))) {
    return false;
  }
  return true;
};
