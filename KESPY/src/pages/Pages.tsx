import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Page } from "../types";
import { Folder, Plus, Globe, Check, Shield, User, Camera, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Pages() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "managed">("all");

  // Form states
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const categories = [
    "Technology",
    "Design & Art",
    "Business",
    "Lifestyle",
    "Writing & Poetry",
    "Entertainment",
    "Other",
  ];

  const fetchPages = async () => {
    setLoading(true);
    try {
      const url = filter === "managed" ? "/api/pages?managed=true" : "/api/pages";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [filter]);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, handle, category, description, avatar, coverImage }),
      });

      if (res.ok) {
        const data = await res.json();
        setShowCreateModal(false);
        // Reset form
        setName("");
        setHandle("");
        setCategory("Technology");
        setDescription("");
        setAvatar("");
        setCoverImage("");
        // Navigate
        navigate(`/page/${data.page.handle}`);
      } else {
        const errJson = await res.json();
        setError(errJson.error || "Failed to create page");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setCreating(false);
    }
  };

  const handleFollowPage = async (pageId: number) => {
    try {
      const res = await fetch(`/api/pages/${pageId}/follow`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setPages((prev) =>
          prev.map((p) => {
            if (p.id === pageId) {
              return {
                ...p,
                isFollowing: data.following,
                followersCount: (p.followersCount || 0) + (data.following ? 1 : -1),
              };
            }
            return p;
          }),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Banner */}
      <div className="mb-8 p-8 bg-gradient-to-r from-[#17192a] via-[#141725] to-indigo-950/40 rounded-[2.5rem] border border-slate-850 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500 rounded-full blur-[100px] opacity-10 -translate-y-1/2 translate-x-1/2"></div>
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-indigo-400">
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest text-[11px]">Pages Network</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-white leading-normal">
            Custom Pages
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Deploy self-contained portals, write archives, or construct communities under a unique corporate or creative index.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="shrink-0 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Deploy New Page
        </button>
      </div>

      {/* Tabs / Filters */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-2">
        <div className="flex gap-6">
          <button
            onClick={() => setFilter("all")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer focus:outline-none ${
              filter === "all" ? "text-indigo-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Kespy Pages
            {filter === "all" && (
              <motion.div layoutId="pagesTabLine" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
          <button
            onClick={() => setFilter("managed")}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative cursor-pointer focus:outline-none ${
              filter === "managed" ? "text-[#fc4e98]" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            My Managed Pages
            {filter === "managed" && (
              <motion.div layoutId="pagesTabLine" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#fc4e98]" />
            )}
          </button>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
          Showing {pages.length} Pages
        </span>
      </div>

      {/* Pages Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : pages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pages.map((p) => {
            const isOwner = currentUser?.id === p.ownerId;
            return (
              <div
                key={p.id}
                className="bg-[#141725]/40 border border-slate-800 rounded-[2rem] overflow-hidden flex flex-col justify-between hover:border-slate-750 transition-all group shadow-md hover:shadow-xl shadow-black/20"
              >
                {/* Background Banner */}
                <div className="h-28 bg-slate-800 relative">
                  {p.coverImage ? (
                    <img src={p.coverImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#212338] to-[#121626]" />
                  )}
                  {isOwner && (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 bg-indigo-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-indigo-400 shadow-sm z-10">
                      <Shield className="w-3 h-3" />
                      Owner
                    </span>
                  )}
                </div>

                {/* Profile Information */}
                <div className="p-6 pt-0 relative flex-1 flex flex-col justify-between">
                  {/* Photo spacer */}
                  <div className="flex justify-between items-end mb-4 -mt-10">
                    <div className="w-16 h-16 rounded-2xl bg-[#141725] border-4 border-slate-900 overflow-hidden shadow-md shrink-0">
                      {p.avatar ? (
                        <img src={p.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-indigo-900 flex items-center justify-center font-bold text-slate-400">
                          {p.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase bg-slate-850 px-3 py-1.5 rounded-full border border-slate-800">
                      {p.category}
                    </span>
                  </div>

                  {/* Text details */}
                  <div className="mb-4 flex-1">
                    <Link to={`/page/${p.handle}`} className="block">
                      <h3 className="text-lg font-bold text-slate-100 hover:text-indigo-400 transition-colors truncate">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
                      @{p.handle}
                    </p>
                    <p className="text-slate-350 text-sm line-clamp-2 h-10 leading-snug">
                      {p.description || "A custom page constructed on Kespy."}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/40 mt-2">
                    <span className="text-[11px] text-slate-450 font-black uppercase tracking-wider">
                      {p.followersCount || 0} Followers
                    </span>
                    <div className="flex gap-2">
                      <Link
                        to={`/page/${p.handle}`}
                        className="bg-slate-850 hover:bg-slate-800 text-[10px] tracking-wider uppercase font-bold text-slate-300 px-4 py-2.5 rounded-full border border-slate-800 cursor-pointer"
                      >
                        Enter
                      </Link>
                      {!isOwner && (
                        <button
                          onClick={() => handleFollowPage(p.id)}
                          className={`text-[10px] tracking-wider uppercase font-bold px-4 py-2.5 rounded-full border transition-all cursor-pointer ${
                            p.isFollowing
                              ? "bg-transparent text-pink-400 border-pink-500/20 hover:bg-pink-500/10"
                              : "bg-[#181a29] text-slate-200 border-slate-850 hover:bg-black"
                          }`}
                        >
                          {p.isFollowing ? "Subscribed" : "Subscribe"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#141725]/40 border border-slate-800 rounded-[2.5rem] text-slate-500">
          <Folder className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="font-semibold text-sm">No custom pages deployed in this segment.</p>
        </div>
      )}

      {/* Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141725] border border-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-xl relative z-10 max-h-[90vh] overflow-y-auto text-slate-100"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#141725]/90 backdrop-blur-md z-20">
                <div>
                  <h3 className="font-bold text-lg text-white">
                    Deploy Custom Page Portal
                  </h3>
                  <p className="text-xs text-slate-500">Create an independent visual brand</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 bg-slate-850 hover:bg-slate-800 rounded-full text-slate-400 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleCreatePage} className="p-6 space-y-5">
                {error && (
                  <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-bold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">
                      Portal Page Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Creative Collective"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 font-medium text-slate-200 text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">
                      Unique Page Handle
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-black">@</span>
                      <input
                        type="text"
                        required
                        placeholder="creativecollect"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-8 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 font-medium text-slate-200 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">
                    Index Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 text-slate-250 text-sm font-medium transition-all"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-slate-200">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">
                    Cover Banner Link (Optional URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 font-medium text-slate-200 text-sm transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">
                    Avatar Icon Link (Optional URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 font-medium text-slate-200 text-sm transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest pl-1">
                    Page Core Mandate / Biography
                  </label>
                  <textarea
                    placeholder="Describe what kind of creative materials or professional updates this portal catalogs."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 text-slate-200 text-sm resize-none font-medium transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3.5 bg-slate-850 hover:bg-slate-800 text-slate-300 font-bold uppercase tracking-wider text-xs rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold uppercase tracking-wider text-xs rounded-full shadow-md transition-all cursor-pointer min-w-[140px] flex items-center justify-center"
                  >
                    {creating ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Launch"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
