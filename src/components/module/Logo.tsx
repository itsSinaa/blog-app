import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <h1 className="text-xs sm:text-sm md:text-xl lg:text-3xl text-zinc-700 font-bold">
        TECHBLOG
      </h1>
    </Link>
  );
};

export default Logo;
