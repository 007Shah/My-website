import React, { useState, useEffect } from "react";
import { Post } from "../types";
import PostCard from "../components/PostCard";
import { MessageSquare, Flame } from "lucide-react";

export default function Comments() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          // Filter to show posts that are text-heavy or have comments, or just all posts sorted by comments
          const sorted = data.posts.sort(
            (a: Post, b: Post) => b.commentsCount - a.commentsCount,
          );
          setPosts(sorted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto pb-20">
      <div className="mb-8 p-6 bg-gradient-to-tr from-indigo-950 via-slate-900 to-pink-950/30 rounded-[2rem] border border-slate-800 shadow-xl shadow-black/30 flex flex-col justify-center relative overflow-hidden text-slate-100">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-3xl font-serif tracking-tight relative z-10 font-bold text-white leading-none">
            Comments & Discussions
          </h1>
        </div>
        <p className="text-slate-400 text-sm font-medium relative z-10 pl-11">
          Trending items on the network sorted by conversational volume.
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-16 bg-[#141725]/50 rounded-[2.5rem] border border-slate-800 text-slate-500">
            <p className="font-medium text-sm">No active discussions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
