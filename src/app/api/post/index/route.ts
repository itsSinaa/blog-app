import prisma from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 2;

    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Invalid limit value" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        title: true,
        featuredImage: true,
        updatedAt: true,
        slug : true,
        author: {
          select: {
            profile: {
              select: {
                displayname: true,
              },
            },
          },
        },
        desc: true,
      },
    });

    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    if (page > totalPages && totalPosts !== 0) {
      return NextResponse.json(
        { error: "Page number exceeds total pages" },
        { status: 400 }
      );
    }

    const response = {
      posts,
      totalPages,
      currentPage: page,
      totalPosts,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}