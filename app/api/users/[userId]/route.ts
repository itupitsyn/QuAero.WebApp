import { lastSaResponse, TOKEN } from "@/constants/cookies";
import { PrismaTypes } from "@/prisma/types";
import prisma from "@/prisma/utils/db";
import { UpdateUserRequest } from "@/types/models";
import { Permission } from "@/types/permissions";
import { canCreateAdmins, validatePermissionArray } from "@/utils/permissions";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: { userId: string };
};

export const DELETE = async (req: NextRequest, { params: { userId } }: RouteParams) => {
  const token = req.cookies.get(TOKEN);
  const isAdmin = await canCreateAdmins(token?.value);
  if (!isAdmin) {
    return new NextResponse("", { status: 403 });
  }

  try {
    const usr = await prisma.user.findFirst({ where: { id: userId } });
    if (!usr) return new NextResponse("", { status: 404 });

    const sas = await prisma.permission.findMany({
      where: {
        permission: Permission.CanCreateAdmins,
        allowed: true,
      },
    });

    if (sas.length <= 1 && sas[0].userId === userId) {
      return lastSaResponse;
    }

    await prisma.user.delete({ where: { id: userId } });

    return new NextResponse();
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};

export const PATCH = async (req: NextRequest, { params: { userId } }: RouteParams) => {
  const token = req.cookies.get(TOKEN);
  const isAdmin = await canCreateAdmins(token?.value);
  if (!isAdmin) {
    return new NextResponse("", { status: 403 });
  }

  const body: UpdateUserRequest = await req.json();
  const { permissions, ...newValues } = body;

  if (permissions && !validatePermissionArray(permissions)) {
    return new NextResponse("", { status: 418 });
  }

  try {
    const usr = await prisma.user.findFirst({ where: { id: userId } });
    if (!usr) return new NextResponse("", { status: 404 });

    const sas = await prisma.permission.findMany({
      where: {
        permission: Permission.CanCreateAdmins,
        allowed: true,
      },
    });

    if (
      sas.length === 1 &&
      sas[0].userId === userId &&
      permissions &&
      !permissions.includes(Permission.CanCreateAdmins)
    ) {
      return lastSaResponse;
    }

    const updateData: PrismaTypes.Prisma.UserUpdateArgs = { where: { id: userId }, data: {} };

    if (newValues.login != undefined) updateData.data.login = newValues.login;
    if (newValues.name != undefined) updateData.data.name = newValues.name;

    await prisma.user.update(updateData);

    if (permissions) {
      await prisma.permission.deleteMany({ where: { userId } });
      if (permissions.length) {
        await prisma.permission.createMany({
          data: permissions.map((permission) => ({ userId, permission, allowed: true })),
        });
      }
    }

    return new NextResponse();
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
