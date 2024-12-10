import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  req.headers.set("x-pathname", pathname);

  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  // matcher: ["/", "/(ru|en|ch)/:path*"],
  matcher: "/((?!api|_next|favicon.ico|sitemap.xml|images|robots.txt).*)",
};
