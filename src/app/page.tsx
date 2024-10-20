import Footer from "@/components/module/Footer";
import Navbar from "@/components/module/Navbar";
import CreatedPosts from "@/components/template/index/CreatedPosts";
import RecentPosts from "@/components/template/index/RecentPosts";
import { SinglePost } from "@/types/post";
import { isAuthenticated } from "@/utils/auth";

export default async function Home() {
  const user = await isAuthenticated();

  const res = await fetch("http://localhost:3000/api/post");
  const posts = await res.json();

  return (
    <>
      <Navbar user={user} />
      <RecentPosts posts={posts as SinglePost[]} />
      <CreatedPosts />
      <Footer />
    </>
  );
}
