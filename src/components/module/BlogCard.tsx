import { PostCard } from "@/types/post";
import { Calendar, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogCard = ({
  desc,
  slug,
  title,
  featuredImage,
  updatedAt,
  author,
}: PostCard) => {
  return (
    <div className="max-w-[350px] space-y-2 border p-2 rounded-lg">
      <Link href={`/posts/${slug}`}>
        <Image
          className="rounded w-[400px] h-[320px]"
          src={featuredImage || "/login-image.jpg"}
          alt="blog name1"
          width={400}
          height={120}
        />
      </Link>
      <h3 className="font-medium">{title}</h3>
      <div className="flex gap-2.5">
        <div className="flex gap-0.5">
          <Calendar className="text-muted-foreground size-5" />
          <span className="text-muted-foreground text-sm">
            {new Date(updatedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-0.5">
          <User className="text-muted-foreground size-5" />
          <span className="text-muted-foreground text-sm">
            {author?.profile?.displayname || "someone"}
          </span>
        </div>
      </div>
      <p className="line-clamp-2 text-zinc-800">{desc}</p>
    </div>
  );
};

export default BlogCard;
// desc : String slug : string : title : String
