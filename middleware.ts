import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma/utils/db";
import { Permission } from "./types/permissions";
import { doesSUExist } from "./prisma/utils/permissions";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  req.headers.set("x-pathname", req.nextUrl.pathname);
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ru|en|ch)/:path*"],
};
