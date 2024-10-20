"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { POST_TABLE_TYPE } from "@/types/post";
import swal from "sweetalert";
import { useRouter } from "next/navigation";

const PostsTabel = ({ posts }: { posts: POST_TABLE_TYPE[] }) => {
  const router = useRouter();

  const deletePost = (id: string) => {
    swal({
      title: "are you certain about deleting this post ?",
      icon: "warning",
      buttons: ["no", "yes"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch(`/api/post/${id}`, {
          method: "DELETE",
        });

        if (res.status === 401) {
          swal({
            title: "you need to signin before deleting any post!!",
            icon: "error",
            buttons: "okay",
          });

          router.replace("/signin");
        }

        if (res.status === 200) {
          swal({
            title: "post successfully deleted",
            icon: "success",
            buttons: "okay",
          });

          router.replace("/dashboard/blogs");
          router.refresh();
        }
      }
    });
  };

  return (
    <div className="container my-8">
      <div className="flex  items-center justify-between">
        <h1 className="my-5 text-3xl">Posts</h1>
        <Link
          className="flex items-center gap-2 p-2 bg-sky-500 hover:bg-sky-600 text-white rounded shadow"
          href={"/dashboard/blogs/new"}>
          <span>Create new Post</span>
          <PlusCircle />
        </Link>
      </div>
      {posts.length ? (
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Edit</TableHead>
              <TableHead className="text-right">Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>category</TableCell>
                <TableCell className="text-right">
                  <Button className="bg-sky-600 hover:bg-sky-800">
                    <Link href={`/dashboard/blogs/edit/${post.slug}`}>
                      Edit Post
                    </Link>
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => deletePost(post.id)}
                    variant={"destructive"}>
                    Delete Post
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <h2 className="text-center text-2xl">you didn't post anything !!</h2>
      )}
    </div>
  );
};

export default PostsTabel;
