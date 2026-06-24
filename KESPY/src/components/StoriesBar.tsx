import React, { useState, useEffect, useRef } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Camera, Trash2, Upload, ImageIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";

interface Story {
  id: number;
  userId: number;
  image: string;
  createdAt: string;
  username: string;
  displayName: string;
  avatar: string;
}

interface GroupedStories {
  userId: number;
  username: string;
  displayName: string;
  avatar: string;
  stories: Story[];
}

interface StoriesBarProps {
  onOpenCamera: () => void;
  refreshTrigger?: number;
}

export default function StoriesBar({ onOpenCamera, refreshTrigger }: StoriesBarProps) {
  const { user: currentUser } = useAuth();
  const [groupedStories, setGroupedStories] = useState<GroupedStories[]>([]);
  const [loading, setLoading] = useState(true);

  // Story Viewer state
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);

  // Story Option states
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const storyFileInputRef = useRef<HTMLInputElement>(null);

  const handleStoryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFile(true);
    setUploadError(null);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Img = reader.result as string;
        const res = await fetch("/api/posts/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64Img }),
        });
        if (res.ok) {
          setShowAddChoice(false);
          await fetchStories();
        } else {
          const errData = await res.json();
          setUploadError(errData.error || "Failed to upload story");
        }
        setIsUploadingFile(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploadError("Error reading image file.");
      setIsUploadingFile(false);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/posts/stories");
      if (res.ok) {
        const data = await res.json();
        // Group stories by userId
        const groups: Record<number, GroupedStories> = {};
        data.stories.forEach((story: Story) => {
          if (!groups[story.userId]) {
            groups[story.userId] = {
              userId: story.userId,
              username: story.username,
              displayName: story.displayName,
              avatar: story.avatar,
              stories: [],
            };
          }
          groups[story.userId].stories.push(story);
        });
        setGroupedStories(Object.values(groups));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [refreshTrigger]);

  // Story Viewer Timer effect
  useEffect(() => {
    if (selectedGroupIndex !== null) {
      setProgress(0);
      if (progressInterval.current) clearInterval(progressInterval.current);

      const activeGroup = groupedStories[selectedGroupIndex];
      const activeStory = activeGroup.stories[selectedStoryIndex];

      const duration = 5000; // 5 seconds per story
      const step = 100; // update scale
      const increment = (step / duration) * 100;

      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNextStory();
            return 0;
          }
          return prev + increment;
        });
      }, step);
    }

    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [selectedGroupIndex, selectedStoryIndex, groupedStories]);

  const handleNextStory = () => {
    if (selectedGroupIndex === null) return;
    const activeGroup = groupedStories[selectedGroupIndex];
    if (selectedStoryIndex < activeGroup.stories.length - 1) {
      setSelectedStoryIndex((prev) => prev + 1);
    } else {
      // Move to next user's stories if available
      if (selectedGroupIndex < groupedStories.length - 1) {
        setSelectedGroupIndex((prev) => prev + 1);
        setSelectedStoryIndex(0);
      } else {
        // End of all stories
        closeStoryViewer();
      }
    }
  };

  const handlePrevStory = () => {
    if (selectedGroupIndex === null) return;
    if (selectedStoryIndex > 0) {
      setSelectedStoryIndex((prev) => prev - 1);
    } else {
      // Move to previous user's stories if available
      if (selectedGroupIndex > 0) {
        setSelectedGroupIndex((prev) => prev - 1);
        const prevGroup = groupedStories[selectedGroupIndex - 1];
        setSelectedStoryIndex(prevGroup.stories.length - 1);
      } else {
        // Stay on first story
        setProgress(0);
      }
    }
  };

  const closeStoryViewer = () => {
    setSelectedGroupIndex(null);
    setSelectedStoryIndex(0);
    setProgress(0);
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  return (
    <div className="w-full">
      {/* Hidden file input for direct story upload */}
      <input 
        type="file"
        ref={storyFileInputRef}
        accept="image/*"
        onChange={handleStoryFileChange}
        className="hidden"
      />

      {/* Stories horizontal slider */}
      <div className="no-scrollbar flex items-center gap-4 overflow-x-auto pb-4 pt-1 px-1">
        {/* Current user's direct add button */}
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
          <div 
            onClick={() => setShowAddChoice(true)}
            className="w-16 h-16 rounded-full p-[2px] bg-slate-100 hover:bg-gradient-to-tr hover:from-indigo-400 hover:to-pink-500 transition-all duration-300 relative"
          >
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-200">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Your Profile"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-500 text-base font-bold">
                  {currentUser?.displayName?.charAt(0) || "U"}
                </div>
              )}
            </div>
            {/* Adding plus overlay */}
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md border-2 border-white group-hover:bg-pink-600 transition-colors">
              <Plus className="w-3.5 h-3.5" strokeWidth={3} />
            </div>
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-2 group-hover:text-slate-800 transition-colors">
            Your Story
          </span>
        </div>

        {/* Loading placeholder stories */}
        {loading && (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center flex-shrink-0 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-white"></div>
                <div className="h-2 bg-slate-200 w-10 mt-2 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Grouped active story bubbles */}
        {!loading &&
          groupedStories.map((group, groupIdx) => {
            const hasStories = group.stories.length > 0;
            if (!hasStories) return null;

            return (
              <div
                key={group.userId}
                onClick={() => {
                  setSelectedGroupIndex(groupIdx);
                  setSelectedStoryIndex(0);
                }}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 hover:scale-105 transition-transform duration-300 shadow-md">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border border-white">
                    {group.avatar ? (
                      <img src={group.avatar} alt={group.username} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {group.displayName.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-2 truncate w-14 text-center group-hover:text-[#1a1a1a] transition-colors">
                  {group.displayName}
                </span>
              </div>
            );
          })}
      </div>

      {/* Story Display Modal Overlay */}
      <AnimatePresence>
        {selectedGroupIndex !== null && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950 px-4 md:py-8 select-none">
            {/* Backdrop Close */}
            <div className="absolute inset-0 bg-slate-950/90" onClick={closeStoryViewer} />

            {/* Immersive Mobile-focused display card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md aspect-[9/16] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800 z-10 flex flex-col justify-between"
            >
              {/* Overlay elements top & bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-10" />

              {/* Story content: image */}
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <img
                  src={groupedStories[selectedGroupIndex].stories[selectedStoryIndex].image}
                  alt="Story Content"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content top section: status progress lines and user avatar */}
              <div className="relative z-20 p-5 mt-2 flex flex-col gap-3">
                {/* Visual Segmented Progress indicators */}
                <div className="flex gap-1 w-full h-[3px]">
                  {groupedStories[selectedGroupIndex].stories.map((story, sIdx) => {
                    let fill = "bg-white/30";
                    if (sIdx < selectedStoryIndex) fill = "bg-white";
                    if (sIdx === selectedStoryIndex) fill = "bg-white"; // will scale below

                    return (
                      <div key={story.id} className="flex-1 bg-white/30 rounded-full overflow-hidden h-full">
                        {sIdx === selectedStoryIndex && (
                          <div
                            className="bg-white h-full transition-all ease-linear"
                            style={{ width: `${progress}%` }}
                          />
                        )}
                        {sIdx < selectedStoryIndex && <div className="bg-white h-full w-full" />}
                      </div>
                    );
                  })}
                </div>

                {/* User avatar and close action */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-white/60">
                      {groupedStories[selectedGroupIndex].avatar ? (
                        <img
                          src={groupedStories[selectedGroupIndex].avatar}
                          alt={groupedStories[selectedGroupIndex].username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                          {groupedStories[selectedGroupIndex].displayName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold leading-normal">
                        {groupedStories[selectedGroupIndex].displayName}
                      </p>
                      <p className="text-[10px] text-gray-300 font-medium opacity-90 leading-none">
                        @{groupedStories[selectedGroupIndex].username}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {groupedStories[selectedGroupIndex].userId === currentUser?.id && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          const activeStoryId = groupedStories[selectedGroupIndex].stories[selectedStoryIndex].id;
                          if (window.confirm("Are you sure you want to delete this story?")) {
                            try {
                              const res = await fetch(`/api/posts/stories/${activeStoryId}`, {
                                method: 'DELETE'
                              });
                              if (res.ok) {
                                closeStoryViewer();
                                await fetchStories();
                              }
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                        className="p-2 cursor-pointer bg-red-600/40 hover:bg-red-600/90 text-white rounded-full transition-colors border border-red-500/20"
                        title="Delete Story"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={closeStoryViewer}
                      className="p-2 cursor-pointer bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tap zones for fast tapping next/back */}
              <div className="absolute inset-y-24 left-0 right-0 flex z-10 pointer-events-auto">
                <div className="w-1/3 h-full cursor-west-resize" onClick={handlePrevStory} />
                <div className="w-1/3 h-full" onClick={handleNextStory} />
                <div className="w-1/3 h-full cursor-east-resize" onClick={handleNextStory} />
              </div>

              {/* Left/Right Desktop buttons */}
              <div className="absolute inset-y-1/2 left-4 right-4 hidden md:flex justify-between items-center z-20 pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevStory();
                  }}
                  className="p-3 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 disabled:opacity-30 rounded-full text-white backdrop-blur-md transition-all border border-white/10 cursor-pointer pointer-events-auto"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextStory();
                  }}
                  className="p-3 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 rounded-full text-white backdrop-blur-md transition-all border border-white/10 cursor-pointer pointer-events-auto"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Story Timestamp and metadata at bottom */}
              <div className="relative z-20 p-6 flex justify-center text-center">
                <span className="text-[10px] font-mono text-slate-300 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">
                  Live story active
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Choose Upload Mode Option Modal */}
      <AnimatePresence>
        {showAddChoice && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              onClick={() => {
                setShowAddChoice(false);
                setUploadError(null);
              }}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#231C07] text-[#FAF8F4] rounded-[2rem] overflow-hidden shadow-2xl w-full max-w-sm relative z-10 border border-[#392A16] flex flex-col p-6 text-center"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-serif italic font-bold text-lg text-[#F78764]">Add Kespy Story</span>
                <button
                  onClick={() => {
                    setShowAddChoice(false);
                    setUploadError(null);
                  }}
                  className="p-1.5 hover:bg-[#392A16] text-[#DECDBC] hover:text-[#FAF8F4] rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#DECDBC] mb-6 leading-relaxed">
                Add a moments segment to your story feed. Choose to snap live through Kespy Lens or choose an existing photo.
              </p>

              {uploadError && (
                <div className="mb-4 text-xs font-bold text-[#F78764] bg-[#392A16]/50 p-3 rounded-xl border border-[#FAF8F4]/10">
                  {uploadError}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowAddChoice(false);
                    onOpenCamera();
                  }}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#B86F52] hover:bg-[#634133] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Capture from Camera
                </button>

                <button
                  onClick={() => {
                    storyFileInputRef.current?.click();
                  }}
                  disabled={isUploadingFile}
                  className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#392A16] hover:bg-[#634133] text-[#FAF8F4] font-bold text-xs uppercase tracking-wider rounded-2xl border border-[#634133] transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUploadingFile ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-4 h-4 animate-pulse" />
                      Choose Image File
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  setShowAddChoice(false);
                  setUploadError(null);
                }}
                className="mt-4 text-xs font-semibold text-[#DECDBC] hover:text-[#FAF8F4] transition-colors uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
