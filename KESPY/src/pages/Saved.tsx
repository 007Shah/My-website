import React, { useState, useEffect } from "react";
import { Post } from "../types";
import PostCard from "../components/PostCard";
import { Bookmark, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function Saved() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    // Load saved IDs
    try {
      const saved = JSON.parse(localStorage.getItem("saved_post_ids") || "[]");
      setSavedIds(saved);
    } catch (e) {
      console.error(e);
    }

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const json = await res.json();
          setPosts(json.posts || []);
        }
      } catch (err) {
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const savedPosts = posts.filter((p) => savedIds.includes(p.id));

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center animate-pulse">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-slate-400 text-xs tracking-wider uppercase font-bold">Assembling Bookmarks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Page Header */}
      <div className="mb-8 p-6 bg-linear-to-br from-[#121421] via-[#16192b] to-[#1e1d35] rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-3xl font-serif tracking-tight text-white font-bold leading-normal mb-1 flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-amber-400 fill-amber-400/20" /> Saved Posts
        </h1>
        <p className="text-slate-400 font-medium text-sm">
          Bookmark and store your favorite stories, ideas, and inspiration across the Kespy portal.
        </p>
      </div>

      {savedPosts.length === 0 ? (
        <div className="text-center py-20 bg-[#141725]/40 border border-slate-800 rounded-[2.5rem] p-8">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-4 animate-bounce" />
          <p className="text-slate-300 font-bold mb-1 text-sm">No saved posts yet.</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Portals and posts can be instantly saved under your private bookmarks by tapping the bookmark icon in any stream.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {savedPosts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
