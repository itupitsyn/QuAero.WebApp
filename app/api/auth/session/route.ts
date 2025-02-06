import { TOKEN } from "@/constants/cookies";
import { getServerSession } from "@/utils/session";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(TOKEN);
    const session = await getServerSession(token?.value);

    if (!session) return new NextResponse("", { status: 401 });

    const { Permission: permissions, ...user } = session.user;

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
