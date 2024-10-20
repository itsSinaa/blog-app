import BlogCard from "@/components/module/BlogCard";
import prisma from "@/lib/client";
import { getUserID } from "@/utils/auth";
import React from "react";

const Posts = async () => {
  const userId = await getUserID();
  const userPosts = await prisma.post.findMany({
    where: {
      userID: userId?.id,
    },
    select: {
      desc: true,
      slug: true,
      title: true,
      featuredImage : true,
      updatedAt : true,
      author: {
        select: {
          profile: {
            select: {
              displayname: true,
            },
          },
        },
      },
    },
    take: 4,
  });

  return (
    <div className="mt-10 flex flex-wrap gap-5">
      <div className="flex flex-col flex-1">
        <h2 className="text-xl mb-4">Recently Published Posts</h2>
        <div className="w-full flex flex-wrap gap-3">
          {userPosts.map((userPost,index) => (
            <BlogCard  key={index} {...userPost}/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
