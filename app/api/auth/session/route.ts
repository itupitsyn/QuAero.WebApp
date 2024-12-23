import { TOKEN } from "@/constants/cookies";
import prisma from "@/prisma/utils/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(TOKEN);
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
            Permissions: true,
          },
        },
      },
    });

    if (!session) return new NextResponse("", { status: 401 });

    const { Permissions: permissions, ...user } = session.user;

    return new NextResponse(
      JSON.stringify({
        ...user,
        permissions: Object.fromEntries(permissions.map(({ permission, allowed }) => [permission, allowed])),
      }),
    );
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
}
