import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserCircle, Bell, Search, Menu, Camera, Check, X, Heart, MessageSquare, AtSign, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CameraCapture from "./CameraCapture";

interface DbNotification {
  id: number;
  receiverId: number;
  senderId: number;
  type: 'like' | 'comment' | 'friend_request' | 'mention';
  postId: number | null;
  read: number;
  createdAt: string;
  senderUsername: string;
  senderDisplayName: string;
  senderAvatar: string | null;
  postContent: string | null;
}

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showCamera, setShowCamera] = useState(false);
  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ users: any[], pages: any[], posts: any[] }>({ users: [], pages: [], posts: [] });
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ users: [], pages: [], posts: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/users/search/all?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowSearchResults(true);
        }
      } catch (err) {
        console.error("Search query failed:", err);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/users/me/notifications");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Fetch notifications failed:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for real-time notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async () => {
    if (!user) return;
    try {
      await fetch("/api/users/me/notifications/read", { method: "POST" });
      // Update local state to show read
      setNotifications(prev => prev.map(n => ({ ...n, read: 1 })));
    } catch (err) {
      console.error("Mark read failed:", err);
    }
  };

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      handleMarkAsRead();
    }
  };

  const handleNotificationAction = async (type: 'accept' | 'decline', requestId: number, notificationId: number) => {
    try {
      // Find the request first or use the requestId
      const reqRes = await fetch("/api/users/me/friend-requests");
      if (!reqRes.ok) return;
      const reqData = await reqRes.json();
      const matching = reqData.requests.find((r: any) => r.senderId === requestId || r.id === requestId);
      
      if (matching) {
        const res = await fetch(`/api/users/friend-requests/${matching.id}/${type}`, {
          method: "POST",
        });
        if (res.ok) {
          // Remove notification locally
          setNotifications(prev => prev.filter(n => n.id !== notificationId));
        }
      } else {
        // If request ID is direct
        const res = await fetch(`/api/users/friend-requests/${requestId}/${type}`, {
          method: "POST",
        });
        if (res.ok) {
          setNotifications(prev => prev.filter(n => n.id !== notificationId));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCapture = async (dataUrl: string) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: "Lens Capture 📸", image: dataUrl }),
      });
      if (res.ok) {
        navigate("/posts");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => n.read === 0).length;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100/80 items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#C084FC] to-[#F43F5E] flex items-center justify-center shadow-lg shadow-[#F43F5E]/20 ring-2 ring-white transition-all duration-300 group-hover:rotate-12 group-hover:scale-105">
              <span className="font-serif font-black text-white text-base tracking-normal">K</span>
            </div>
            <span className="text-2.5xl font-serif italic font-black tracking-tighter bg-gradient-to-r from-[#1E1B4B] via-[#7C3AED] to-[#F43F5E] bg-clip-text text-transparent transition-all duration-300 group-hover:opacity-90">
              Kespy
            </span>
          </Link>
        </div>

        <div className="flex-1 max-w-sm mx-4 hidden sm:block relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search people, pages, perspectives..."
              className="w-full bg-slate-50 border-none rounded-full py-2.5 pl-11 pr-4 text-xs focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 text-slate-700"
            />
          </div>

          <AnimatePresence>
            {showSearchResults && searchQuery.trim().length > 0 && (
              <>
                <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowSearchResults(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100/80 p-4 z-50 max-h-[440px] overflow-y-auto space-y-4"
                >
                  {searching ? (
                    <div className="text-center py-4 text-slate-400 text-[10px] uppercase font-bold tracking-wider animate-pulse">
                      Kespy scanning registry...
                    </div>
                  ) : (
                    <>
                      {/* Section 1: Users */}
                      {searchResults.users && searchResults.users.length > 0 && (
                        <div>
                          <h4 className="text-[9px] font-extrabold uppercase text-indigo-600 tracking-wider mb-2 px-1">People</h4>
                          <div className="space-y-1">
                            {searchResults.users.map((item: any) => (
                              <Link
                                key={item.id}
                                to={`/u/${encodeURIComponent(item.username)}`}
                                onClick={() => {
                                  setShowSearchResults(false);
                                  setSearchQuery("");
                                }}
                                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-indigo-50/50 transition-colors"
                              >
                                <img src={item.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-100" />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{item.displayName}</p>
                                  <p className="text-[9px] text-slate-400">@{item.username}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section 2: Pages */}
                      {searchResults.pages && searchResults.pages.length > 0 && (
                        <div>
                          <h4 className="text-[9px] font-extrabold uppercase text-amber-600 tracking-wider mb-2 px-1">Community Pages</h4>
                          <div className="space-y-1">
                            {searchResults.pages.map((item: any) => (
                              <Link
                                key={item.id}
                                to={`/page/${item.handle}`}
                                onClick={() => {
                                  setShowSearchResults(false);
                                  setSearchQuery("");
                                }}
                                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/50 transition-colors"
                              >
                                <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-50 border border-slate-105 flex items-center justify-center">
                                  {item.avatar ? (
                                    <img src={item.avatar} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[9px] font-black text-amber-600 font-mono uppercase">{item.name?.charAt(0)}</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                                  <p className="text-[9px] text-slate-400">@{item.handle} • {item.category}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Section 3: Posts */}
                      {searchResults.posts && searchResults.posts.length > 0 && (
                        <div>
                          <h4 className="text-[9px] font-extrabold uppercase text-emerald-600 tracking-wider mb-2 px-1">Perspectives & Posts</h4>
                          <div className="space-y-1.5">
                            {searchResults.posts.map((item: any) => (
                              <Link
                                key={item.id}
                                to="/"
                                onClick={() => {
                                  setShowSearchResults(false);
                                  setSearchQuery("");
                                }}
                                className="block p-2 rounded-xl hover:bg-emerald-50/50 transition-colors"
                              >
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <img src={item.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"} alt="" className="w-4.5 h-4.5 rounded-full object-cover" />
                                  <span className="text-[10px] font-black text-slate-700">{item.displayName}</span>
                                </div>
                                <p className="text-xs text-slate-650 line-clamp-2 leading-relaxed pl-3 border-l-2 border-indigo-100">
                                  {item.content}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No entries fallback */}
                      {(!searchResults.users || searchResults.users.length === 0) &&
                       (!searchResults.pages || searchResults.pages.length === 0) &&
                       (!searchResults.posts || searchResults.posts.length === 0) && (
                        <div className="text-center py-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          No Kespy matches discovered
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          {/* Bell Button & Unified Notifications Panel */}
          <div className="relative">
            <button 
              onClick={handleBellClick}
              className={`p-2 rounded-full relative transition-all cursor-pointer ${
                showNotifications 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              }`}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-indigo-600 rounded-full border-2 border-white text-[8px] text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  {/* Click outside backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowNotifications(false)} 
                  />
                  {/* Notifications Overlay Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-xl border border-slate-100 p-4 z-50 text-slate-800"
                  >
                    <div className="flex items-center justify-between border-b pb-3 mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Notifications ({notifications.length})
                      </h4>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-1 hover:bg-slate-150 rounded-full text-slate-400 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-10">
                          <p className="text-slate-400 text-xs font-semibold">No recent activity.</p>
                          <p className="text-[10px] text-slate-400 mt-1">When others interact with you, updates will show here.</p>
                        </div>
                      ) : (
                        notifications.map((n) => {
                          const isUnread = n.read === 0;
                          return (
                            <div 
                              key={n.id} 
                              className={`flex gap-3 p-3 rounded-2xl border transition-all ${
                                isUnread 
                                  ? "bg-indigo-50/40 border-indigo-100/50" 
                                  : "bg-slate-50/50 border-transparent hover:bg-slate-50"
                              }`}
                            >
                              {/* Avatar */}
                              <Link 
                                to={`/u/${encodeURIComponent(n.senderUsername)}`}
                                onClick={() => setShowNotifications(false)}
                                className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200"
                              >
                                {n.senderAvatar ? (
                                  <img src={n.senderAvatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-[10px] uppercase bg-indigo-100 text-indigo-700">
                                    {n.senderDisplayName.charAt(0)}
                                  </div>
                                )}
                              </Link>

                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-bold text-slate-900 mr-1.5 hover:text-indigo-600 transition-colors">
                                  <Link 
                                    to={`/u/${encodeURIComponent(n.senderUsername)}`}
                                    onClick={() => setShowNotifications(false)}
                                  >
                                    {n.senderDisplayName}
                                  </Link>
                                </span>

                                {/* Message depending on type */}
                                <span className="text-xs text-slate-600">
                                  {n.type === 'like' && "liked your post."}
                                  {n.type === 'comment' && "commented on your post."}
                                  {n.type === 'friend_request' && "sent you a friend request."}
                                  {n.type === 'mention' && "mentioned you in a post."}
                                </span>

                                {n.postContent && (
                                  <p className="text-[11px] text-slate-450 italic mt-1 line-clamp-2 pl-2 border-l-2 border-slate-200">
                                    "{n.postContent}"
                                  </p>
                                )}

                                <p className="text-[9px] text-slate-400 mt-1 uppercase font-semibold tracking-wider">
                                  {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>

                                {/* Conditional Accept/Decline action for friend requests */}
                                {n.type === 'friend_request' && (
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      onClick={() => handleNotificationAction('accept', n.senderId, n.id)}
                                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleNotificationAction('decline', n.senderId, n.id)}
                                      className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Simple visual indicator icon for notifications */}
                              <div className="shrink-0 pt-0.5">
                                {n.type === 'like' && <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />}
                                {n.type === 'comment' && <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />}
                                {n.type === 'friend_request' && <UserPlus className="w-3.5 h-3.5 text-emerald-500" />}
                                {n.type === 'mention' && <AtSign className="w-3.5 h-3.5 text-amber-500" />}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block"></div>

          <div className="group relative">
            <div className="flex items-center space-x-3 sm:border-l sm:pl-5 border-transparent sm:border-slate-100 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">
                  {user?.displayName}
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  @{user?.username}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-600 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-50 flex items-center justify-center">
                      <span className="text-indigo-600 font-bold uppercase text-xs">
                        {user?.displayName?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dropdown menu on hover (Hovering only shows 1 button: My Profile) */}
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 origin-top-right scale-95 group-hover:scale-100 p-1.5 z-50">
              {user && (
                <Link
                  to={`/u/${encodeURIComponent(user.username)}`}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <UserCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                  My Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCamera && (
          <CameraCapture 
            onCapture={handleCapture} 
            onClose={() => setShowCamera(false)} 
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
