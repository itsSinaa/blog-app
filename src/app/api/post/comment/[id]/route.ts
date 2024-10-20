import prisma from "@/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comment = await prisma.comment.delete({
      where: {
        id: params.id,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { msg: "comment not found !!" },
        { status: 404 }
      );
    }

    return NextResponse.json({ msg: "comment delted !!" }, { status: 200 });
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
