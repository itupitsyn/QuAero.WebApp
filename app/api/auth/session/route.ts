import prisma from "@/prisma/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("sessionToken");
    if (!token) return new NextResponse("", { status: 401 });
    const session = await prisma.session.findFirst({
      where: { sessionToken: token.value },
      select: {
        user: {
          select: {
            name: true,
            image: true,
            login: true,
            id: true,
          },
        },
      },
    });

    if (!session) return new NextResponse("", { status: 401 });

    return new NextResponse(JSON.stringify(session.user));
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
