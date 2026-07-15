import React, { useState, useRef } from "react";
import { User } from "../types";
import { X, Camera, Check, Sparkles, Image as ImageIcon, Upload } from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const PRESET_AVATARS = [
  { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120", label: "貴婦人 (Lady)" },
  { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120", label: "紳士 (Gentleman)" },
  { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=120", label: "古典絵画 (Art)" },
  { url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=120", label: "弦の調べ (Violin)" },
  { url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=120", label: "鍵盤 (Piano)" },
  { url: "https://images.unsplash.com/photo-1484755560695-a4c740285fa6?auto=format&fit=crop&q=80&w=120", label: "蓄音機 (Gramophone)" },
  { url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=120", label: "管弦楽団 (Orchestra)" },
  { url: "https://images.unsplash.com/photo-1453733190148-c44698c26578?auto=format&fit=crop&q=80&w=120", label: "楽譜 (Sheet Music)" }
];

export default function ProfileEditModal({ isOpen, onClose, user, onUpdateUser }: ProfileEditModalProps) {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdateUser({
      ...user,
      name: name.trim(),
      avatar: avatarUrl
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1500);
  };

  const processFile = (file: File) => {
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("画像ファイル（PNG、JPEG、WEBPなど）を選択してください。");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("ファイルサイズは5MB以下の画像にしてください。");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setUploadError("ファイルの読み込み中にエラーが発生しました。");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-850 pb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-yellow-200" />
            <h2 className="text-sm font-serif font-bold text-stone-100 tracking-wider">プロフィール設定</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-stone-300 p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Main Preview */}
          <div className="flex flex-col items-center justify-center space-y-3 py-2 bg-stone-950/40 rounded-xl border border-stone-850/50">
            <div className="relative group">
              <img
                src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"}
                alt="Avatar Preview"
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full border-2 border-yellow-200/40 object-cover bg-stone-900 shadow-md transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
                <Camera className="w-5 h-5 text-yellow-100/80" />
              </div>
            </div>
            <div className="text-center">
              <span className="text-3xs font-semibold text-yellow-200/80 tracking-wider uppercase bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800">
                {user.role}
              </span>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
              お名前 / ニックネーム
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="音楽愛好家"
              maxLength={20}
              className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-yellow-200/40 focus:ring-1 focus:ring-yellow-200/10 transition"
            />
          </div>

          {/* Local File Upload Picker (Drag & Drop or Manual Click) */}
          <div className="space-y-1.5">
            <label className="block text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
              ライブラリからアップロード
            </label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 bg-stone-950/20 hover:bg-stone-950/60 ${
                dragActive 
                  ? "border-yellow-200 bg-yellow-200/5 text-yellow-200" 
                  : "border-stone-800 hover:border-stone-750 text-stone-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Upload className="w-4 h-4 text-yellow-200/80 mb-1" />
              <p className="text-3xs font-medium text-stone-300">
                ドラッグ＆ドロップ、または <span className="text-yellow-200/90 font-semibold underline">ファイルを選択</span>
              </p>
              <p className="text-[9px] text-stone-500">
                PNG, JPEG, WEBPなど (5MB以下)
              </p>
            </div>
            {uploadError && (
              <p className="text-[10px] text-red-400 font-medium mt-1">{uploadError}</p>
            )}
          </div>

          {/* Avatar Presets Grid */}
          <div className="space-y-2">
            <label className="block text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
              または プリセットから選ぶ
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {PRESET_AVATARS.map((preset, idx) => {
                const isSelected = avatarUrl === preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    title={preset.label}
                    className={`relative rounded-full aspect-square border transition duration-200 overflow-hidden hover:scale-105 active:scale-95 ${
                      isSelected 
                        ? "border-yellow-200 scale-105 ring-2 ring-yellow-200/35" 
                        : "border-stone-800 hover:border-stone-600"
                    }`}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.label} 
                      referrerPolicy="no-referrer" 
                      className="w-full h-full object-cover" 
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-yellow-200 stroke-[3px]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Avatar URL Field */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                または お好きな画像URLを指定
              </label>
            </div>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... もしくは画像URL"
              className="w-full bg-stone-950 border border-stone-850 text-stone-300 text-[11px] px-3 py-2 rounded-xl outline-none focus:border-yellow-200/40 font-mono placeholder-stone-600"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-3 border-t border-stone-850">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-400 text-xs font-semibold rounded-xl transition duration-150"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={saveSuccess}
              className="flex-1 py-2.5 bg-yellow-100 hover:bg-yellow-50 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-black/20 transition duration-150 flex items-center justify-center gap-1.5 disabled:opacity-80"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3px]" />
                  変更を保存しました！
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  保存する
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
