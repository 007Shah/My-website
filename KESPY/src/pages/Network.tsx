import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Post } from "../types";
import { Users, MessageCircle, AtSign, ArrowUpRight, Heart, MessageSquare, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";
import { formatDistanceToNow } from "date-fns";

interface NetworkData {
  friends: User[];
  followers: User[];
  following: User[];
  comments: any[];
  mentions: {
    posts: Post[];
    comments: any[];
  };
}

export default function Network() {
  const { user: currentUser } = useAuth();
  const [data, setData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"friends" | "comments" | "mentions">("friends");

  const queryTab = new URLSearchParams(window.location.search).get("tab") as "friends" | "comments" | "mentions" | null;

  useEffect(() => {
    if (queryTab && ["friends", "comments", "mentions"].includes(queryTab)) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const fetchNetwork = async () => {
    try {
      const res = await fetch("/api/users/me/network");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Error fetching network details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetwork();
  }, []);

  const handleLikeComment = async (commentId: number) => {
    try {
      const res = await fetch(`/api/posts/comments/${commentId}/like`, { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        if (data) {
          const updatedComments = data.comments.map((c: any) => {
            if (c.id === commentId) {
              const updatedIsLikedByMe = json.liked ? 1 : 0;
              const diff = json.liked ? 1 : -1;
              return {
                ...c,
                isLikedByMe: updatedIsLikedByMe,
                likesCount: Math.max(0, (c.likesCount || 0) + diff),
              };
            }
            return c;
          });
          setData({ ...data, comments: updatedComments });
        }
      }
    } catch (err) {
      console.error("Error toggling like on comment:", err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-slate-400 text-xs tracking-wider uppercase font-bold">Synchronizing Network Operations...</p>
      </div>
    );
  }

  const friends = data?.friends || [];
  const followers = data?.followers || [];
  const following = data?.following || [];
  const comments = data?.comments || [];
  const mentionPosts = data?.mentions?.posts || [];
  const mentionComments = data?.mentions?.comments || [];
  const totalMentions = mentionPosts.length + mentionComments.length;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 p-6 bg-gradient-to-br from-[#121421] via-[#16192b] to-[#1d1f38] rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2"></div>
        <h1 className="text-3xl font-serif tracking-tight text-white font-bold leading-normal mb-1">
          My Network
        </h1>
        <p className="text-slate-400 font-medium text-sm">
          Keep track of connections, comments you made, and mentions of you across Kespy.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mb-8 gap-6 px-1">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer focus:outline-none ${
            activeTab === "friends" ? "text-indigo-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4" />
          Friends & Connections
          <span className="px-2 py-0.5 rounded-full bg-indigo-600/25 text-[10px] text-indigo-300 font-black ml-1">
            {friends.length}
          </span>
          {activeTab === "friends" && (
            <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer focus:outline-none ${
            activeTab === "comments" ? "text-pink-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          My Comments
          <span className="px-2 py-0.5 rounded-full bg-pink-600/25 text-[10px] text-pink-300 font-black ml-1">
            {comments.length}
          </span>
          {activeTab === "comments" && (
            <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("mentions")}
          className={`flex items-center gap-2 pb-4 text-xs font-bold uppercase tracking-wider transition-all relative cursor-pointer focus:outline-none ${
            activeTab === "mentions" ? "text-purple-400" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <AtSign className="w-4 h-4" />
          Mentions of Me
          <span className="px-2 py-0.5 rounded-full bg-purple-600/25 text-[10px] text-purple-300 font-black ml-1">
            {totalMentions}
          </span>
          {activeTab === "mentions" && (
            <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
          )}
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="min-h-[250px]">
        {activeTab === "friends" && (
          <div className="space-y-6 animate-fade-in">
            {/* Friends Group */}
            <div className="bg-[#141725]/40 border border-slate-800 rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> My Friends ({friends.length})</span>
                <span className="text-[9px] text-indigo-400 capitalize tracking-normal font-medium">Mutual Follows</span>
              </h3>
              {friends.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/10 rounded-2xl border border-dashed border-slate-800">
                  <p className="text-sm text-slate-500 italic py-2">No mutual friends yet.</p>
                  <p className="text-xs text-slate-600">Follow users who follow you to establish a friendly connection!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {friends.map((f) => (
                    <Link
                      key={f.id}
                      to={`/u/${encodeURIComponent(f.username)}`}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#1b1d2e]/45 hover:bg-[#1b1d2e]/90 border border-slate-800/60 hover:border-indigo-500/40 transition-all hover:scale-[1.02]"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-indigo-500/30 bg-slate-800">
                        {f.avatar ? (
                          <img src={f.avatar} alt={f.displayName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">
                            {f.displayName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-slate-100 truncate">{f.displayName}</p>
                          <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 text-[8px] font-black rounded uppercase">Friend</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">@{f.username}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-500 ml-auto shrink-0 animate-pulse" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Followers Group */}
            <div className="bg-[#141725]/20 border border-slate-850 rounded-[2rem] p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center justify-between">
                <span>Followers ({followers.length})</span>
                <span className="text-[9px] text-slate-550 capitalize tracking-normal font-medium">Users following you</span>
              </h3>
              {followers.length === 0 ? (
                <p className="text-sm text-slate-600 italic py-2">No followers yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {followers.map((f) => (
                    <Link
                      key={f.id}
                      to={`/u/${encodeURIComponent(f.username)}`}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#1b1d2e]/20 hover:bg-[#1b1d2e]/40 border border-slate-800/30 hover:border-slate-800 transition-all"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800">
                        {f.avatar ? (
                          <img src={f.avatar} alt={f.displayName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">
                            {f.displayName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-300 truncate">{f.displayName}</p>
                        <p className="text-xs text-slate-450">@{f.username}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-600 ml-auto shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Following Group */}
            <div className="bg-[#141725]/20 border border-slate-850 rounded-[2rem] p-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center justify-between">
                <span>Following ({following.length})</span>
                <span className="text-[9px] text-slate-550 capitalize tracking-normal font-medium">Users you follow</span>
              </h3>
              {following.length === 0 ? (
                <p className="text-sm text-slate-600 italic py-2">You aren't following anyone yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {following.map((f) => (
                    <Link
                      key={f.id}
                      to={`/u/${encodeURIComponent(f.username)}`}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-[#1b1d2e]/20 hover:bg-[#1b1d2e]/40 border border-slate-800/30 hover:border-slate-800 transition-all"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-slate-700 bg-slate-800">
                        {f.avatar ? (
                          <img src={f.avatar} alt={f.displayName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">
                            {f.displayName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-300 truncate">{f.displayName}</p>
                        <p className="text-xs text-slate-450">@{f.username}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-600 ml-auto shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-4 animate-fade-in">
            {comments.length === 0 ? (
              <div className="text-center py-16 bg-[#141725]/40 border border-slate-800 rounded-[2rem]">
                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-450">You haven't written any comments yet.</p>
              </div>
            ) : (
              comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="p-6 rounded-[2rem] bg-[#141725]/30 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-indigo-500/20 bg-slate-800 shrink-0">
                        {currentUser?.avatar ? (
                          <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-xs">
                            {currentUser?.displayName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-indigo-300 font-bold">You commented:</p>
                        <p className="text-sm text-slate-100 font-medium mt-1 pr-4 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                        <span className="text-[10px] text-slate-500 block mt-1">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Like Comment CTA */}
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        comment.isLikedByMe
                          ? "bg-pink-500/15 text-pink-400 border border-pink-500/30"
                          : "bg-slate-800/50 text-slate-450 hover:text-slate-200 border border-transparent hover:bg-slate-800"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${comment.isLikedByMe ? "fill-current" : ""}`} />
                      <span>{comment.likesCount || 0}</span>
                    </button>
                  </div>

                  {/* Refenced Post Info */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                        {comment.postAuthorAvatar ? (
                          <img src={comment.postAuthorAvatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-[10px]">
                            {comment.postAuthorDisplayName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">
                          On post by <span className="text-slate-300 font-bold">@{comment.postAuthorUsername}</span>:
                        </p>
                        <p className="text-xs text-slate-200 truncate max-w-sm font-medium mt-0.5">
                          "{comment.postContent}"
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/u/${encodeURIComponent(comment.postAuthorUsername)}`}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 uppercase tracking-widest font-black flex items-center gap-1 self-end sm:self-center shrink-0 border border-indigo-500/20 px-3 py-1.5 rounded-xl hover:bg-indigo-500/10"
                    >
                      View Post <ArrowUpRight className="w-3" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "mentions" && (
          <div className="space-y-6 animate-fade-in">
            {/* Tagged in Posts */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                Mentioned in Posts ({mentionPosts.length})
              </h3>
              {mentionPosts.length === 0 ? (
                <div className="p-4 rounded-2xl border border-slate-850 text-slate-500 italic text-xs">
                  You haven't been tagged in any posts yet.
                </div>
              ) : (
                mentionPosts.map((post) => (
                  <div key={post.id} className="p-5 rounded-[2rem] bg-[#141725]/30 border border-slate-850">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800">
                        {post.avatar ? (
                          <img src={post.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-xs">
                            {post.displayName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200">
                          {post.displayName} <span className="font-normal text-slate-400">@{post.username}</span>
                        </p>
                      </div>
                      <Link
                        to={`/u/${encodeURIComponent(post.username)}`}
                        className="text-[10px] text-indigo-400 ml-auto flex items-center gap-1 uppercase tracking-widest font-black"
                      >
                        View Profile <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-sm text-slate-200 bg-slate-900/50 p-4 rounded-xl border border-slate-800/40 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Tagged in Comments */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">
                Mentioned in Comments ({mentionComments.length})
              </h3>
              {mentionComments.length === 0 ? (
                <div className="p-4 rounded-2xl border border-slate-850 text-slate-500 italic text-xs">
                  You haven't been tagged in any comments yet.
                </div>
              ) : (
                mentionComments.map((comment: any) => (
                  <div key={comment.id} className="p-5 rounded-[2rem] bg-[#141725]/30 border border-slate-850 flex gap-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
                      {comment.commentAuthorAvatar ? (
                        <img src={comment.commentAuthorAvatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-300 text-xs">
                          {comment.commentAuthorDisplayName?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-slate-200">
                          {comment.commentAuthorDisplayName} <span className="font-normal text-slate-400">@{comment.commentAuthorUsername}</span>
                        </p>
                        <span className="text-[9px] text-slate-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200 italic mb-2 bg-slate-900/30 p-2.5 rounded-lg">
                        "{comment.content}"
                      </p>
                      <p className="text-[10px] text-slate-500">
                        In response to post: <span className="font-medium text-slate-400">"{comment.postContent}"</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
