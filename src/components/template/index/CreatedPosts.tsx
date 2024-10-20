"use client";

import React, { useEffect, useState } from "react";
import CreatedPostsCard from "./CreatedPostsCard";
import PostPagination from "./Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { PostCard } from "@/types/post";

const CreatedPosts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [posts, setPosts] = useState<PostCard[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const LIMIT = 2;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/post/index?page=${currentPage}&limit=${LIMIT}`
        );
        const data = await res.json();

        setPosts(data.posts);
        setTotalPages(data.totalPages);
        setTotalPosts(data.totalPosts);
      } catch (error) {
        console.log("index post fetch ->", error?.message);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-4 mb-10">
      {posts.map((post, index) => {
        return (
          <CreatedPostsCard
            date={post.updatedAt}
            desc={post.desc}
            imgSrc={post.featuredImage || "/avatar-placeholder.png"}
            title={post.title}
            displayName={post.author?.profile?.displayname as string || "someone"}
            href={`/posts/${post.slug}`}
            key={index}
          />
        );
      })}

      <PostPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CreatedPosts;
