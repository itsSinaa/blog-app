"use client";

import { Input } from "@/components/ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import React from "react";
import LoadingButton from "@/components/LoadingButton";
import { Controller, useForm } from "react-hook-form";
import { postSchema, PostType } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMsg } from "@/components/ErrorMsg";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import swal from "sweetalert";

const Page = () => {
  const router = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostType>({
    defaultValues: {
      desc: "",
      title: "",
    },
    resolver: zodResolver(postSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!postSchema.safeParse(data).success) {
      swal({
        title: "data is invalid",
        icon: "error",
        buttons: "okay",
      });
    }

    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("desc", data.desc);
      formData.append("featuredImage", data.featuredImage);

      const res = await fetch("/api/post", {
        method: "POST",
        body: formData,
      });

      if (res.status === 401) {
        swal({
          title: "you need to signin before createing any post!!",
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

      if (res.ok) {
        swal({
          title: "post created successfully",
          icon: "success",
          buttons: "okay",
        });
        reset();
        router.replace("/dashboard/blogs")
        router.refresh()
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
    <div className="container">
      <h1 className="text-center text-xl py-3">Creating New Blog</h1>

      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <Input {...register("title")} placeholder="Title..." />
          {errors.title && <ErrorMsg msg={errors.title.message!} />}
        </div>

        <div>
          <Controller
            name="desc"
            control={control}
            render={({ field }) => <SimpleMDE {...field} placeholder="Desc" />}
          />
          {errors.desc && <ErrorMsg msg={errors.desc.message!} />}
        </div>

        <div>
          <Controller
            name="featuredImage"
            control={control}
            render={({ field }) => (
              <div>
                <label htmlFor="featuredimage">
                  <span className="inline-flex cursor-pointer justify-center whitespace-nowrap gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                    <Upload className="size-5" />
                    Upload Featured Image
                  </span>
                </label>
                <input
                  id="featuredimage"
                  type="file"
                  className="hidden"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </div>
            )}
          />
          {errors.featuredImage && (
            <ErrorMsg msg={errors.featuredImage.message!} />
          )}
        </div>

        <div className="space-x-3">
          <LoadingButton isPending={isSubmitting} label="Craete Post" />
          {/* <LoadingButton isPending={isSubmitting} label="Save as draft" /> */}
        </div>
      </form>
    </div>
  );
};

export default Page;
