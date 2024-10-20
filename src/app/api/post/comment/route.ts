import prisma from "@/lib/client";
import { commentSchema } from "@/types/post";
import { isAuthenticated } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const userPayload = await isAuthenticated();
    if (!userPayload) {
      return Response.json({ msg: "unauthorized!!" }, { status: 401 });
    }

    const userData = {
      title: body.title,
      desc: body.desc,
    };

    if (!commentSchema.safeParse(userData).success) {
      return Response.json({ msg: "data is invalid!!" }, { status: 400 });
    }

    const post = await prisma.post.findFirst({
      where: {
        slug: body.slug,
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      return Response.json({ msg: "not found" }, { status: 404 });
    }

    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return Response.json({ msg: "not found" }, { status: 404 });
    }

    await prisma.comment.create({
      data: {
        desc: body.desc,
        title: body.title,
        postID: post.id,
        userID: user.id,
      },
    });

    return NextResponse.json(
      { msg: "comment submited successfully" },
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
}
