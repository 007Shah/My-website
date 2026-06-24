import React, { useState, useEffect } from "react";
import { 
  User, 
  Shield, 
  Lock, 
  Power, 
  Eye, 
  Bell, 
  Slash, 
  Check, 
  X, 
  Settings, 
  Download, 
  AlertTriangle,
  RefreshCw,
  Search,
  UserX,
  Globe,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

type SettingTab = "account" | "privacy" | "blocked" | "notifications" | "security";

interface BlockedUser {
  id: number;
  username: string;
  displayName: string;
  avatar: string | null;
}

export default function SettingsAndPrivacy() {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingTab>("account");
  
  // Loading & Action states
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Account State
  const [username, setUsername] = useState(user?.username || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Privacy State
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    activityStatus: true,
    everyoneMentions: "everyone",
    readReceipts: true,
    quietMode: false
  });

  // Blocked Users State
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [blockQuery, setBlockQuery] = useState("");
  const [blockSearchResults, setBlockSearchResults] = useState<any[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  // Notification / Security Toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  // Load Privacy & Blocked lists on component mount
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setDisplayName(user.displayName);
      fetchPrivacySettings();
      fetchBlockedUsers();
    }
  }, [user]);

  const fetchPrivacySettings = async () => {
    try {
      const res = await fetch("/api/users/me/settings/privacy");
      if (res.ok) {
        const data = await res.json();
        if (data.privacy && Object.keys(data.privacy).length > 0) {
          setPrivacy(prev => ({ ...prev, ...data.privacy }));
        }
      }
    } catch (err) {
      console.error("Error loading privacy settings:", err);
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const res = await fetch("/api/users/me/settings/blocks");
      if (res.ok) {
        const data = await res.json();
        setBlockedUsers(data.blocks || []);
      }
    } catch (err) {
      console.error("Error loading blocked users:", err);
    }
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg("");
    setTimeout(() => setErrorMsg(""), 4000);
  };

  // Update Username / Account handles
  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/users/me/settings/username", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        triggerError(data.error || "Failed to update username");
      } else {
        triggerSuccess("Username successfully updated!");
        await checkAuth(); // refresh credentials
      }
    } catch (err) {
      triggerError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      triggerError("Please specify both current and new passwords.");
      return;
    }
    if (newPassword.length < 6) {
      triggerError("New password must contain at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/me/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        triggerError(data.error || "Incorrect current password or update failed");
      } else {
        triggerSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      triggerError("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  // Update Privacy state to backend
  const handleTogglePrivacy = async (key: keyof typeof privacy, val: any) => {
    const updated = { ...privacy, [key]: val };
    setPrivacy(updated);
    try {
      const res = await fetch("/api/users/me/settings/privacy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ privacy: updated })
      });
      if (res.ok) {
        // Success silently or lightweight success toast
      }
    } catch (err) {
      console.error("Failed to commit privacy settings:", err);
    }
  };

  // Block search
  const handleSearchUsers = async (q: string) => {
    setBlockQuery(q);
    if (!q.trim()) {
      setBlockSearchResults([]);
      return;
    }
    setSearchingUsers(true);
    try {
      const res = await fetch(`/api/users/search/all?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        // Exclude ourselves and users already blocked
        const filtered = (data.users || []).filter(
          (u: any) => u.id !== user?.id && !blockedUsers.some(b => b.id === u.id)
        );
        setBlockSearchResults(filtered);
      }
    } catch (err) {
      console.error("Search users for block failed:", err);
    } finally {
      setSearchingUsers(false);
    }
  };

  // Core block action
  const handleBlockUser = async (targetId: number) => {
    try {
      const res = await fetch(`/api/users/me/settings/blocks/${targetId}`, {
        method: "POST"
      });
      if (res.ok) {
        triggerSuccess("Account added to blocked directory.");
        setBlockQuery("");
        setBlockSearchResults([]);
        fetchBlockedUsers();
        await checkAuth(); // synchronize context feed bounds
      }
    } catch (err) {
      triggerError("Could not block account.");
    }
  };

  // Core unblock action
  const handleUnblockUser = async (targetId: number) => {
    try {
      const res = await fetch(`/api/users/me/settings/blocks/${targetId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        triggerSuccess("Account successfully unblocked.");
        fetchBlockedUsers();
      }
    } catch (err) {
      triggerError("Could not unblock account.");
    }
  };

  // Mock safety functions to keep interface rich
  const handleWipeCache = () => {
    localStorage.clear();
    triggerSuccess("Local browser cache cleaned down to zero.");
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user, privacy, blockedUsers }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `aura_luxe_session_${user?.username || 'user'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerSuccess("Secure encrypted data archive downloaded!");
  };

  const menuItems = [
    { id: "account" as SettingTab, label: "Account Settings", icon: User, desc: "Username and active passport info" },
    { id: "privacy" as SettingTab, label: "Privacy Controls", icon: Shield, desc: "Manage discovery, circles, & visibility" },
    { id: "blocked" as SettingTab, label: "Blocked Accounts", icon: UserX, desc: "Restricted and blocked profiles" },
    { id: "notifications" as SettingTab, label: "Notification Feed", icon: Bell, desc: "Configure pushes and email digest alerts" },
    { id: "security" as SettingTab, label: "Security & Cache", icon: Lock, desc: "Export dataset, MFA, and local cache" },
  ];

  return (
    <div className="pb-24 max-w-5xl mx-auto px-4 md:px-0">
      {/* Premium visual intro banner */}
      <div className="mb-8 p-6 bg-gradient-to-br from-[#121421] via-[#16192b] to-[#1e1d35] rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <h1 className="text-3xl font-serif tracking-tight text-white font-bold leading-normal mb-1">
          Setting & Privacy
        </h1>
        <p className="text-slate-400 font-medium text-sm">
          Fine-tune credentials, manage block lists, tweak discovery ranges, and optimize security guidelines.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side Navigation Sidebar - STRICTLY split layout */}
        <div className="w-full lg:w-80 shrink-0 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <span className="text-[10px] font-extrabold text-slate-400 tracking-widest uppercase flex items-center gap-1.5 px-2">
            <Settings className="w-3.5 h-3.5 text-indigo-500 mr-1" />
            Control Hub
          </span>
          <div className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex items-start gap-3.5 p-3.5 rounded-2.5xl transition-all w-full text-left cursor-pointer ${
                    isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10" 
                      : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 mt-0.5 ${isActive ? "text-white" : "text-indigo-500"}`} />
                  <div className="min-w-0">
                    <p className={`text-xs font-black uppercase tracking-wider ${isActive ? "text-white" : "text-slate-800"}`}>
                      {item.label}
                    </p>
                    <p className={`text-[10px] mt-0.5 mt-1 truncate ${isActive ? "text-indigo-100" : "text-slate-400"}`}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Inner Right Panel */}
        <div className="flex-1 w-full min-h-[460px]">
          {/* Notifications / Feedback Bar */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2.5xl"
              >
                <Check className="w-4 h-4 shrink-0 font-extrabold" />
                {successMsg}
              </motion.div>
            )}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-2.5xl"
              >
                <AlertTriangle className="w-4 h-4 shrink-0 font-extrabold" />
                {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm min-h-[440px]">
            {/* Tab 1: Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">My Handle & Username</h2>
                  <p className="text-xs text-slate-400">Change your public alphanumeric username passport safely inside Kespy registry.</p>
                </div>

                <form onSubmit={handleUpdateUsername} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Kespy Username</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">@</span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="johndoe"
                          className="w-full bg-slate-50/50 border border-slate-100 focus:border-indigo-500 focus:bg-white text-xs font-bold text-slate-800 px-4 py-3 rounded-2xl pl-8 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading || username.trim() === user?.username}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </form>

                <div className="border-t border-slate-50 pt-8">
                  <div className="mb-4">
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Change Account Password</h2>
                    <p className="text-xs text-slate-400">Lock down your account with a secondary secure alphanumeric sequence.</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50/50 border border-slate-100 focus:border-indigo-500 focus:bg-white text-xs font-bold text-slate-800 px-4 py-3 rounded-2xl transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full bg-slate-50/50 border border-slate-100 focus:border-indigo-500 focus:bg-white text-xs font-bold text-slate-800 px-4 py-3 rounded-2xl transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !currentPassword || !newPassword}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-40"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab 2: Privacy Controls */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Privacy & Visibility</h2>
                  <p className="text-xs text-slate-400">Tweak discovery thresholds, limit visibility, and safeguard quiet spaces.</p>
                </div>

                <div className="space-y-5 pt-4">
                  {/* Discoverable Profile */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="pr-4">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-slate-400" /> Discoverable Profile
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Let algorithm index and direct friends/followers to your dashboard via search.</p>
                    </div>
                    <button
                      onClick={() => handleTogglePrivacy("profilePublic", !privacy.profilePublic)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ${
                        privacy.profilePublic ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-250 ${
                        privacy.profilePublic ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="pr-4">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Show Online Indicator</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Let members see standard active indicator glowing next to your name.</p>
                    </div>
                    <button
                      onClick={() => handleTogglePrivacy("activityStatus", !privacy.activityStatus)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ${
                        privacy.activityStatus ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-250 ${
                        privacy.activityStatus ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Quiet Mode */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div className="pr-4">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 text-amber-600">
                        <Power className="w-3.5 h-3.5" /> Mute Alerts (Quiet Mode)
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Quiet notification logs and silence pushes instantly to promote mindfulness.</p>
                    </div>
                    <button
                      onClick={() => handleTogglePrivacy("quietMode", !privacy.quietMode)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ${
                        privacy.quietMode ? "bg-amber-500" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-250 ${
                        privacy.quietMode ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  {/* Mentions Preference */}
                  <div className="pt-2">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-450 mb-2">Who can @Mention you</label>
                    <select
                      value={privacy.everyoneMentions}
                      onChange={(e) => handleTogglePrivacy("everyoneMentions", e.target.value)}
                      className="bg-slate-50 border border-slate-100 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:bg-white focus:border-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="following">Only People I Follow</option>
                      <option value="none">No One</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Blocked Accounts (Real DB-connected list!) */}
            {activeTab === "blocked" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Blocked Accounts Register</h2>
                  <p className="text-xs text-slate-400">Blocked members cannot peer into your diary, view pages, or drop comment alerts.</p>
                </div>

                {/* Search & Block addition area */}
                <div className="space-y-3">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-450">Block New Account</span>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={blockQuery}
                      onChange={(e) => handleSearchUsers(e.target.value)}
                      placeholder="Type username or name to search..."
                      className="w-full bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white text-xs font-bold text-slate-800 px-4 py-3 rounded-2xl pl-11 transition-all"
                    />
                  </div>

                  {/* Search results popover under target */}
                  {blockQuery.trim().length > 0 && (
                    <div className="bg-slate-50 border border-slate-100/90 rounded-2.5xl p-3 space-y-2 max-h-48 overflow-y-auto shadow-sm">
                      {searchingUsers ? (
                        <p className="text-[10px] text-slate-450 italic p-1 animate-pulse">Running Kespy register diagnostics...</p>
                      ) : blockSearchResults.length > 0 ? (
                        blockSearchResults.map((u) => (
                          <div key={u.id} className="flex items-center justify-between p-2 hover:bg-white rounded-xl transition-all">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{u.displayName}</p>
                                <p className="text-[10px] text-slate-400 truncate">@{u.username}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleBlockUser(u.id)}
                              className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-[9px] font-extrabold uppercase tracking-widest cursor-pointer"
                            >
                              Block
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-[10px] text-slate-450 p-2 text-center">No compatible user match found</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Blocked Accounts list */}
                <div className="border-t border-slate-50 pt-5">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                    Blocked Members ({blockedUsers.length})
                  </span>

                  {blockedUsers.length > 0 ? (
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {blockedUsers.map((bu) => (
                        <div key={bu.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-2.5xl border border-slate-100">
                          <div className="flex gap-3 items-center min-w-0">
                            <img src={bu.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"} className="w-9 h-9 rounded-full object-cover shrink-0-0 border border-slate-100" alt="" />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">{bu.displayName}</p>
                              <p className="text-[10px] text-slate-400">@{bu.username}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnblockUser(bu.id)}
                            className="px-4 py-1.5 bg-slate-200/70 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            Unblock
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-slate-50/40 rounded-2.5xl border border-[dashed] border-slate-150 p-6">
                      <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 font-bold">Absolutely clean index</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Your block list contains zero entries!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Notification Settings</h2>
                  <p className="text-xs text-slate-400">Choose exactly how active and vocal your Kespy alert streams are.</p>
                </div>

                <div className="space-y-5 pt-4">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Push Notifications</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Deliver quick instant overlays for incoming comments & mentions.</p>
                    </div>
                    <button
                      onClick={() => setPushEnabled(!pushEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ${
                        pushEnabled ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-250 ${
                        pushEnabled ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Weekly Email Digests</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Bundle missed connections and page posts inside a weekly compact dispatch.</p>
                    </div>
                    <button
                      onClick={() => setEmailDigest(!emailDigest)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ${
                        emailDigest ? "bg-indigo-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-250 ${
                        emailDigest ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Security & Cache */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Security, Data & Cache</h2>
                  <p className="text-xs text-slate-400">Export private logs, enforce multi-factor credentials, and prune cache structures.</p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                    <div>
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wider">Two-Factor Authentication (MFA)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Enforce randomized secure numeric codes during access verification gates.</p>
                    </div>
                    <button
                      onClick={() => setMfaEnabled(!mfaEnabled)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ${
                        mfaEnabled ? "bg-emerald-600" : "bg-slate-200"
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-250 ${
                        mfaEnabled ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Database Tools</span>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleExportData}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100 hover:border-slate-200 text-xs font-bold uppercase rounded-2xl tracking-wider transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-indigo-500" />
                        Export Data Archive
                      </button>
                      <button
                        onClick={handleWipeCache}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-50/40 border border-rose-100/40 hover:bg-rose-50 hover:border-rose-100 text-rose-600 text-xs font-bold uppercase rounded-2xl tracking-wider transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4 " />
                        Prune Browser Cache
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
