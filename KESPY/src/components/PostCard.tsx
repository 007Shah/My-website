import React, { useState } from 'react';
import { Post, Comment } from '../types';
import { Heart, MessageCircle, Send, Trash2, Bookmark } from 'lucide-react';
import { timeAgo, cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post: initialPost }: { post: Post }) {
  const [post, setPost] = useState(initialPost);
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("saved_post_ids") || "[]");
      return saved.includes(initialPost.id);
    } catch {
      return false;
    }
  });
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const { user } = useAuth();

  const handleToggleSave = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("saved_post_ids") || "[]");
      let newSaved;
      if (saved.includes(post.id)) {
        newSaved = saved.filter((id: number) => id !== post.id);
        setIsSaved(false);
      } else {
        newSaved = [...saved, post.id];
        setIsSaved(true);
      }
      localStorage.setItem("saved_post_ids", JSON.stringify(newSaved));
    } catch (err) {
      console.error(err);
    }
  };

  const isPagePost = !!post.pageId;
  const authorAvatar = isPagePost ? post.pageAvatar : post.avatar;
  const authorDisplayName = isPagePost ? post.pageName : post.displayName;
  const authorLink = isPagePost ? `/page/${post.pageHandle}` : `/u/${post.username}`;

  const canDelete = !!(user && (Number(post.userId) === Number(user.id) || (post.pageId && Number(post.pageOwnerId) === Number(user.id))));

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const confirmed = window.confirm("Are you sure you want to delete this post? Once you delete it, it cannot be undone!");
    if (!confirmed) return;

    // Optimistic delete immediately
    setDeleted(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE"
      });
      if (!res.ok) {
        // Revert optimistic delete if it fails on server
        setDeleted(false);
        const errData = await res.json();
        alert(errData.error || "Failed to delete post");
      }
    } catch (err) {
      console.error(err);
      setDeleted(false);
      alert("Error deleting post");
    }
  };

  if (deleted) return null;

  const handleLike = async () => {
    if (isLiking || !user) return;
    setIsLiking(true);
    
    // Optimistic update
    const wasLiked = post.isLikedByMe;
    setPost(prev => ({
      ...prev,
      isLikedByMe: !wasLiked,
      likesCount: prev.likesCount + (wasLiked ? -1 : 1)
    }));

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
      if (!res.ok) throw new Error();
    } catch (err) {
      // Revert optimistic update on fail
      setPost(prev => ({
        ...prev,
        isLikedByMe: wasLiked,
        likesCount: prev.likesCount + (wasLiked ? 1 : -1)
      }));
    } finally {
      setIsLiking(false);
    }
  };

  const toggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/posts/${post.id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments);
        }
      } catch (err) {
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      });
      if (res.ok) {
        const data = await res.json();
        setComments([...comments, data.comment]);
        setNewComment('');
        setPost(prev => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
      }
    } catch (err) {}
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col shadow-sm mb-6"
    >
      {post.image ? (
        <div className="h-48 md:h-64 bg-gray-200 relative">
          <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          {canDelete && (
            <button 
              onClick={handleDelete}
              className="absolute top-4 right-4 z-10 bg-black/40 hover:bg-[#ef4444] text-white p-2.5 rounded-full transition-colors border border-white/10 shadow-lg"
              title="Delete Post"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="absolute bottom-4 left-6 flex items-center space-x-3">
            <Link to={authorLink} className="w-8 h-8 rounded-full border-2 border-white bg-slate-400 overflow-hidden shrink-0">
               {authorAvatar ? (
                 <img src={authorAvatar} alt={authorDisplayName} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white font-bold uppercase text-xs">
                   {authorDisplayName ? authorDisplayName.charAt(0) : "P"}
                 </div>
               )}
            </Link>
            <span className="text-white text-xs font-bold flex items-center gap-1">
              <Link to={authorLink} className="hover:underline">{authorDisplayName}</Link> 
              <span className="opacity-75">• {timeAgo(post.createdAt)}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <Link to={authorLink} className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-gray-100 group-hover:border-indigo-200 transition-colors">
              {authorAvatar ? (
                <img src={authorAvatar} alt={authorDisplayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-550 font-bold uppercase text-xs">
                  {authorDisplayName ? authorDisplayName.charAt(0) : "P"}
                </div>
              )}
            </div>
            <div>
              <span className="text-slate-900 text-sm font-extrabold group-hover:text-indigo-600 transition-colors">{authorDisplayName}</span>
              <span className="text-slate-600 text-xs ml-2 font-medium">• {timeAgo(post.createdAt)}</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-1">
            {canDelete && (
              <button 
                onClick={handleDelete}
                className="text-slate-600 hover:text-red-600 p-2 rounded-full transition-colors"
                title="Delete Post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className={cn("flex-1", post.image ? "p-8 pt-6" : "px-8 pb-6")}>
        <p className="font-sans text-xl md:text-[23px] font-semibold leading-relaxed tracking-tight text-slate-900 whitespace-pre-wrap">
          {post.content}
        </p>
      </div>

      <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleLike}
            className="flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-extrabold text-xs group transition-all"
          >
             <Heart className={cn("w-5 h-5 transition-transform group-hover:scale-110", post.isLikedByMe ? "fill-rose-600 stroke-rose-600" : "stroke-rose-600 fill-transparent")} />
            <span>{post.likesCount}</span>
          </button>
          
          <button onClick={toggleComments} className="flex items-center space-x-2 text-slate-700 hover:text-indigo-950 font-extrabold text-xs transition-colors">
            <MessageCircle className="w-5 h-5 stroke-slate-700" />
            <span>{post.commentsCount} Comments</span>
          </button>

          <button 
            onClick={handleToggleSave} 
            className={cn(
              "flex items-center space-x-2 font-extrabold text-xs transition-all", 
              isSaved ? "text-amber-700" : "text-slate-700 hover:text-amber-700"
            )}
          >
            <Bookmark className={cn("w-5 h-5", isSaved ? "fill-amber-600 stroke-amber-600" : "stroke-slate-700 fill-transparent")} />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>
        </div>
        
        <Link 
          to={authorLink} 
          className="text-indigo-600 hover:text-indigo-800 font-extrabold text-[11px] hover:underline underline-offset-4 tracking-wider uppercase"
        >
          View {isPagePost ? "Page" : "Portal"}
        </Link>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-2 border-t border-slate-100">
              <form onSubmit={submitComment} className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden shrink-0 flex items-center justify-center">
                   {user?.avatar ? (
                     <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                   ) : (
                     <span className="text-indigo-600 font-semibold text-xs uppercase">{user?.displayName?.charAt(0) || 'U'}</span>
                   )}
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-500 hover:text-indigo-600 disabled:opacity-50 p-1"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="space-y-4">
                {loadingComments ? (
                  <div className="text-center py-4 text-slate-400 text-sm">Loading comments...</div>
                ) : comments.length > 0 ? (
                  comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <Link to={`/u/${comment.username}`} className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        {comment.avatar ? (
                          <img src={comment.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500 font-semibold text-xs uppercase">
                            {comment.displayName.charAt(0)}
                          </div>
                        )}
                      </Link>
                      <div className="flex-1">
                        <div className="bg-slate-50 inline-block px-4 py-2.5 rounded-2xl rounded-tl-sm border border-slate-100 max-w-full">
                          <Link to={`/u/${comment.username}`} className="font-semibold text-[13px] text-slate-800 hover:text-indigo-600 transition-colors block mb-0.5">
                            {comment.displayName}
                          </Link>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 ml-2 font-medium">
                          {timeAgo(comment.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-400 text-sm">No comments yet.</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
