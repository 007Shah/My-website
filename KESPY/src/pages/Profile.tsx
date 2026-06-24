import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Post, Page } from "../types";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  UserPlus,
  Check,
  X,
  Camera,
  Shield,
  Bell,
  UserCheck,
  Clock,
  Briefcase,
  LogOut,
  Sparkles,
  BookOpen,
  Bookmark,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";

interface ProfileUser extends User {
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  hasPendingRequestFromMe?: boolean;
  hasPendingRequestToMe?: boolean;
  isFriend?: boolean;
}

export default function Profile() {
  const params = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const { user: currentUser, checkAuth, logout } = useAuth();
  const username = params.username || currentUser?.username || "";

  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);

  const [activeTab, setActiveTab] = useState<"posts" | "pages" | "saved" | "following" | "followers" | "settings">("posts");
  const [showEdit, setShowEdit] = useState(false);

  // States for other lists
  const [userPages, setUserPages] = useState<any[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);

  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  const [followerList, setFollowerList] = useState<User[]>([]);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const [allPages, setAllPages] = useState<Page[]>([]);
  const [loadingAllPages, setLoadingAllPages] = useState(false);
  const pagesSliderRef = React.useRef<HTMLDivElement>(null);

  const fetchAllPages = async () => {
    setLoadingAllPages(true);
    try {
      const res = await fetch("/api/pages");
      if (res.ok) {
        const data = await res.json();
        setAllPages(data.pages || []);
      }
    } catch (err) {
      console.error("Error fetching all pages:", err);
    } finally {
      setLoadingAllPages(false);
    }
  };

  const slidePages = (direction: "left" | "right") => {
    if (pagesSliderRef.current) {
      const scrollAmount = 300;
      pagesSliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Edit Profile form state
  const [editForm, setEditForm] = useState({
    displayName: "",
    bio: "",
    avatar: "",
    coverImage: "",
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // App Settings state inside Settings tab
  const [cameraAllowed, setCameraAllowed] = useState(true);
  const [microphoneAllowed, setMicrophoneAllowed] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Load app settings from localStorage
  useEffect(() => {
    const cachedCamera = localStorage.getItem("settings_camera");
    const cachedMicrophone = localStorage.getItem("settings_microphone");
    const cachedPush = localStorage.getItem("settings_push");
    const cachedPublic = localStorage.getItem("settings_public");

    if (cachedCamera !== null) setCameraAllowed(cachedCamera === "true");
    if (cachedMicrophone !== null) setMicrophoneAllowed(cachedMicrophone === "true");
    if (cachedPush !== null) setPushNotifications(cachedPush === "true");
    if (cachedPublic !== null) setProfilePublic(cachedPublic === "true");
  }, []);

  const handleSaveSettingsObj = () => {
    localStorage.setItem("settings_camera", String(cameraAllowed));
    localStorage.setItem("settings_microphone", String(microphoneAllowed));
    localStorage.setItem("settings_push", String(pushNotifications));
    localStorage.setItem("settings_public", String(profilePublic));

    setSavedSettingsSuccess(true);
    setTimeout(() => {
      setSavedSettingsSuccess(false);
    }, 3000);
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [profileRes, postsRes] = await Promise.all([
        fetch(`/api/users/${encodeURIComponent(username || "")}`),
        fetch(`/api/posts/user/${encodeURIComponent(username || "")}`),
      ]);

      if (profileRes.ok) {
        const data = await profileRes.json();
        setProfile(data.user);
        setFollowerCount(data.user.followersCount);
        setEditForm({
          displayName: data.user.displayName || "",
          bio: data.user.bio || "",
          avatar: data.user.avatar || "",
          coverImage: data.user.coverImage || "",
        });
      } else if (currentUser && currentUser.username.toLowerCase() === username?.toLowerCase()) {
        setProfile({
          ...currentUser,
          followersCount: currentUser.followersCount || 0,
          followingCount: currentUser.followingCount || 0,
          isFollowing: false,
          hasPendingRequestFromMe: false,
          hasPendingRequestToMe: false,
          isFriend: false,
        });
        setFollowerCount(currentUser.followersCount || 0);
        setEditForm({
          displayName: currentUser.displayName || "",
          bio: currentUser.bio || "",
          avatar: currentUser.avatar || "",
          coverImage: currentUser.coverImage || "",
        });
      } else {
        setProfile(null);
      }

      if (postsRes.ok) {
        const data = await postsRes.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
      if (currentUser && currentUser.username.toLowerCase() === username?.toLowerCase()) {
        setProfile({
          ...currentUser,
          followersCount: currentUser.followersCount || 0,
          followingCount: currentUser.followingCount || 0,
          isFollowing: false,
          hasPendingRequestFromMe: false,
          hasPendingRequestToMe: false,
          isFriend: false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAllPages();
    setActiveTab("posts"); // Reset tab on username change
  }, [username, currentUser]);

  const fetchUserPages = async () => {
    if (!profile) return;
    setLoadingPages(true);
    try {
      const res = await fetch("/api/pages");
      if (res.ok) {
        const json = await res.json();
        const filtered = (json.pages || []).filter((p: any) => p.ownerId === profile.id);
        setUserPages(filtered);
      }
    } catch (err) {
      console.error("Error fetching user pages:", err);
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchSavedPosts = async () => {
    setLoadingSaved(true);
    try {
      const savedIds = JSON.parse(localStorage.getItem("saved_post_ids") || "[]");
      const res = await fetch("/api/posts");
      if (res.ok) {
        const json = await res.json();
        const filtered = (json.posts || []).filter((p: any) => savedIds.includes(p.id));
        setSavedPosts(filtered);
      }
    } catch (err) {
      console.error("Error fetching saved posts:", err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const fetchFollowersList = async () => {
    if (!profile) return;
    setLoadingFollowers(true);
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(profile.username)}/followers`);
      if (res.ok) {
        const data = await res.json();
        setFollowerList(data.followers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const fetchFollowingList = async () => {
    if (!profile) return;
    setLoadingFollowing(true);
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(profile.username)}/following`);
      if (res.ok) {
        const data = await res.json();
        setFollowingList(data.following || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollowing(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!profile) return;
    try {
      const res = await fetch("/api/users/friend-requests/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: profile.id }),
      });
      if (res.ok) {
        setProfile(prev => prev ? { ...prev, hasPendingRequestFromMe: true } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnfollowOrDisconnect = async () => {
    if (!profile) return;
    try {
      const res = await fetch(`/api/users/${profile.id}/follow`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(prev => prev ? { 
          ...prev, 
          isFollowing: data.following,
          isFriend: false,
          hasPendingRequestFromMe: false
        } : null);
        setFollowerCount((prev) => Math.max(0, prev + (data.following ? 1 : -1)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptFriendRequest = async () => {
    if (!profile) return;
    try {
      const reqRes = await fetch("/api/users/me/friend-requests");
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        const matchingRequest = reqData.requests.find((r: any) => r.senderId === profile.id);
        if (matchingRequest) {
          const acceptRes = await fetch(`/api/users/friend-requests/${matchingRequest.id}/accept`, {
            method: "POST",
          });
          if (acceptRes.ok) {
            setProfile(prev => prev ? { 
              ...prev, 
              isFriend: true, 
              isFollowing: true,
              hasPendingRequestToMe: false 
            } : null);
            setFollowerCount(prev => prev + 1);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setShowEdit(false);
        setProfile((prev) => (prev ? { ...prev, ...editForm } : prev));
        checkAuth(); // update context
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "coverImage",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-16 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
        User not found in this network portal.
      </div>
    );
  }

  const isMe = currentUser?.username === profile.username;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden mb-6 shadow-sm">
        {/* Cover Photo */}
        <div className="h-44 md:h-56 bg-slate-100 relative overflow-hidden group">
          {profile.coverImage ? (
            <img
              src={profile.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-indigo-50 to-emerald-50 opacity-90" />
          )}
        </div>

        {/* Profile details band */}
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex justify-between items-end -mt-16 md:-mt-20 mb-6">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[5px] border-white bg-slate-100 overflow-hidden shadow-md relative z-10 shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl uppercase">
                  {profile.displayName.charAt(0)}
                </div>
              )}
            </div>

            <div className="pb-2">
              {isMe ? (
                <button
                  onClick={() => setShowEdit(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-xs tracking-wider uppercase font-bold text-white px-6 py-2.5 rounded-full shadow-md hover:shadow-indigo-600/15 transition-all block cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  {profile.isFriend ? (
                    <button
                      onClick={handleUnfollowOrDisconnect}
                      className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-550" /> Friends
                      </span>
                    </button>
                  ) : profile.hasPendingRequestFromMe ? (
                    <button
                      disabled
                      className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                    >
                      Pending Request
                    </button>
                  ) : profile.hasPendingRequestToMe ? (
                    <button
                      onClick={() => handleAcceptFriendRequest()}
                      className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                    >
                      Accept Request
                    </button>
                  ) : (
                    <button
                      onClick={handleSendFriendRequest}
                      className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <UserPlus className="w-3.5 h-3.5" /> Add Friend
                      </span>
                    </button>
                  )}
                  
                  {!profile.isFriend && (
                    <button
                      onClick={profile.isFollowing ? handleUnfollowOrDisconnect : handleSendFriendRequest}
                      className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${
                        profile.isFollowing 
                        ? "border border-slate-200 bg-slate-50 text-slate-600"
                        : "border border-slate-200 bg-white text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {profile.isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800 leading-tight">
              {profile.displayName}
            </h1>
            <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em] font-extrabold">
              @{profile.username}
            </p>
          </div>

          {profile.bio && (
            <p className="mt-5 text-slate-600 text-sm leading-relaxed max-w-2xl bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              "{profile.bio}"
            </p>
          )}
        </div>
      </div>

      {/* Pages Directory Slidable Carousel Section (Discovery of all pages) */}
      <div className="bg-gradient-to-r from-orange-400 via-rose-500 to-indigo-600 rounded-[2rem] p-6 text-white mb-8 shadow-xl relative overflow-hidden">
        {/* Decorative ambient elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl -ml-8 -mb-8 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div>
            <span className="bg-white/20 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white/95 inline-flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 animate-pulse text-amber-300" /> Page Network Slider
            </span>
            <span className="text-white/50 text-[10px] ml-2 font-mono">Discover All public pages</span>
            <h2 className="text-xl md:text-2xl font-serif font-semibold tracking-tight text-white mt-1">
              All Public Portals & Communities
            </h2>
            <p className="text-white/80 text-xs mt-0.5 font-sans">
              Discover, slide, and tap into pages created by the community.
            </p>
          </div>

          {/* Slider Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => slidePages("left")}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 active:scale-95 rounded-full text-white transition-all cursor-pointer shadow-sm"
              title="Slide Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => slidePages("right")}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 active:scale-95 rounded-full text-white transition-all cursor-pointer shadow-sm"
              title="Slide Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slidable Pages Carousel container */}
        <div 
          ref={pagesSliderRef}
          className="flex gap-4 overflow-x-auto scrollbar-none pb-2 relative z-10 snap-x snap-mandatory pt-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {loadingAllPages ? (
            <div className="flex items-center justify-center py-8 w-full">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : allPages.length > 0 ? (
            allPages.map((pageItem) => (
              <div
                key={pageItem.id}
                onClick={() => navigate(`/page/${pageItem.handle}`)}
                className="min-w-[245px] max-w-[245px] bg-[#0c0d12]/40 hover:bg-[#0c0d12]/65 backdrop-blur-lg border border-white/10 hover:border-white/20 p-4 rounded-2.5xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer select-none snap-start group flex flex-col justify-between"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 overflow-hidden shrink-0">
                    {pageItem.avatar ? (
                      <img src={pageItem.avatar} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[#ffd0e0] bg-white/5 text-sm uppercase">
                        {pageItem.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-amber-200 transition-colors">
                      {pageItem.name}
                    </h3>
                    <p className="text-[10px] text-white/60 truncate">@{pageItem.handle}</p>
                  </div>
                </div>

                <p className="text-[11px] text-white/70 line-clamp-2 mt-3 italic">
                  {pageItem.description || "Explore and subscribe to this community page."}
                </p>

                <div className="flex items-center justify-between text-[9px] uppercase tracking-wider font-extrabold text-amber-300 mt-4 pt-2.5 border-t border-white/5">
                  <span className="bg-white/10 px-2 py-0.5 rounded text-white/95">{pageItem.category}</span>
                  <span className="flex items-center gap-0.5 text-[#ff80a0]">
                    {pageItem.followersCount || 0} Followers
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 w-full text-white/70 text-xs">
              No public pages discovered. Build the very first page!
            </div>
          )}
        </div>
      </div>

      {/* 2-Column Sidebar Layout for Profile Page */}
      <div className="flex flex-col lg:flex-row gap-8 items-start mb-6">
        {/* Profile Details left sidebar */}
        <div className="w-full lg:w-72 shrink-0 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-6">
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-100 shrink-0 bg-slate-50">
              {profile.avatar ? (
                <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-extrabold text-sm uppercase">
                  {profile.displayName.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-black text-slate-800 truncate">{profile.displayName}</h3>
              <p className="text-[10px] text-slate-400 truncate">@{profile.username}</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {/* Posts */}
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all w-full text-left cursor-pointer ${
                activeTab === "posts"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="flex-1">Posts</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === "posts" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>{posts.length}</span>
            </button>

            {/* My Pages */}
            <button
              onClick={() => {
                setActiveTab("pages");
                fetchUserPages();
              }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all w-full text-left cursor-pointer ${
                activeTab === "pages"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="flex-1">My Pages</span>
            </button>

            {/* Saved Items */}
            {isMe && (
              <button
                onClick={() => {
                  setActiveTab("saved");
                  fetchSavedPosts();
                }}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all w-full text-left cursor-pointer ${
                  activeTab === "saved"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Bookmark className="w-4 h-4 shrink-0" />
                <span className="flex-1">Saved Pins</span>
              </button>
            )}

            {/* Following */}
            <button
              onClick={() => {
                setActiveTab("following");
                fetchFollowingList();
              }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all w-full text-left cursor-pointer ${
                activeTab === "following"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <span className="flex-1">Following</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === "following" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>{profile.followingCount || 0}</span>
            </button>

            {/* Followers */}
            <button
              onClick={() => {
                setActiveTab("followers");
                fetchFollowersList();
              }}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all w-full text-left cursor-pointer ${
                activeTab === "followers"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="flex-1">Followers</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === "followers" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>{followerCount || 0}</span>
            </button>

            {/* Setting & Privacy */}
            {isMe && (
              <button
                onClick={() => navigate('/settings')}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[11px] font-extrabold uppercase tracking-widest transition-all w-full text-left cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-900`}
              >
                <Shield className="w-4 h-4 shrink-0" />
                <span className="flex-1">Setting & Privacy</span>
              </button>
            )}
          </nav>
        </div>

        {/* Profile Dynamic Content Right Panel */}
        <div className="flex-1 min-w-0 w-full min-h-[240px]">
          {/* Tab Panels */}
          {activeTab === "posts" && (
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <p className="text-slate-400 font-bold mb-1">No posts published yet</p>
                <p className="text-xs text-slate-400">All expressions will render beautifully here.</p>
              </div>
            )}
          </div>
        )}

        {/* My Pages Panel */}
        {activeTab === "pages" && (
          <div className="space-y-4">
            {loadingPages ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : userPages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userPages.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/page/${p.handle}`)}
                    className="bg-white border border-slate-100 hover:border-indigo-100 rounded-2.5xl overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer shadow-sm p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                        {p.avatar ? (
                          <img src={p.avatar} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-tr from-indigo-50 to-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm">
                            {p.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                        <p className="text-xs text-slate-400">@{p.handle}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 line-clamp-2 italic">
                      {p.description || "No description provided."}
                    </p>
                    <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                      <span>{p.category}</span>
                      <span className="text-indigo-600">{p.followersCount || 0} followers</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
                <p className="text-slate-400 font-bold mb-1">No pages created yet</p>
                <p className="text-xs text-slate-450">Jump into Pages directory to seed custom pages!</p>
              </div>
            )}
          </div>
        )}

        {/* Saved Items Panel (private) */}
        {activeTab === "saved" && isMe && (
          <div className="space-y-6">
            {loadingSaved ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : savedPosts.length > 0 ? (
              savedPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 font-bold mb-1">No bookmark items saved</p>
                <p className="text-xs text-slate-450">Tapping bookmark in posts adds them beautifully to this custom view.</p>
              </div>
            )}
          </div>
        )}

        {/* Following Panel */}
        {activeTab === "following" && (
          <div className="space-y-4">
            {loadingFollowing ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : followingList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {followingList.map((userItem) => (
                  <div
                    key={userItem.id}
                    onClick={() => navigate(`/u/${encodeURIComponent(userItem.username)}`)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:scale-[1.01] transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                      {userItem.avatar ? (
                        <img src={userItem.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase text-xs">
                          {userItem.displayName ? userItem.displayName.charAt(0) : "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-650 transition-colors">
                        {userItem.displayName}
                      </p>
                      <p className="text-[10px] text-slate-400">@{userItem.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Not following anyone yet
              </p>
            )}
          </div>
        )}

        {/* Followers Panel */}
        {activeTab === "followers" && (
          <div className="space-y-4">
            {loadingFollowers ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : followerList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {followerList.map((userItem) => (
                  <div
                    key={userItem.id}
                    onClick={() => navigate(`/u/${encodeURIComponent(userItem.username)}`)}
                    className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 hover:scale-[1.01] transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-50 border border-slate-100">
                      {userItem.avatar ? (
                        <img src={userItem.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase text-xs">
                          {userItem.displayName ? userItem.displayName.charAt(0) : "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-655 transition-colors">
                        {userItem.displayName}
                      </p>
                      <p className="text-[10px] text-slate-400">@{userItem.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                No followers yet
              </p>
            )}
          </div>
        )}

        {/* Settings Panel */}
        {activeTab === "settings" && isMe && (
          <div className="space-y-5">
            {/* Device Permissions Card */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" /> Device Permissions
              </h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Camera Access</p>
                    <p className="text-xs text-slate-400 mt-0.5">Used for capture of stories and visual posts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCameraAllowed(!cameraAllowed)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      cameraAllowed ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        cameraAllowed ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Microphone Access</p>
                    <p className="text-xs text-slate-400 mt-0.5">Allow video audio recordings in future updates.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMicrophoneAllowed(!microphoneAllowed)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      microphoneAllowed ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        microphoneAllowed ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* App Preferences */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" /> Notifications & Feeds
              </h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Enable Push Notifications</p>
                    <p className="text-xs text-slate-400 mt-0.5">Receive immediate alerts for friend requests, mentions, and activity comments.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      pushNotifications ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        pushNotifications ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-xs font-bold text-slate-450 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" /> App Permissions & Privacy
              </h2>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Discoverable Profile</p>
                    <p className="text-xs text-slate-400 mt-0.5">Allow other Kespy users to find you in search indexes and networks.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProfilePublic(!profilePublic)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      profilePublic ? "bg-indigo-600" : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        profilePublic ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Changes CTA and Sign-out details */}
            <div className="flex flex-col gap-6 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {savedSettingsSuccess && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl"
                    >
                      <Check className="w-4 h-4" />
                      Settings updated successfully
                    </motion.div>
                  )}
                </div>
                <button
                  onClick={handleSaveSettingsObj}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-indigo-600/10 transition-all cursor-pointer"
                >
                  Save Settings
                </button>
              </div>

              {/* Robust Sign-out at the very end of Settings tab inside Profile! */}
              <div className="border-t border-slate-100 pt-6 flex items-center justify-between bg-rose-50/20 rounded-3xl p-6 border border-rose-100/60 mt-4">
                <div>
                  <h3 className="text-sm font-bold text-rose-800">Access Controls</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Logout from your account session securely on this device.</p>
                </div>
                <button
                  onClick={logout}
                  className="px-6 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-300 border border-rose-200 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
        </div> {/* Closing dynamic content right panel */}
      </div> {/* Closing lg:flex-row parent layout */}

      {/* Sign Out Card at the absolute end of my Profile page */}
      {isMe && (
        <div className="mt-10 bg-white border border-slate-100/80 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Secure Access Controls</h3>
            <p className="text-xs text-slate-400 mt-0.5">Securely sign out and terminate your current login session on this device.</p>
          </div>
          <button
            onClick={logout}
            className="px-6 py-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-transparent rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            Sign Out
          </button>
        </div>
      )}

      {/* Edit Profile overlay modal */}
      <AnimatePresence>
        {showEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowEdit(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-25">
                <h3 className="font-bold text-lg text-slate-800">
                  Edit Profile Information
                </h3>
                <button
                  onClick={() => setShowEdit(false)}
                  className="p-2 hover:bg-slate-55 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-widest mb-2">
                    Cover Image Header
                  </label>
                  <label className="block h-32 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer relative overflow-hidden group">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "coverImage")}
                    />
                    {editForm.coverImage ? (
                      <>
                        <img
                          src={editForm.coverImage}
                          className="w-full h-full object-cover"
                          alt="Cover preview"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white w-6 h-6" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Camera className="w-6 h-6 mb-2 text-slate-400 group-hover:text-indigo-600" />
                        <span className="text-xs font-semibold group-hover:text-indigo-600">
                          Upload layout image
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-widest mb-2">
                    Profile Avatar Pic
                  </label>
                  <label className="block w-20 h-20 rounded-full border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer relative overflow-hidden group">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "avatar")}
                    />
                    {editForm.avatar ? (
                      <>
                        <img
                          src={editForm.avatar}
                          className="w-full h-full object-cover"
                          alt="Avatar preview"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white w-5 h-5" />
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400">
                        <Camera className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    )}
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-widest mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, displayName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-150 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-widest mb-2">
                    Bio Description
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-150 text-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-medium"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="px-6 py-2.5 text-xs uppercase font-bold tracking-wider text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md hover:shadow-indigo-600/10 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer animate-pulse"
                  >
                    {savingSettings ? "Saving..." : "Save Changes"}
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
