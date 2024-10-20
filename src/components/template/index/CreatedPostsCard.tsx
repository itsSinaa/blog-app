import { Calendar, User } from "lucide-react";
import Link from "next/link";
import React from "react";

type PostType = {
  href: string;
  imgSrc: string;
  title: string;
  date: string;
  displayName: string;
  desc: string;
};

const CreatedPostsCard = ({
  href,
  imgSrc,
  title,
  date,
  displayName,
  desc,
}: PostType) => {
  return (
    <Link
      href={href}
      className="block max-w-[350px] sm:max-w-[560px] md:max-w-[710px] xl:max-w-full mx-auto p-2 border rounded space-y-3">
      <h3>{title}</h3>

      <img
        src={imgSrc}
        alt="featured"
        className="rounded flex shrink-0 w-full h-[300px] object-cover"
      />

      <div className="space-y-2">
        <div className="flex gap-2.5">
          <div className="flex gap-0.5">
            <Calendar className="text-muted-foreground size-5" />
            <span className="text-muted-foreground text-sm">{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-0.5">
            <User className="text-muted-foreground size-5" />
            <span className="text-muted-foreground text-sm">{displayName}</span>
          </div>
        </div>
        <p className="line-clamp-3">{desc}</p>
      </div>
    </Link>
  );
};

export default CreatedPostsCard;
