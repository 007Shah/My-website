import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Page, Post } from "../types";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { Globe, Users, Shield, ArrowLeft, Image, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SinglePage() {
  const { handle } = useParams<{ handle: string }>();
  const { user: currentUser } = useAuth();

  const [page, setPage] = useState<Page | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Post composer state
  const [postContent, setPostContent] = useState("");
  const [postImage, setPostImage] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const fetchPageDetails = async () => {
    try {
      setLoading(true);
      const [pageRes, postsRes] = await Promise.all([
        fetch(`/api/pages/${encodeURIComponent(handle || "")}`),
        fetch(`/api/posts`), // We'll filter posts that belong to this pageId
      ]);

      if (pageRes.ok) {
        const pageData = await pageRes.json();
        setPage(pageData.page);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          // Filter feed posts that match this page's ID
          const filtered = postsData.posts.filter((p: Post) => p.pageId === pageData.page.id);
          setPosts(filtered);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageDetails();
  }, [handle]);

  const handleFollow = async () => {
    if (!page) return;
    try {
      const res = await fetch(`/api/pages/${page.id}/follow`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setPage((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: data.following,
                followersCount: (prev.followersCount || 0) + (data.following ? 1 : -1),
              }
            : null,
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!page || (!postContent.trim() && !postImage.trim())) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/pages/${page.id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: postContent, image: postImage }),
      });

      if (res.ok) {
        const data = await res.json();
        // Dynamically insert post to the list so "whole page shouldn't load"
        setPosts((prev) => [data.post, ...prev]);
        setPostContent("");
        setPostImage("");
        setShowImageInput(false);
      }
    } catch (err) {
      console.error("Create page post err:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <div className="w-8 h-8 border-4 border-indigo-550/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-slate-400 text-xs tracking-wider uppercase font-bold">Retrieving portal archives...</p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center text-slate-405">
        <h2 className="text-xl font-serif text-white mb-2">Portal Index Missing</h2>
        <p className="text-sm text-slate-400 mb-6">This page handle can't be traced on Kespy.</p>
        <Link to="/pages" className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-full">
          Back to Pages Directory
        </Link>
      </div>
    );
  }

  const isOwner = currentUser?.id === page.ownerId;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Back button */}
      <div className="mb-4">
        <Link to="/pages" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Pages Directory
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-[#141725]/40 border border-slate-800 rounded-[2.5rem] overflow-hidden mb-8 shadow-xl shadow-black/20">
        {/* Banner */}
        <div className="h-48 md:h-60 bg-slate-800 relative">
          {page.coverImage ? (
            <img src={page.coverImage} className="w-full h-full object-cover animate-fade-in" alt="Cover banner" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-pink-950/20 via-slate-900 to-indigo-950/40" />
          )}
          {isOwner && (
            <span className="absolute top-4 right-4 flex items-center gap-1.5 px-4 py-1.5 bg-indigo-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-400 shadow-xl z-10">
              <Shield className="w-3.5 h-3.5" />
              Creator
            </span>
          )}
        </div>

        {/* Brand Information */}
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex justify-between items-end -mt-10 md:-mt-12 mb-6">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[#141725] border-4 border-slate-900 overflow-hidden shadow-xl shrink-0">
              {page.avatar ? (
                <img src={page.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-[#1b1d2e] to-indigo-905 flex items-center justify-center text-slate-400 text-3xl font-bold font-serif uppercase">
                  {page.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="pb-2">
              {isOwner ? (
                <span className="bg-slate-850 border border-slate-800 text-[10px] tracking-wider uppercase font-extrabold text-slate-400 px-5 py-2.5 rounded-full shadow-sm select-auto block">
                  Publish Privileging Activated
                </span>
              ) : (
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer ${
                    page.isFollowing
                      ? "bg-transparent border border-pink-500/20 text-pink-400 hover:bg-pink-500/5"
                      : "bg-[#fc4e98] text-white hover:bg-[#ff5ca6]"
                  }`}
                >
                  {page.isFollowing ? "Subscribed" : "Subscribe"}
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-serif tracking-tight text-white font-black leading-none">
                {page.name}
              </h1>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black uppercase tracking-wider rounded-full">
                {page.category}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-2 uppercase font-black tracking-widest pl-0.5">
              @{page.handle}
            </p>
          </div>

          {page.description && (
            <p className="mt-6 text-slate-350 text-[15px] leading-relaxed max-w-2xl font-serif italic bg-slate-900/30 p-6 rounded-2xl border border-slate-800/40">
              "{page.description}"
            </p>
          )}

          <div className="flex items-center gap-2 mt-6 pl-0.5 text-slate-400">
            <Users className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-300">{page.followersCount || 0} Port Subscribers</span>
          </div>
        </div>
      </div>

      {/* Dynamic page poster composer block - only if Owner */}
      {isOwner && (
        <div className="bg-[#141725]/40 border border-slate-800 rounded-[2.5rem] p-6 mb-8 shadow-lg">
          <h3 className="text-slate-300 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-1.5 pl-1">
            <Shield className="w-3.5 h-3.5 text-indigo-400" /> Compose update as {page.name}
          </h3>
          <form onSubmit={handlePublishPost} className="space-y-4">
            <textarea
              required
              placeholder="What creative bulletin do you wish to broadcast?"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 resize-none font-medium transition-all"
            />

            {showImageInput && (
              <input
                type="url"
                placeholder="Attach cover image URL (optional)"
                value={postImage}
                onChange={(e) => setPostImage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-medium transition-all"
              />
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className={`text-slate-400 hover:text-indigo-400 text-xs font-bold uppercase transition-colors flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-850 bg-slate-900/40 cursor-pointer ${
                  showImageInput ? "text-indigo-400 border-indigo-500/20" : ""
                }`}
              >
                <Image className="w-4 h-4" />
                {showImageInput ? "Remove Photo" : "Add Photo"}
              </button>

              <button
                type="submit"
                disabled={submitting || (!postContent.trim() && !postImage.trim())}
                className="flex items-center justify-center gap-1.5 px-6 py-3 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-650 hover:to-pink-650 text-white uppercase text-[10px] tracking-widest font-black rounded-full cursor-pointer transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Broadcast <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pages posts listing */}
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 pl-1 mb-4 flex items-center gap-1">
          <span>Page Publications</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
        </h2>

        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-16 bg-[#141725]/20 border border-slate-850 rounded-[2.5rem] text-slate-500">
            <p className="font-semibold text-sm">This portal index is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
