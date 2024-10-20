import Header from "@/components/template/dashbaord/Header";
import PostsTabel from "@/components/template/dashbaord/post/PostsTabel";
import SideBar from "@/components/template/dashbaord/SideBar";
import prisma from "@/lib/client";
import { isAuthenticated } from "@/utils/auth";
import React from "react";

const Blogs = async () => {
  const userPayload = await isAuthenticated();

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: userPayload.email,
      },
    },
    select: {
      username: true,
      posts: true,
      id: true,
      role: true,
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      userID: user?.id,
    },
    select: {
      title: true,
      slug: true,
      id : true
    },
  });

  return (
    <div className="bg-slate-200 h-screen flex">
      <main className="w-[80%] bg-white p-5">
        <Header
          username={user?.username as string}
          post={user?.posts.length as number}
          role={user?.role as string}
        />
        <PostsTabel posts={posts} />
      </main>
      <SideBar />
    </div>
  );
};

export default Blogs;
