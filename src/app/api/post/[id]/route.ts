import { isAuthenticated } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { writeFile } from "fs/promises";
import prisma from "@/lib/client";
import path from "path";
import { revalidatePath } from "next/cache";
import { convertToSlug } from "@/utils/post";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.formData();
    const userPayload = await isAuthenticated();

    const title = body.get("title");
    const featuredImage = body.get("featuredImage") as any;
    const desc = body.get("desc");

    if (!userPayload) {
      return NextResponse.json({ msg: "unauthorized!!" }, { status: 401 });
    }

    const post = await prisma.post.findFirst({
      where: {
        id: {
          equals: params.id,
        },
      },
    });

    if (!post) {
      return NextResponse.json({ msg: "bad request!!" }, { status: 400 });
    }

    fs.unlink(`/deploy-next/public/${post.featuredImage}`, (error) => {
      if (error) {
        console.error(`Error removing file: ${error}`);
        return;
      }
    });

    const buffer = Buffer.from(await featuredImage.arrayBuffer());
    const imageName = Date.now() + featuredImage.name;
    const imgPath = path.join(process.cwd(), "public/uploads/" + imageName);
    await writeFile(imgPath, buffer);

    const slug = await convertToSlug(title as string);

    await prisma.post.update({
      where: {
        id: params.id,
      },
      data: {
        desc: desc as string,
        title: title as string,
        featuredImage: `/uploads/${imageName}`,
        slug,
      },
    });

    revalidatePath("/dashboard/blogs");

    return NextResponse.json(
      { msg: "user profile successfully updated !!!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Server error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userPayload = await isAuthenticated();

    if (!userPayload) {
      return NextResponse.json({ msg: "unauthorized!!" }, { status: 401 });
    }

    const featuredImage = await prisma.post.findFirst({
      where: {
        id: params.id,
      },
      select: {
        featuredImage: true,
      },
    });

    fs.unlink(
      `/deploy-next/public/${featuredImage?.featuredImage}`,
      (error) => {
        if (error) {
          console.error(`Error removing file: ${error}`);
          return;
        }

        console.log(
          `File ${featuredImage?.featuredImage} has been successfully removed.`
        );
      }
    );

    await prisma.post.delete({
      where: {
        id: params.id,
      },
    });

    revalidatePath("/dashboard/blogs");

    return NextResponse.json(
      { msg: "post successfully deleted !!!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Server error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred.",
      },
      { status: 500 }
    );
  }
}
