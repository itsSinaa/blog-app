"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import "easymde/dist/easymde.min.css";
import LoadingButton from "@/components/LoadingButton";
import { Controller, useForm } from "react-hook-form";
import { postSchema, PostType, SinglePost } from "@/types/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMsg } from "@/components/ErrorMsg";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import Image from "next/image";

type EditPostProps = {
  post: SinglePost;
};

const EditPost = ({ post }: EditPostProps) => {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(
    post.featuredImage || null
  );

  const {
    register,
    reset,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostType>({
    defaultValues: {
      desc: post.desc || "",
      title: post.title || "",
      featuredImage: null, // Initialize as null; handle existing image separately
    },
    resolver: zodResolver(postSchema),
  });

  const featuredImage = watch("featuredImage");

  useEffect(() => {
    let file: File | null = null;
    if (featuredImage && featuredImage instanceof File) {
      file = featuredImage;
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Cleanup: revoke the object URL when component unmounts or when a new file is selected
      return () => URL.revokeObjectURL(objectUrl);
    } else if (!featuredImage) {
      setPreview(post.featuredImage || null);
    }
  }, [featuredImage, post.featuredImage]);

  const onSubmit = handleSubmit(async (data) => {
    if (!postSchema.safeParse(data).success) {
      swal({
        title: "Data is invalid",
        icon: "error",
        buttons: "Okay",
      });
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("desc", data.desc);
      if (data.featuredImage) {
        formData.append("featuredImage", data.featuredImage);
      }

      const res = await fetch(`/api/post/${post.id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.status === 401) {
        swal({
          title: "You need to sign in before updating any post!",
          icon: "error",
          buttons: "Okay",
        });

        router.replace("/signin");
      }

      if (res.status === 400) {
        swal({
          title: "Post Dosent exist !!",
          icon: "error",
          buttons: "Okay",
        });
      }

      if (res.ok) {
        swal({
          title: "Post updated successfully",
          icon: "success",
          buttons: "Okay",
        });
        reset();
        setPreview(null); // Reset the preview after successful submission
        router.replace("/dashboard/blogs");
        router.refresh();
      }
    } catch (error) {
      swal({
        title: "An unexpected error has occurred",
        icon: "error",
        buttons: "Okay",
      });
    }
  });

  return (
    <div className="container mb-2">
      <h1 className="text-center text-xl py-3">Editing Blog Post</h1>

      <form className="space-y-3" onSubmit={onSubmit}>
        {/* Title Field */}
        <div>
          <Input {...register("title")} placeholder="Title..." />
          {errors.title && <ErrorMsg msg={errors.title.message!} />}
        </div>

        {/* Description Field */}
        <div>
          <Controller
            name="desc"
            control={control}
            render={({ field }) => (
              <SimpleMDE {...field} placeholder="Description" />
            )}
          />
          {errors.desc && <ErrorMsg msg={errors.desc.message!} />}
        </div>

        {/* Featured Image Field */}
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
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    field.onChange(file || null);
                  }}
                />
              </div>
            )}
          />
          {errors.featuredImage && (
            <ErrorMsg msg={errors.featuredImage.message!} />
          )}
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium">Image Preview:</p>
            <img
              src={preview}
              alt="Featured Image Preview"
              className="max-w-xs rounded-md border"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="space-x-3">
          <LoadingButton isPending={isSubmitting} label="Update Post" />
          {/* <LoadingButton isPending={isSubmitting} label="Save as draft" /> */}
        </div>
      </form>
    </div>
  );
};

export default EditPost;
