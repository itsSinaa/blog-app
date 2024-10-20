import z from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constant/post";

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Name is required")
    .max(50, "Username cannot exceed 50 characters.")
    .regex(
      /^[A-Za-z0-9-_]{1,255}$/,
      "Input can only contain letters, numbers, underscores, and hyphens."
    ),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters.")
    .regex(
      /(?=.*?[A-Z])/,
      "Password must contain at least one uppercase letter."
    )
    .regex(
      /(?=.*?[a-z])/,
      "Password must contain at least one lowercase letter."
    )
    .regex(/(?=.*?[0-9])/, "Password must contain at least one number.")
    .regex(
      /(?=.*?[#?!@$%^&*-])/,
      "Password must contain at least one special character (e.g., #, ?, !, @, $, %, ^, &amp;, *)."
    ),
});

export type Register = z.infer<typeof registerSchema>;

export const signinSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "username or email is required !!")
    .max(255, "cannot exceed 255 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters."),
});

export type Signin = z.infer<typeof signinSchema>;

// jwt token
export type User = {
  username: string;
  email: string;
  role: string;
};

export const updateSchema = z.object({
  username: z
    .string()
    .min(1, "Name is required")
    .max(50, "Username cannot exceed 50 characters.")
    .regex(
      /^[A-Za-z0-9-_]{1,255}$/,
      "Input can only contain letters, numbers, underscores, and hyphens."
    ),
  email: z
    .string()
    .email("Invalid email address")
    .max(255, "Email cannot exceed 255 characters."),
});

export type UpdateType = z.infer<typeof updateSchema>;

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name is required")
    .max(255, "Bio cannot exceed 255 characters."),
  bio: z.string().min(1, "Bio is required"),
  profile: z
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

export type ProfileType = z.infer<typeof profileSchema>;