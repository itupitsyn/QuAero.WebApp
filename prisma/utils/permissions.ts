import { Permission } from "@/types/permissions";
import prisma from "./db";

export const doesSUExist = async () => {
  const su = await prisma.permission.findFirst({ where: { permission: Permission.CanCreateAdmins } });
  return !!su;
};
