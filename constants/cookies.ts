import { NextResponse } from "next/server";

export const TOKEN = "sessionToken";

export const lastSaResponse = new NextResponse(
  JSON.stringify({ text: "There must be at least one superadmin", key: "lastSa" }),
  { status: 422 },
);
