"use client";

import Logo from "@/components/module/Logo";
import { Button } from "@/components/ui/button";
import { File, Home, LogOut, User } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import React from "react";
import swal from "sweetalert";

const SideBar = () => {
  const router = useRouter();
  const path = usePathname();

  async function logout() {
    swal({
      icon: "warning",
      title: "are you sure you want to logout ?",
      buttons: ["no", "yes"],
    }).then(async (result) => {
      if (result) {
        const res = await fetch("/api/signout", {
          method: "POST",
        });

        if (res.ok) {
          swal({
            icon: "success",
            title: "Logged out successfully",
            buttons: "okay",
          });

          router.replace("/signin");
          router.refresh();
        }
      }
    });
  }

  return (
    <aside className="w-[20%]">
      <div className="w-full flex justify-center border-b p-5 border-zinc-700/35">
        <Logo />
      </div>
      <ul className="m-5 p-1 space-y-2 [&>*]:p-1">
        <li>
          <Link
            className="relative flex justify-center md:justify-normal items-center gap-2"
            href={"/dashboard"}>
            <Home className="shrink-0 size-8 md:size-6" />
            <span className="hidden md:inline">Dashbaord</span>
            {path === "/dashboard" && (
              <span className="absolute block size-2 bg-[#2a56ae] rounded -left-3"></span>
            )}
          </Link>
        </li>
        <li>
          <Link
            className="relative flex justify-center md:justify-normal items-center gap-2"
            href={"/dashboard/account"}>
            <User className="shrink-0 size-8 md:size-6" />
            <span className="hidden md:inline">Account Info</span>
            {path === "/dashboard/account" && (
              <span className="absolute block size-2 bg-[#2a56ae] rounded -left-3"></span>
            )}
          </Link>
        </li>
        <li>
          <Link
            className="relative flex justify-center md:justify-normal items-center gap-2"
            href={"/dashboard/blogs"}>
            <File className="shrink-0 size-8 md:size-6" />
            <span className="hidden md:inline">Create Blog</span>
            {path === "/dashboard/blogs" && (
              <span className="absolute block size-2 bg-[#2a56ae] rounded -left-3"></span>
            )}
          </Link>
        </li>
        <li>
          <Link
            className="text-destructive flex justify-center md:justify-normal items-center gap-2"
            onClick={logout}
            href={"#"}>
            <LogOut className="shrink-0 size-8 md:size-6" />
            <span className="hidden md:inline">Logout</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default SideBar;
