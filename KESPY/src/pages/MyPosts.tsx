import React, { useState, useEffect, useRef } from "react";
import { Post } from "../types";
import PostCard from "../components/PostCard";
import { ImagePlus, Sparkles, X, Camera, Inbox } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import CameraCapture from "../components/CameraCapture";

export default function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMyPosts = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/posts/user/${encodeURIComponent(user.username)}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imagePreview) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, image: imagePreview }),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts([data.post, ...posts]);
        setContent("");
        clearImage();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Page Header */}
      <div className="mb-6 p-6 bg-gradient-to-br from-[#121421] via-[#16192b] to-[#1e1d35] rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-3xl font-serif tracking-tight text-white font-bold mb-1">
          My Posts
        </h1>
        <p className="text-slate-400 font-medium text-sm">
          A dedicated stream harboring only your expressions, stories and captures.
        </p>
      </div>

      {/* Compose Form */}
      <div className="bg-slate-900/40 rounded-[2.5rem] p-5 border border-slate-800 mb-8 shadow-sm">
        <form onSubmit={handlePost} className="flex flex-col space-y-3">
          <div className="flex items-start space-x-4 px-2">
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-indigo-500/30 bg-slate-800">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <span className="text-indigo-400 font-bold text-sm uppercase flex items-center justify-center w-full h-full">
                  {user?.displayName?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record a thought in your portal..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-slate-100 placeholder:text-slate-500 text-[15px] font-medium min-h-[65px] resize-none pt-3 focus:outline-none"
            />
          </div>

          <AnimatePresence>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative rounded-2xl overflow-hidden border border-slate-800 ml-16 mr-2 mt-2"
              >
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-[300px] object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 mt-2 px-2">
            <div className="flex items-center gap-1">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 text-indigo-400 hover:bg-indigo-500/10 rounded-full transition-colors group relative cursor-pointer"
                title="Add Image"
              >
                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="p-2.5 text-indigo-400 hover:bg-indigo-500/10 rounded-full transition-colors group relative cursor-pointer"
                title="Use Camera"
              >
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <button
              type="submit"
              disabled={(!content.trim() && !imagePreview) || isSubmitting}
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center min-w-[120px] cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Publish"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Feed */}
      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-20 bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-8">
            <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-sm mb-1">No posts here yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Anything you publish from your composer will immediately build under this portal's timeline.
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCamera && (
          <CameraCapture 
            onCapture={(dataUrl) => {
              setImagePreview(dataUrl);
              setShowCamera(false);
            }} 
            onClose={() => setShowCamera(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
