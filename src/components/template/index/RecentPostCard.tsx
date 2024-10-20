import Image from "next/image";
import React from "react";

const RecentPostCard = ({
  title,
  imgSrc,
}: {
  title: string;
  imgSrc: string;
}) => {
  return (
    <div className="relative w-[350px]">
      <img
        src={imgSrc}
        alt="idk"
        className="w-full h-[320px] object-cover rounded recent-img"
      />
      <div className="absolute w-[350px] bg-black inset-0 opacity-50 z-10 rounded"></div>
      <h3 className="text-white z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {title}
      </h3>
    </div>
  );
};

export default RecentPostCard;
