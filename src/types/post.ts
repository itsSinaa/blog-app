import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constant/post";
import { z } from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "title is required!!")
    .max(255, "Title cannot exceed 255 characters"),
  desc: z.string().min(1, "description is required!!"),
  featuredImage: z
    .any()
    .refine(
      (file) => file?.size <= MAX_FILE_SIZE,
      "Image must be less than 5MB"
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png, and .webp formats are supported"
    ),
});

export type PostType = z.infer<typeof postSchema>;

export type POST_TABLE_TYPE = {
  title: string;
  slug: string;
  id: string;
};

export type SinglePost = {
  id: string;
  title: string;
  slug: string;
  featuredImage: string;
  desc: string;
  userID: string;
};

export type PostCard = {
  desc: string;
  slug: string;
  title: string;
  featuredImage: string;
  updatedAt: string;
  author?: {
    profile: {
      displayname: string;
    };
  };
};

export const commentSchema = z.object({
  title: z
    .string()
    .min(1, "title is required!!")
    .max(255, "Title cannot exceed 255 characters"),
  desc: z.string().min(1, "description is required!!"),
});

export type CommentType = z.infer<typeof commentSchema>;

export type CommentsType = {
  createdAt: string;
  author: string;
} & CommentType;
