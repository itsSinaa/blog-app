import { isAuthenticated } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await isAuthenticated();

  if (user) {
    redirect("/");
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
