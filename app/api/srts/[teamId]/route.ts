import { TOKEN } from "@/constants/cookies";
import prisma from "@/prisma/utils/db";
import { Permission } from "@/types/permissions";
import { getUserPermissions } from "@/utils/permissions";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: { teamId: string };
};

export const DELETE = async (req: NextRequest, { params: { teamId } }: RouteParams) => {
  const token = req.cookies.get(TOKEN);
  const { [Permission.CanCreateSRT]: ok } = await getUserPermissions(token?.value);
  if (!ok) {
    return new NextResponse("", { status: 403 });
  }

  try {
    await prisma.searchRescueTeam.delete({ where: { id: teamId } });

    return new NextResponse();
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
