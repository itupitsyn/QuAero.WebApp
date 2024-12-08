import prisma from "@/prisma/utils/db";
import { doesSUExist } from "@/prisma/utils/permissions";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const POST = async (req: NextRequest) => {
  const suExists = await doesSUExist();

  if (suExists) {
    return notFound();
  }

  const body = await req.json();

  if (!body.login || !body.password) {
    return new NextResponse("", { status: 418 });
  }

  const password = createHash("sha256").update(body.password).digest("hex");
  prisma.user.create({ data: { login: body.login, password } });

  return new NextResponse();
};
