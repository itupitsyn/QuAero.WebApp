import prisma from "@/prisma/utils/db";
import { doesSUExist } from "@/prisma/utils/permissions";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { Permission } from "@/types/permissions";
import { calculatePasswordHash } from "@/utils/users";

export const POST = async (req: NextRequest) => {
  const suExists = await doesSUExist();

  if (suExists) {
    return notFound();
  }

  const body = await req.json();

  if (!body.login || !body.password) {
    return new NextResponse("", { status: 418 });
  }

  try {
    const password = calculatePasswordHash(body.password);
    const newSu = await prisma.user.create({ data: { login: body.login, password } });
    await prisma.permissions.create({
      data: {
        allowed: true,
        permission: Permission.CanCreateAdmins,
        userId: newSu.id,
      },
    });

    return new NextResponse();
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
