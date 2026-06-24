import React, { useRef, useState, useEffect } from "react";
import { Camera as CameraIcon, X, RefreshCw, Layers, Plus, Check, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
  onStorySuccess?: () => void;
}

export default function CameraCapture({ onCapture, onClose, onStorySuccess }: CameraCaptureProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [caption, setCaption] = useState("");
  const [publishingFeed, setPublishingFeed] = useState(false);

  // Creative snapshot presets if camera is blocked or user wants pre-made aesthetic content
  const presets = [
    { name: "Kespy Cosmic", url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80" },
    { name: "Neon Street", url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80" },
    { name: "Cozy Loft", url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80" },
    { name: "Retro Sunset", url: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=600&q=80" },
    { name: "Urban Dusk", url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  ];

  const [selectedPreset, setSelectedPreset] = useState(presets[0].url);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    stopCamera();
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError("Webcam not available. Choose an aesthetic preset below or upload a file!");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 800;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (facingMode === "user") {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const capturePreset = () => {
    setCapturedImage(selectedPreset);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const uploadToFeed = async () => {
    if (!capturedImage) return;
    setPublishingFeed(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: caption.trim() || undefined, image: capturedImage }),
      });
      if (res.ok) {
        setSuccessMsg("Shared beautifully to your moments!");
        if (onStorySuccess) onStorySuccess();
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 1200);
      } else {
        alert("Failed to publish post to your moments");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving your moment post");
    } finally {
      setPublishingFeed(false);
    }
  };

  const uploadToStories = async () => {
    if (!capturedImage) return;
    setUploading(true);
    try {
      const res = await fetch("/api/posts/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: capturedImage }),
      });
      if (res.ok) {
        setSuccessMsg("Added successfully to live stories!");
        if (onStorySuccess) {
          onStorySuccess();
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to upload to stories");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving story");
    } finally {
      setUploading(false);
    }
  };

  const keepInComposerDraft = () => {
    if (!capturedImage) return;
    onCapture(capturedImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        onClick={() => {
          stopCamera();
          onClose();
        }}
      />

      {/* Main Studio Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#231C07] text-[#FAF8F4] rounded-[2.5rem] overflow-hidden shadow-2xl w-full max-w-lg relative z-10 border border-[#392A16] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between border-b border-[#392A16] z-20 bg-[#231C07]">
          <div className="flex items-center gap-2">
            <CameraIcon className="w-5 h-5 text-[#F78764]" />
            <span className="font-serif italic font-bold text-white text-base">Kespy Lens Studio</span>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 bg-[#392A16] hover:bg-[#634133] hover:scale-105 active:scale-95 text-[#DECDBC] hover:text-[#FAF8F4] rounded-full transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Viewport */}
        <div className="relative bg-[#0F0B03] aspect-[4/5] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {successMsg ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-[#231C07]/95 flex flex-col items-center justify-center text-center p-8 z-30"
              >
                <div className="w-16 h-16 rounded-full bg-[#B86F52] flex items-center justify-center text-white text-3xl mb-4 shadow-lg shadow-[#B86F52]/20">
                  <Check className="w-8 h-8" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-serif font-black italic text-white leading-normal">Moment Updated!</h3>
                <p className="text-sm text-[#DECDBC] mt-2 max-w-xs">{successMsg}</p>
              </motion.div>
            ) : capturedImage ? (
              // Captured Photo Preview with caption and 3 pathways
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col z-20 bg-[#231C07]"
              >
                {/* Visual side-by-side or stacked grid layout */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-6 flex flex-col justify-between gap-4">
                  
                  {/* Photo Preview Thumbnail & Caption Section inside editor */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      {/* Image preview Thumbnail */}
                      <div className="w-20 h-24 rounded-2xl overflow-hidden border border-[#634133] shadow-md shrink-0 bg-black">
                        <img src={capturedImage} className="w-full h-full object-cover" alt="Thumb" />
                      </div>

                      {/* Caption box */}
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-[#F78764] uppercase tracking-wider mb-1.5">
                          Describe the vibe (Optional)
                        </label>
                        <textarea
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          placeholder="What makes this scene radiant? Write thoughts..."
                          className="w-full min-h-[72px] text-xs font-semibold rounded-xl p-3 bg-[#392A16] border border-[#634133] focus:border-[#B86F52] text-white placeholder:text-[#937C68]/80 resize-none outline-none focus:ring-1 focus:ring-[#B86F52]/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pathways Action Container */}
                  <div className="flex flex-col gap-2.5 bg-[#392A16]/40 p-4 rounded-3xl border border-[#392A16]">
                    <span className="text-[9px] font-bold text-[#DECDBC] uppercase tracking-widest text-center block mb-1">
                      Choose Your Destination Portal
                    </span>

                    <button
                      onClick={uploadToFeed}
                      disabled={publishingFeed || uploading}
                      className="w-full py-3.5 bg-[#B86F52] hover:bg-[#634133] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {publishingFeed ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Publish directly to Feed"
                      )}
                    </button>

                    <button
                      onClick={uploadToStories}
                      disabled={uploading || publishingFeed}
                      className="w-full py-3.5 bg-[#FAF8F4] hover:bg-[#FAF8F4]/90 disabled:opacity-50 text-[#231C07] font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <div className="w-4 h-4 border-2 border-[#231C07]/30 border-t-[#231C07] rounded-full animate-spin" />
                      ) : (
                        "Share to Live Stories"
                      )}
                    </button>

                    <button
                      onClick={keepInComposerDraft}
                      disabled={publishingFeed || uploading}
                      className="w-full py-3 bg-[#634133]/60 hover:bg-[#634133] text-[#DECDBC] hover:text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-[#634133] transition-all cursor-pointer flex items-center justify-center gap-2"
                      title="Append to default post field"
                    >
                      Use as Composer Draft
                    </button>
                  </div>

                  {/* Take another shot selector */}
                  <button
                    onClick={() => {
                      setCapturedImage(null);
                      setCaption("");
                      startCamera();
                    }}
                    className="text-center text-[10px] font-bold text-[#F78764] hover:text-[#FAF8F4] uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    ← Snap another portrait
                  </button>
                </div>
              </motion.div>
            ) : (
              // Live camera stream or simulated lens preset
              <motion.div
                key="live"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                {error ? (
                  // Custom Simulated Viewfinder & Presets
                  <div className="absolute inset-0 flex flex-col bg-[#0F0B03]">
                    <div className="flex-1 relative overflow-hidden flex items-center justify-center border-b border-[#392A16]">
                      <img src={selectedPreset} className="w-full h-full object-cover opacity-80" alt="Preset" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#231C07]/80 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4 bg-[#231C07]/95 backdrop-blur-md p-4 rounded-2xl border border-[#392A16] text-center">
                        <p className="text-xs text-[#F78764] font-bold uppercase tracking-wider">Kespy Preset Active</p>
                        <p className="text-[10px] text-[#DECDBC] mt-1">Snap this magnificent scene to share it!</p>
                      </div>
                    </div>
                    <div className="p-4 bg-[#231C07]/95">
                      <p className="text-[10px] font-bold text-[#DECDBC] uppercase tracking-widest mb-3 text-center">
                        Select Lens Presets
                      </p>
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar justify-center">
                        {presets.map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedPreset(preset.url)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                              selectedPreset === preset.url
                                ? "bg-[#B86F52] border-[#F78764] text-white shadow-lg shadow-[#B86F52]/25"
                                : "bg-[#392A16] border-[#634133] text-[#DECDBC] hover:text-[#FAF8F4]"
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Webcam Stream View
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer actions depending on capture state */}
        {!capturedImage && (
          <div className="p-6 bg-[#231C07] border-t border-[#392A16] flex items-center justify-around">
            {/* Choose file helper */}
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 bg-[#392A16] hover:bg-[#634133] text-[#DECDBC] hover:text-white rounded-full border border-[#634133] transition-all cursor-pointer"
              title="Upload file"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Main Trigger */}
            <button
              onClick={error ? capturePreset : capture}
              className="w-18 h-18 rounded-full border-[5px] border-[#392A16] bg-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center group shrink-0 cursor-pointer"
              title="Snap shot"
            >
              <div className="w-11 h-11 bg-[#231C07] rounded-full group-hover:bg-[#392A16] transition-colors flex items-center justify-center">
                <div className="w-7 h-7 bg-white rounded-full" />
              </div>
            </button>

            {/* Switch camera (if streaming) */}
            <button
              onClick={switchCamera}
              disabled={!!error}
              className="p-3.5 bg-[#392A16] hover:bg-[#634133] disabled:opacity-30 disabled:pointer-events-none text-[#DECDBC] hover:text-white rounded-full border border-[#634133] transition-all cursor-pointer"
              title="Flip lens"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
