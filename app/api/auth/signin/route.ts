import prisma from "@/prisma/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes, randomUUID } from "crypto";
import { cookies } from "next/headers";
import { TOKEN } from "@/constants/cookies";
import { calculatePasswordHash } from "@/utils/users";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.login || !body.password) {
    return new NextResponse("", { status: 418 });
  }

  try {
    const password = calculatePasswordHash(body.password);
    const foundUser = await prisma.user.findFirst({
      where: { login: body.login, password },
      select: { id: true },
    });

    if (!foundUser) return new NextResponse("", { status: 403 });

    const token = randomUUID?.() ?? randomBytes(32).toString("hex");

    const session = await prisma.session.create({
      data: {
        userId: foundUser.id,
        sessionToken: token,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    cookies().set(TOKEN, session.sessionToken, {
      expires: session.expires,
      httpOnly: true,
      sameSite: "lax",
      secure: true,
    });

    return new NextResponse(JSON.stringify(session));
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
