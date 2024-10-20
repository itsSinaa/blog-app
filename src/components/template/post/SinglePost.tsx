import React from "react";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import { CommentsType, PostCard } from "@/types/post";

const SinglePost = ({
  desc,
  featuredImage,
  title,
  updatedAt,
  author,
  slug,
  username,
  comments
}: PostCard & { username: string } & { comments: CommentsType[] } & {id : string}) => {

  return (
    <div className="container">
      <div className="mt-4">
        <img
          className="rounded flex shrink-0 w-full h-[700px] object-cover"
          src={featuredImage}
          alt=""
        />
      </div>

      <h1 className="my-4 text-xl sm:text-2xl lg:text-4xl font-medium">
        {title}
      </h1>

      <div>
        <div className="flex items-center gap-2 border-t border-b py-3 lg:py-5">
          <div className="rounded-full size-16">
            <img
              src={author?.profile?.profile || "/avatar-placeholder.png"}
              className="rounded-full object-cover"
              alt={author?.profile?.displayName}
            />
          </div>
          <div>
            <h2 className="text-base sm:text-lg">
              {author?.profile?.displayname || "someone"}
            </h2>
            <p className="text-muted-foreground text-xs lg:text-sm">
              {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <p className="my-5">{desc}</p>
      </div>

      <div className="grid items-baseline grid-cols-1 sm:grid-cols-2">
        <Comments comments={comments}/>
        <CommentForm slug={slug} username={username} />
      </div>
    </div>
  );
};

export default SinglePost;
