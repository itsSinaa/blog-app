import React from "react";
import CommentCard from "./CommentCard";
import { CommentsType } from "@/types/post";
import { isAuthenticated } from "@/utils/auth";

const Comments = async ({ comments }: { comments: CommentsType[] }) => {
  const user = await isAuthenticated();

  return (
    <div className="w-full my-8 space-y-4">
      <h2 className="text-base lg:text-xl">Comments</h2>
      <div className="space-y-4 h-[400px] overflow-y-scroll">
        {comments.map((comment, index) => (
          <CommentCard user={user.username} key={index} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;
