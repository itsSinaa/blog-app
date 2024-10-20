import prisma from "@/lib/client";
import { updateSchema } from "@/types/auth";
import { isAuthenticated } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const userPayload = await isAuthenticated();

    if (!userPayload) {
      return NextResponse.json({ msg: "unauthorized!!" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        AND: [
          {
            email: userPayload.email,
          },
          {
            username: userPayload.username,
          },
        ],
      },
    });

    if (!updateSchema.safeParse(body).success) {
      return NextResponse.json(
        {
          msg: "bad request!",
        },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: body.email,
        username: body.username,
      },
    });

    return NextResponse.json(
      {
        msg: "user updated successfully",
      },
      { status: 200 }
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
}
