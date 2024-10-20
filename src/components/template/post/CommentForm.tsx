"use client";

import { ErrorMsg } from "@/components/ErrorMsg";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { commentSchema, CommentType } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import swal from "sweetalert";

const CommentForm = ({
  slug,
  username,
}: {
  slug: string;
  username: string;
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset
  } = useForm<CommentType>({
    resolver: zodResolver(commentSchema),
    defaultValues : {
      desc : "",
      title : ""
    }
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/post/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          desc: data.desc,
          slug,
          username,
        }),
      });

      if (res.ok) {
        swal({
          title: "comment submited successfully",
          icon: "success",
          buttons: "okay",
        }).finally(() => {
          router.refresh();
          reset()
        });
      }

      if (res.status === 401) {
        swal({
          title: "you need to signin before createing any comment!!",
          icon: "error",
          buttons: "okay",
        });

        router.replace("/signin");
      }

      if (res.status === 400) {
        swal({
          title: "data is invalid make sure you fill the required fields!",
          icon: "error",
          buttons: "okay",
        });
      }

      if (res.status === 404) {
        swal({
          title: "user or post not found !",
          icon: "error",
          buttons: "okay",
        });
      }
    } catch (error) {
      swal({
        title: "An unexpected error has occurred",
        icon: "success",
        buttons: "okay",
      });
    }
  });

  return (
    <div className="w-full ml-4">
      <h2>Write a Comment : </h2>
      <form className="mt-2" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="title"
            type="text"
          />
          {errors.title && <ErrorMsg msg={errors.title.message!} />}
        </div>
        <div>
          <Label htmlFor="desc">
            Desc
          </Label>

          <Textarea {...register("desc")} id="desc"></Textarea>
          {errors.desc && <ErrorMsg msg={errors.desc.message!} />}
        </div>
        <div className="mt-4">
          <LoadingButton label="submit" isPending={isSubmitting} />
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
