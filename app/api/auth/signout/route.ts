import { TOKEN } from "@/constants/cookies";
import prisma from "@/prisma/utils/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get(TOKEN);
    if (!token) return new NextResponse("", { status: 418 });

    await prisma.session.delete({ where: { sessionToken: token.value } });
    req.cookies.delete(TOKEN);
    return new NextResponse();
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
