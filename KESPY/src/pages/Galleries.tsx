import React, { useState, useEffect } from "react";
import { Post } from "../types";
import PostCard from "../components/PostCard";

export default function Galleries() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          // Filter to only show posts with images
          setPosts(data.posts.filter((p: Post) => p.image));
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
      <div className="mb-8 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-center overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-3xl font-serif tracking-tight text-[#1a1a1a] mb-2 relative z-10">
          Community Posts
        </h1>
        <p className="text-gray-500 font-medium relative z-10">
          Visual perspectives and moments shared by the community.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 gap-4 space-y-4">
        {loading ? (
          <div className="flex justify-center p-8 w-full col-span-full">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="break-inside-avoid">
              <PostCard post={post} />
            </div>
          ))
        ) : (
          <div className="text-center py-16 text-slate-500 col-span-full">
            <p>No images in the gallery yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
