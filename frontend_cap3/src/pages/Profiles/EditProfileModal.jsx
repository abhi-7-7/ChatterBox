import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Mail, User, MapPin, Globe, Shield, Upload, Loader2, AlertCircle, CheckCircle2, Pencil, MoreHorizontal, Trash2, Image as ImageIcon } from "lucide-react";

const inputBase = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.75 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-[0_0_0_4px_rgba(59,130,246,0.08)] placeholder:text-slate-400 transition";

const EditProfileModal = ({
  open,
  user,
  onClose,
  onSave,
  onAvatarUpload,
  onRemoveAvatar
}) => {
  const fileInputRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    location: "",
    website: "",
    role: "Member",
    avatarUrl: ""
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMenu, setAvatarMenu] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState(false);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropZoom, setCropZoom] = useState(1);
  const initialSnapshot = useRef(null);

  useEffect(() => {
    if (open && user) {
      const snapshot = {
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        location: user.location || "",
        website: user.website || "",
        role: user.role || "Member",
        avatarUrl: user.avatarUrl || ""
      };
      initialSnapshot.current = snapshot;
      setForm(snapshot);
      setErrors({});
      setIsDirty(false);
      setShowConfirm(false);
    }
  }, [open, user]);

  const handleClose = () => {
    setAvatarMenu(false);
    if (isDirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const markDirty = (updated) => {
    setForm(updated);
    if (!initialSnapshot.current) return;
    const dirty = Object.keys(updated).some((key) => updated[key] !== initialSnapshot.current[key]);
    setIsDirty(dirty);
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.username.trim()) next.username = "Username is required";
    if (form.username.trim() && form.username.trim().length < 3) next.username = "Username must be at least 3 characters";
    if (!form.email.trim()) next.email = "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email.trim() && !emailRegex.test(form.email.trim())) next.email = "Enter a valid email";
    if (form.website.trim()) {
      try {
        // eslint-disable-next-line no-new
        new URL(form.website.trim().startsWith("http") ? form.website.trim() : `https://${form.website.trim()}`);
      } catch {
        next.website = "Enter a valid URL";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      await onSave(form);
      setIsDirty(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, avatar: "Unsupported format. Use JPG, PNG, or WebP." }));
      return;
    }
    setErrors((prev) => ({ ...prev, avatar: undefined }));
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropZoom(1);
    setCropOpen(true);
    setAvatarMenu(false);
  };

  const handleCropSave = async () => {
    if (!cropSrc || !cropCanvasRef.current) return;
    const canvas = cropCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = cropSrc;
    await img.decode();
    const size = Math.min(img.width, img.height);
    const zoomed = size / cropZoom;
    const sxZoom = (img.width - zoomed) / 2;
    const syZoom = (img.height - zoomed) / 2;

    canvas.width = 512;
    canvas.height = 512;
    ctx.clearRect(0,0,512,512);
    ctx.drawImage(img, sxZoom, syZoom, zoomed, zoomed, 0, 0, 512, 512);

    await new Promise((resolve) => canvas.toBlob(async (blob) => {
      if (!blob) return resolve();
      const file = new File([blob], "avatar.webp", { type: 'image/webp' });
      setAvatarUploading(true);
      try {
        const url = await onAvatarUpload(file);
        const updated = { ...form, avatarUrl: url || "" };
        markDirty(updated);
      } finally {
        setAvatarUploading(false);
      }
      resolve();
    }, 'image/webp', 0.95));

    setCropOpen(false);
    URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const handleRemovePhoto = async () => {
    setRemoveConfirm(false);
    setAvatarUploading(true);
    try {
      const ok = await onRemoveAvatar();
      if (ok) {
        const updated = { ...form, avatarUrl: "" };
        markDirty(updated);
      }
    } finally {
      setAvatarUploading(false);
      setAvatarMenu(false);
    }
  };

  const avatarFallback = useMemo(() => {
    const src = form.fullName || form.username || "User";
    return src.charAt(0).toUpperCase();
  }, [form.fullName, form.username]);

  const avatarBg = useMemo(() => {
    const src = (form.username || form.fullName || "user").toLowerCase();
    let hash = 0;
    for (let i = 0; i < src.length; i++) hash = src.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 75%, 55%)`;
  }, [form.username, form.fullName]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity" onClick={handleClose} />

      <div
        className="relative w-full max-w-[560px] rounded-2xl bg-white shadow-[0_20px_60px_-24px_rgba(15,23,42,0.45)] overflow-hidden animate-[fadeIn_180ms_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-profile-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h2 id="edit-profile-title" className="text-[22px] font-semibold text-slate-900 tracking-tight">Edit Profile</h2>
            <p className="text-sm text-slate-500">Update your personal details</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-7">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-sm">
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: avatarBg }}>
                  {avatarFallback}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-white text-xs opacity-0 hover:opacity-100 transition" role="button" onClick={() => setAvatarMenu(true)} aria-label="Avatar actions">
                {avatarUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : (<><Upload className="w-4 h-4 mr-1" /> Change Photo</>)}
              </div>
              <button
                type="button"
                onClick={() => setAvatarMenu((v) => !v)}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:shadow-lg transition"
                aria-label="Edit photo"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
              {avatarMenu && (
                <div className="absolute z-20 right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-1 text-sm text-slate-700">
                  <button onClick={() => { setAvatarMenu(false); handleAvatarClick(); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"><Upload className="w-4 h-4" /> Upload New Photo</button>
                  <button onClick={() => { setAvatarMenu(false); handleAvatarClick(); }} className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2"><Upload className="w-4 h-4" /> Replace Photo</button>
                  <button onClick={() => { setRemoveConfirm(true); setAvatarMenu(false); }} className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Remove Photo</button>
                </div>
              )}
            </div>
            <div className="text-sm text-slate-500">
              <p className="font-semibold text-slate-800">Profile Photo</p>
              <p>Click to upload or replace your avatar.</p>
              {errors.avatar && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.avatar}</p>}
            </div>
          </div>

          {/* Name / Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-300" />
                <input
                  className={`${inputBase} pl-9`}
                  value={form.fullName}
                  onChange={(e) => markDirty({ ...form, fullName: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.fullName}</p>}
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Username</label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-300" />
                <input
                  className={`${inputBase} pl-9`}
                  value={form.username}
                  onChange={(e) => markDirty({ ...form, username: e.target.value })}
                  placeholder="Choose a unique username"
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.username}</p>}
            </div>
          </div>

          {/* Email (locked) */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-300" />
              <input
                className={`${inputBase} pl-9 bg-slate-50 text-slate-500 cursor-not-allowed`}
                value={form.email}
                disabled
                readOnly
              />
            </div>
            <p className="mt-1 text-[11px] text-amber-700 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Email is secured. Contact support if you need to update it.</p>
          </div>

          {/* Location / Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-300" />
                <input
                  className={`${inputBase} pl-9`}
                  value={form.location}
                  onChange={(e) => markDirty({ ...form, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block">Personal Website / Profile Link</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-300" />
                <input
                  className={`${inputBase} pl-9`}
                  value={form.website}
                  onChange={(e) => markDirty({ ...form, website: e.target.value })}
                  placeholder="https://your-site.com"
                />
              </div>
              {errors.website && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.website}</p>}
            </div>
          </div>

          {/* Role badge */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Role</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-slate-500" />
              {form.role || 'Member'}
            </span>
            <span className="text-xs text-slate-400">(read-only)</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving || avatarUploading || Object.keys(errors).length > 0}
            className={`px-5 py-2 rounded-lg text-white font-semibold transition flex items-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${isSaving || avatarUploading ? 'opacity-80' : ''}`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} 
            Save Changes
          </button>
        </div>
      </div>

      {/* Discard confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Discard unsaved changes?</h3>
                <p className="text-sm text-slate-600">You have unsaved edits. Keep editing or discard them.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                Keep Editing
              </button>
              <button
                onClick={() => { setShowConfirm(false); setIsDirty(false); onClose(); }}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove photo confirmation */}
      {removeConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Remove profile photo?</h3>
                <p className="text-sm text-slate-600">This will revert to your initials avatar.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRemoveConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemovePhoto}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Remove Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Crop modal */}
      {cropOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30" onClick={() => { if (cropSrc) URL.revokeObjectURL(cropSrc); setCropOpen(false); setCropSrc(null); }} />
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Crop Photo</h3>
                <p className="text-sm text-slate-500">Adjust zoom to fit your avatar square.</p>
              </div>
              <button onClick={() => { if (cropSrc) URL.revokeObjectURL(cropSrc); setCropOpen(false); setCropSrc(null); }} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 relative">
              {cropSrc && (
                <img
                  src={cropSrc}
                  alt="Crop preview"
                  className="w-full h-full object-cover"
                  style={{ transform: `scale(${cropZoom})` }}
                />
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Zoom</label>
              <input type="range" min="1" max="3" step="0.05" value={cropZoom} onChange={(e) => setCropZoom(Number(e.target.value))} className="w-full" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => { if (cropSrc) URL.revokeObjectURL(cropSrc); setCropOpen(false); setCropSrc(null); }} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button onClick={handleCropSave} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2" disabled={avatarUploading}>
                {avatarUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Crop
              </button>
            </div>
            <canvas ref={cropCanvasRef} className="hidden" />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfileModal;
