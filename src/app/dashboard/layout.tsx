import { isAuthenticated } from "@/utils/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await isAuthenticated();

  if (!user) {
    redirect("/signin");
  }

  return <React.Fragment>{children}</React.Fragment>;
}
