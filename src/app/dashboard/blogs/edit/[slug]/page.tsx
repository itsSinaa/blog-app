import React from "react";
import EditPost from "@/components/template/dashbaord/post/EditPost";
import prisma from "@/lib/client";
import { notFound } from "next/navigation";
import { SinglePost } from "@/types/post";

const Page = async ({ params }: { params: { slug: string } }) => {
  const post = await prisma.post.findFirst({
    where: {
      slug: {
        equals: params.slug,
        mode: "insensitive",
      },
    },
  });

  if (!post) {
    return notFound();
  }

  return <EditPost post={post as SinglePost}/>;
};

export default Page;
