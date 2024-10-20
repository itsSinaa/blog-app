import prisma from "@/lib/client";
import { profileSchema } from "@/types/auth";
import { getUserID, isAuthenticated } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function PUT(req: NextRequest) {
  try {
    const userPayload = await isAuthenticated();
    const body = await req.formData();

    const displayName = body.get("displayName");
    const bio = body.get("bio");
    const profile = body.get("profile") as any;

    if (!userPayload) {
      return NextResponse.json({ msg: "unauthorized!!" }, { status: 401 });
    }

    const userID = await getUserID();

    const userProfile = await prisma.profile.findFirst({
      where: {
        userID: userID?.id,
      },
    });

    const buffer = Buffer.from(await profile.arrayBuffer());
    const imageName = Date.now() + profile.name;
    const imgPath = path.join(
      process.cwd(),
      "public/uploads/profile/" + imageName
    );

    if (userProfile) {
      fs.unlink(`/deploy-next/public/${userProfile.profile}`, (error) => {
        if (error) {
          console.error(`Error removing file: ${error}`);
          return;
        }

        console.log(
          `File ${userProfile.profile} has been successfully removed.`
        );
      });
    } else {
      await writeFile(imgPath, buffer);
    }

    if (userProfile) {
      await prisma.profile.update({
        where: {
          userID: userID.id
        },
        data: {
          bio: bio as string,
          displayname: displayName as string,
          profile: `/uploads/profile/${imageName}`,
        },
      });
    } else {
      await prisma.profile.create({
        data: {
          bio: bio as string,
          displayname: displayName as string,
          profile: `/uploads/profile/${imageName}`,
          userID: userID?.id as string,
        },
      });
    }

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

export async function POST(req: NextRequest) {
  try {
    const userPayload = await isAuthenticated();
    const body = await req.formData();

    const displayName = body.get("displayName");
    const bio = body.get("bio");
    const profile = body.get("profile") as any;

    if (!userPayload) {
      return NextResponse.json({ msg: "unauthorized!!" }, { status: 401 });
    }

    if (!profileSchema.safeParse(body).success) {
      return NextResponse.json(
        {
          msg: "bad request!",
        },
        { status: 400 }
      );
    }

    const userID = await getUserID();

    const userProfile = await prisma.profile.findFirst({
      where: {
        userID: userID?.id,
      },
    });

    if (userProfile) {
      return NextResponse.json(
        {
          msg: "conflict profile already craeted",
        },
        { status: 409 }
      );
    }

    const buffer = Buffer.from(await profile.arrayBuffer());
    const fileName = Date.now() + profile.name;
    const imgPath = path.join(process.cwd(), "public/uploads/" + fileName);

    await writeFile(imgPath, buffer);

    const createdProfile = await prisma.profile.create({
      data: {
        bio: bio as string,
        displayname: displayName as string,
        profile: fileName as string,
        userID: userID?.id as string,
      },
    });

    return Response.json(
      { message: "Post created successfully :))", data: createdProfile },
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
