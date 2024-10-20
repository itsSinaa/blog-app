"use client";

import React from "react";
import RecentPostCard from "./RecentPostCard";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import { SinglePost } from "@/types/post";

const RecentPosts = ({ posts }: SinglePost[]) => {
  return (
    <div className="container my-10">
      <div className="w-full">
        <Swiper
          modules={[Navigation]}
          navigation
          loop={true}
          slidesPerView={"auto"}
          spaceBetween={20}
          slidesPerGroupAuto={true}>
          {posts?.slice(0, 5).map((post, index) => (
            <SwiperSlide key={index} className="flex flex-1">
              <RecentPostCard imgSrc={post.featuredImage} title={post.title}/>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default RecentPosts;
