import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { msg: "user successfully signed out!!" },
    {
      status: 200,
      headers: {
        "Set-Cookie": `token=; Path=/; HttpOnly; Max-Age=0; Secure; SameSite=Lax`,
      },
    }
  );
}
