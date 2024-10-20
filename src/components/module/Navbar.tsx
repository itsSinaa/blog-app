"use client";

import {
  ChevronDown,
  ChevronRight,
  LogIn,
  Menu,
  Moon,
  Search,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { User } from "@/types/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import swal from "sweetalert";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

const Navbar = ({ user }: User | boolean) => {
  const router = useRouter();

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
        }
      }
    });
  }

  return (
    <>
      <header className="hidden sm:block border-b bg-slate-50">
        <nav className=" w-[90%] mx-auto">
          <div className="flex  items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <h1 className="md:text-xl lg:text-3xl text-zinc-700 font-bold">
                  TECHBLOG
                </h1>
              </Link>
            </div>
            <div className="flex gap-x-3 lg:gap-x-6">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">{user.username}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>
                      <Link href="/dashboard">Dashbaord</Link>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>
                      <Link href="/dashboard/blogs/new">Create a Post</Link>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="p-0">
                      <Button
                        onClick={logout}
                        variant={"destructive"}
                        className="w-full p-0">
                        Logout
                      </Button>
                    </DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant={"outline"}>
                  <Link
                    className="p-0.5 md:p-1 text-xs md:text-base flex  items-center gap-2 flex-row-reverse text-zinc-700"
                    href={"/signin"}>
                    <LogIn />
                    Sign in
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </nav>
      </header>
      <MobileNav user={user} />
    </>
  );
};

export default Navbar;

function MobileNav({ user }: User | boolean) {
  const [showMenu, setShowMenu] = useState(false);
  const [showSubmenu, setShowSupbmenu] = useState(false);
  const router = useRouter();

  async function logout() {
    swal({
      icon: "warning",
      title: "are you sure you want to logout ?",
      buttons: ["no", "yes"],
    }).then(async () => {
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
      }
    });
  }

  return (
    <header className="block sm:hidden border-b bg-slate-50">
      <nav className="w-full py-5 ">
        <div>
          <div className="flex items-center px-3 justify-between">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{user.username}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>
                    <Link href="/dashboard">Dashbaord</Link>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    <Link href="/dashboard/create-blog">Create a Post</Link>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="p-0">
                    <Button
                      onClick={logout}
                      variant={"destructive"}
                      className="w-full p-0">
                      Logout
                    </Button>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button>
                <Link href={"/signin"}>Signin</Link>
              </Button>
            )}

            <Link href="/">
              <h1 className="text-3xl text-zinc-700 font-bold">TECHBLOG</h1>
            </Link>

            <div className="relative">
              <Button
                onClick={() => setShowMenu(true)}
                className="p-2"
                variant={"secondary"}>
                <Menu />
              </Button>
            </div>
          </div>

          <div
            className={`fixed top-0 z-20 bg-white w-64 h-full transition-all ease-in-out ${
              showMenu ? " left-0" : "-left-64"
            }`}>
            <div className="flex items-center justify-between border-b px-2 py-3">
              <Link href="/">
                <h1 className="text-2xl text-zinc-700 font-bold">TECHBLOG</h1>
              </Link>

              <div className="space-x-1">
                <Button
                  className="p-0"
                  onClick={() => setShowMenu(false)}
                  variant={"ghost"}>
                  <X />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          className="z-10 fixed inset-0 w-full h-screen top-0 left-0 bg-black/15 transition-all"></div>
      )}
    </header>
  );
}