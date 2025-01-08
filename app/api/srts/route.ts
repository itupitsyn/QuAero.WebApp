import { TOKEN } from "@/constants/cookies";
import prisma from "@/prisma/utils/db";
import { Permission } from "@/types/permissions";
import { getUserPermissions } from "@/utils/permissions";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const token = req.cookies.get(TOKEN);
  const { [Permission.CanCreateSRT]: ok } = await getUserPermissions(token?.value);
  if (!ok) {
    return new NextResponse("", { status: 403 });
  }

  const body = await req.json();

  try {
    const newSRT = await prisma.searchRescueTeam.create({ data: body });

    return new NextResponse(JSON.stringify(newSRT));
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
