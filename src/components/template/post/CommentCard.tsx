"use client";

import { CommentsType } from "@/types/post";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import swal from "sweetalert";

const CommentCard = ({
  comment,
  user,
}: { comment: CommentsType } & { user: string }) => {
  const router = useRouter();

  const DeleteComment = (id: string) => {
    swal({
      icon: "warning",
      title: "are you sure about deleting your comment ?",
      buttons: ["no", "yes"],
    }).then(async () => {
      try {
        const res = await fetch(`/api/post/comment/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          swal({
            title: "comment removed !!",
            icon: "success",
            buttons: "okay",
          });

          router.refresh();
        }

        if(res.status === 404){
          swal({
            title: "comment not found !!",
            icon: "error",
            buttons: "okay",
          });
        }
      } catch (error) {
        swal({
          title: "An unexpected error has occurred",
          icon: "error",
          buttons: "Okay",
        });
      }
    });
  };

  return (
    <div className="border border-zinc-950/15 rounded space-y-4 p-2 bg-gray-50 mr-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="rounded-full size-16"
            src={comment.author?.profile?.profile || "/avatar-placeholder.png"}
            alt=""
          />
          <div className="grid">
            <span className="text-base sm:text-lg">
              {comment.author.username}
            </span>
            <span className="text-muted-foreground text-xs lg:text-sm">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {user === comment.author.username && (
          <button onClick={() => DeleteComment(comment.id)}>
            <Trash2 className="text-destructive" />
          </button>
        )}
      </div>
      <div className="">
        <h3 className="text-lg font-medium">{comment.title}</h3>
        <p className="text-sm text-muted-foreground">{comment.desc}</p>
      </div>
    </div>
  );
};

export default CommentCard;
