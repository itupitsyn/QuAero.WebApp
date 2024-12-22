import { TOKEN } from "@/constants/cookies";
import prisma from "@/prisma/utils/db";
import { canCreateAdmins, validatePermissionArray } from "@/utils/permissions";
import { calculatePasswordHash } from "@/utils/users";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const token = req.cookies.get(TOKEN);
  const isAdmin = await canCreateAdmins(token?.value);
  if (!isAdmin) {
    return new NextResponse("", { status: 403 });
  }

  const body = await req.json();
  const { permissions } = body;
  if (!body.login || !body.password) {
    return new NextResponse("", { status: 418 });
  }

  if (!validatePermissionArray(permissions)) {
    return new NextResponse("", { status: 418 });
  }

  try {
    const password = calculatePasswordHash(body.password);
    const newUser = await prisma.user.create({ data: { login: body.login, password, name: body.name } });

    if (permissions.length) {
      await prisma.permissions.createMany({
        data: permissions.map((item) => ({ allowed: true, permission: item, userId: newUser.id })),
      });
    }

    return new NextResponse();
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
