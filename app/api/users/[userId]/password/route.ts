import { TOKEN } from "@/constants/cookies";
import prisma from "@/prisma/utils/db";
import { canCreateAdmins } from "@/utils/permissions";
import { calculatePasswordHash } from "@/utils/users";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: { userId: string };
};

export const PATCH = async (req: NextRequest, { params: { userId } }: RouteParams) => {
  const token = req.cookies.get(TOKEN);
  const isAdmin = await canCreateAdmins(token?.value);
  if (!isAdmin) {
    return new NextResponse("", { status: 403 });
  }

  const body = await req.json();
  if (!body.password) {
    return new NextResponse("", { status: 418 });
  }

  try {
    await prisma.user.update({ where: { id: userId }, data: { password: calculatePasswordHash(body.password) } });

    return new NextResponse();
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
