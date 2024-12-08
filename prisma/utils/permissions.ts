import { Permission } from "@/types/permissions";
import prisma from "./db";

export const doesSUExist = async () => {
  const su = await prisma.permissions.findFirst({ where: { permission: Permission.CanCreateAdmins } });
  return !!su;
};
