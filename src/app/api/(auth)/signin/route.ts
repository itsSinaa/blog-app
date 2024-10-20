import prisma from "@/lib/client";
import { signinSchema } from "@/types/auth";
import { generateToken, verifyPassword } from "@/utils/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const parsed = signinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: {
              equals: body.usernameOrEmail,
              mode: "insensitive",
            },
          },
          {
            username: {
              equals: body.usernameOrEmail,
              mode: "insensitive",
            },
          },
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or email or password.",
        },
        { status: 401 }
      );
    }

    const validPassword = await verifyPassword(body.password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid username or email or password.",
        },
        { status: 401 }
      );
    }

    const jwtToken = generateToken({ email: user.email });

    return Response.json(
      { msg: "user registred successfully !!" },
      {
        status: 201,
        headers: {
          "Set-Cookie": `token=${jwtToken}; Path=/; HttpOnly; Max-Age=1296000; Secure; SameSite=Lax`,
        },
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
};
