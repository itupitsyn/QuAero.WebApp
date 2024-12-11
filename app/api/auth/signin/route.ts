import prisma from "@/prisma/utils/db";
import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes, randomUUID } from "crypto";
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  if (!body.login || !body.password) {
    return new NextResponse("", { status: 418 });
  }

  try {
    const password = createHash("sha256").update(body.password).digest("hex");
    const foundUser = await prisma.user.findFirst({
      where: { login: body.login, password },
      select: {
        id: true,
        login: true,
        name: true,
        image: true,
        email: true,
      },
    });

    if (!foundUser) return new NextResponse("", { status: 403 });

    const token = randomUUID?.() ?? randomBytes(32).toString("hex");

    const session = await prisma.session.create({
      data: {
        userId: foundUser.id,
        sessionToken: token,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60),
      },
    });

    cookies().set("sessionToken", session.sessionToken, {
      expires: session.expires,
      httpOnly: true,
      sameSite: "lax",
    });

    return new NextResponse(JSON.stringify(session));
  } catch {
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
