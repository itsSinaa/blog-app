import Header from "@/components/template/dashbaord/Header";
import Posts from "@/components/template/dashbaord/Posts";
import SideBar from "@/components/template/dashbaord/SideBar";
import prisma from "@/lib/client";
import { isAuthenticated } from "@/utils/auth";
import React from "react";

const Page = async () => {
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
      role: true,
    },
  });

  return (
    <div className="bg-slate-200 h-screen flex">
      <main className="w-[80%] bg-white p-5">
        <Header username={user?.username as string} post={user?.posts.length as number} role={user?.role as string} />
        <Posts />
      </main>
      <SideBar />
    </div>
  );
};

export default Page;
