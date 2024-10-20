import React from "react";

const Header = ({
  role,
  post,
  username,
}: {
  username: string;
  role: string;
  post: number;
}) => {
  return (
    <>
      <div>
        <h1 className="mt-5 my-10 text-3xl">
          Welcome <span className="underline">{username}</span> 🙌
        </h1>
      </div>
      <div className="mt-5 flex items-center gap-4 flex-wrap">
        <div className="bg-[#facc15] w-fit p-3 shadow rounded text-white">
          <h4 className="text-3xl">Posts : {post}</h4>
        </div>
        <div className="bg-[#4e81fb] w-fit p-3 shadow rounded text-white">
          <h4 className="text-3xl">Comments : 1</h4>
        </div>
        <div className="bg-[#f43f5e] w-fit p-3 shadow rounded text-white">
          <h4 className="text-3xl">Role : {role}</h4>
        </div>
      </div>
    </>
  );
};

export default Header;
