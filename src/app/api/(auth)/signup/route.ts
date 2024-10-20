import prisma from "@/lib/client";
import { registerSchema } from "@/types/auth";
import { hashPassword } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: body.email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This email is already registered. Please use a different email.",
        },
        { status: 409 }
      );
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: body.username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This username is already registered. Please use a different email.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(body.password);

    await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { msg: "user registred successfully!" },
      { status: 201 }
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
