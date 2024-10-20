import prisma from "@/lib/client";
import { postSchema } from "@/types/post";
import { isAuthenticated } from "@/utils/auth";
import { convertToSlug } from "@/utils/post";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const user = await isAuthenticated();
    const body = await req.formData();

    const userID = await prisma.user.findFirst({
      where: {
        email: {
          equals: user.email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

    const title = body.get("title");
    const desc = body.get("desc");
    const featuredImage = body.get("featuredImage") as any;

    if (!user) {
      return Response.json({ msg: "unauthorized!!" }, { status: 401 });
    }

    if (!postSchema.safeParse(body)) {
      return Response.json({ msg: "data is invalid!!" }, { status: 400 });
    }

    //create slug
    const postSlug = await convertToSlug(title as string);

    // store image
    const buffer = Buffer.from(await featuredImage.arrayBuffer());
    const fileName = Date.now() + featuredImage.name;
    const imgPath = path.join(process.cwd(), "public/uploads/" + fileName);

    await writeFile(imgPath, buffer);

    const createdPost = await prisma.post.create({
      data: {
        desc: desc as string,
        slug: postSlug,
        title: title as string,
        featuredImage: `/uploads/${fileName}`,
        userID: userID?.id,
      },
    });

    return Response.json(
      { message: "Post created successfully :))", data: createdPost },
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

export async function GET() {
  const posts = await prisma.post.findMany({
    select: {
      author: {
        select: {
          email: true,
          username: true,
        },
      },
      slug: true,
      desc: true,
      featuredImage: true,
      title: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return Response.json(posts);
}
