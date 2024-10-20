import Footer from "@/components/module/Footer";
import Navbar from "@/components/module/Navbar";
import SinglePost from "@/components/template/post/SinglePost";
import prisma from "@/lib/client";
import { SinglePost as SinglePostType } from "@/types/post";
import { isAuthenticated } from "@/utils/auth";
import { notFound } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: string }) => {
  const user = await isAuthenticated();

  const post = await prisma.post.findFirst({
    where: {
      slug: params.slug,
    },
    select: {
      title: true,
      Comment: {
        select: {
          id: true,
          title: true,
          createdAt: true,
          desc: true,
          author: {
            select: {
              username: true,
              profile: {
                select: {
                  profile: true,
                },
              },
            },
          },
        },
      },
      featuredImage: true,
      updatedAt: true,
      desc: true,
      slug: true,
      author: {
        select: {
          username: true,
          profile: {
            select: {
              displayname: true,
              profile: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    return notFound();
  }

  return (
    <>
      <Navbar user={user} />
      <SinglePost
        updatedAt={post.updatedAt}
        author={post.author}
        desc={post.desc}
        featuredImage={post.featuredImage || "/avatar-placeholder.png"}
        title={post.title}
        slug={post.slug}
        username={user?.username}
        comments={post.Comment}
      />
      <Footer />
    </>
  );
};

export default Page;
