import React, { useState } from "react";
import { Composer, User } from "../types";
import { Search, Heart, Sparkles, BookOpen, Music, History, Plus, X, Globe, UserCheck, Loader2 } from "lucide-react";

interface ComposerTabProps {
  composers: Composer[];
  user: User;
  onToggleFavorite: (composerId: string) => void;
  onAddComposer: (newComposer: Composer) => void;
  onRequireAuth?: () => void;
}

export default function ComposerTab({ composers, user, onToggleFavorite, onAddComposer, onRequireAuth }: ComposerTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComposer, setSelectedComposer] = useState<Composer | null>(null);
  
  // Custom composer form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiError, setAiError] = useState("");

  const [manualName, setManualName] = useState("");
  const [manualEra, setManualEra] = useState("");
  const [manualCountry, setManualCountry] = useState("");
  const [manualLifespan, setManualLifespan] = useState("");
  const [manualBio, setManualBio] = useState("");
  const [manualPieces, setManualPieces] = useState(["", "", ""]);

  const filteredComposers = composers.filter((c) =>
    c.nameJa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.era.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchComposerFromAi = async () => {
    if (!aiQuery.trim()) {
      setAiError("作曲家名を入力してください。");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/composer-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ composerName: aiQuery }),
      });
      if (!response.ok) {
        throw new Error("AI情報の取得に失敗しました。");
      }
      const data = await response.json();
      
      // Auto fill manual form fields
      setManualName(data.name || aiQuery);
      setManualEra(data.era || "");
      setManualCountry(data.country || "");
      setManualLifespan(data.lifespan || "");
      setManualBio(data.biography || "");
      setManualPieces([
        data.keyPieces?.[0]?.title ? `${data.keyPieces[0].title} (${data.keyPieces[0].description})` : "",
        data.keyPieces?.[1]?.title ? `${data.keyPieces[1].title} (${data.keyPieces[1].description})` : "",
        data.keyPieces?.[2]?.title ? `${data.keyPieces[2].title} (${data.keyPieces[2].description})` : ""
      ]);
      
      // Keep a temporary funFact or bio
      if (data.funFact) {
        setManualBio(prev => `${prev}\n\n【エピソード】\n${data.funFact}`);
      }

    } catch (err: any) {
      console.error(err);
      setAiError("AIの解析中にエラーが発生しました。手動で入力するか、別の名前を試してください。");
    } finally {
      setAiLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName) return;

    const id = manualName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const newComp: Composer = {
      id: id || Date.now().toString(),
      nameJa: manualName,
      nameEn: aiQuery || manualName,
      era: manualEra || "不明",
      country: manualCountry || "不明",
      lifespan: manualLifespan || "不明",
      biography: manualBio || "詳細データはありません。",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=300", // fallback
      famousPieces: manualPieces.filter(p => p.trim() !== "")
    };

    onAddComposer(newComp);
    
    // reset form
    setManualName("");
    setManualEra("");
    setManualCountry("");
    setManualLifespan("");
    setManualBio("");
    setManualPieces(["", "", ""]);
    setAiQuery("");
    setShowAddForm(false);
  };

  return (
    <div id="composer-tab" className="space-y-6">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-stone-900/40 border border-stone-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-sm font-serif text-stone-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-stone-500" />
            偉大な作曲家ライブラリ
          </h2>
          <p className="text-stone-400 text-xs mt-1">
            お気に入りの作曲家を探してフォローしたり、新しい作曲家のトリビアを共有・学習できます。
          </p>
        </div>
        
        <button
          onClick={() => {
            if (user.id === "guest-user") {
              onRequireAuth?.();
            } else {
              setShowAddForm(true);
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 border border-yellow-200/20 hover:bg-stone-850 text-yellow-100/90 font-medium text-xs rounded-xl transition duration-200 shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4" />
          作曲家を新規登録 (AIアシスト対応)
        </button>
      </div>

      {/* Composer Add Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif text-yellow-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-200" />
                作曲家プロフィール追加
              </h3>
              <button onClick={() => setShowAddForm(false)} className="text-stone-400 hover:text-stone-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Assist Input */}
            <div className="mb-6 bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
              <label className="block text-xs font-medium text-yellow-100 mb-2">
                🌟 AIに作成してもらう (AIアシスト)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="例: ラフマニノフ、チャイコフスキー、ドヴォルザーク"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="flex-1 bg-stone-900 text-stone-100 border border-stone-700/80 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                />
                <button
                  type="button"
                  onClick={fetchComposerFromAi}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-yellow-200/5 hover:bg-yellow-200/10 border border-yellow-200/20 text-yellow-100 hover:text-yellow-50 font-medium text-xs rounded-xl transition disabled:opacity-50"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  AI入力
                </button>
              </div>
              {aiError && <p className="text-rose-400 text-2xs mt-2">{aiError}</p>}
              <p className="text-[10px] text-stone-500 mt-2">
                AIが自動で名前、活動期間、国籍、詳細な解説、主要な名曲3選を生成します。
              </p>
            </div>

            {/* Manual Edit Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">作曲家名 (必須)</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: セルゲイ・ラフマニノフ"
                  />
                </div>
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">活動時代/楽派</label>
                  <input
                    type="text"
                    value={manualEra}
                    onChange={(e) => setManualEra(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: 後期ロマン派"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">出身国</label>
                  <input
                    type="text"
                    value={manualCountry}
                    onChange={(e) => setManualCountry(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: ロシア"
                  />
                </div>
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">生没年</label>
                  <input
                    type="text"
                    value={manualLifespan}
                    onChange={(e) => setManualLifespan(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: 1873 - 1943"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs text-stone-400 mb-1">解説 / 逸話</label>
                <textarea
                  value={manualBio}
                  onChange={(e) => setManualBio(e.target.value)}
                  rows={4}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none resize-none"
                  placeholder="作曲家の生涯、性格、音楽史上の評価やエピソードを入力してください。"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-2xs text-stone-400">代表曲・おすすめ作品 (最大3つ)</label>
                {manualPieces.map((p, i) => (
                  <input
                    key={i}
                    type="text"
                    value={p}
                    onChange={(e) => {
                      const updated = [...manualPieces];
                      updated[i] = e.target.value;
                      setManualPieces(updated);
                    }}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder={`代表作 ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200 transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-950 border border-yellow-200/20 hover:bg-stone-900 text-yellow-100/90 font-medium text-xs rounded-xl transition shadow-md shadow-black/20"
                >
                  ライブラリに追加する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Panel with Search */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Composer list area (left side) */}
        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="作曲家名、英語名、楽派で絞り込む..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-900 text-stone-100 border border-stone-800 pl-10 pr-4 py-3 text-xs rounded-xl focus:ring-1 focus:ring-yellow-200 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredComposers.map((c) => {
              const isFavorite = user.favoriteComposers.includes(c.id);
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedComposer(c)}
                  className={`group p-4 bg-stone-900/60 hover:bg-stone-900 border ${
                    selectedComposer?.id === c.id ? "border-yellow-200/80 bg-stone-900" : "border-stone-800"
                  } rounded-2xl cursor-pointer transition duration-300 flex items-start gap-4`}
                >
                  <img
                    src={c.image}
                    alt={c.nameJa}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-stone-800 flex-shrink-0 group-hover:scale-105 transition duration-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[10px] bg-yellow-200/5 text-yellow-200 px-2 py-0.5 rounded-full font-serif border border-yellow-200/10">
                        {c.era}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (user.id === "guest-user") {
                            onRequireAuth?.();
                          } else {
                            onToggleFavorite(c.id);
                          }
                        }}
                        className={`p-1 rounded-full hover:bg-stone-800 transition ${
                          isFavorite ? "text-rose-500" : "text-stone-500"
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <h3 className="text-stone-100 font-serif font-medium text-xs mt-1.5 truncate">
                      {c.nameJa}
                    </h3>
                    <p className="text-stone-400 text-3xs truncate mt-0.5">{c.nameEn}</p>
                    <div className="flex items-center gap-2 mt-2 text-3xs text-stone-500">
                      <Globe className="w-3 h-3" />
                      <span>{c.country} ({c.lifespan})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Composer details area (right side) */}
        <div className="w-full md:w-80 flex-shrink-0">
          {selectedComposer ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sticky top-6 space-y-6">
              <div className="text-center relative">
                <img
                  src={selectedComposer.image}
                  alt={selectedComposer.nameJa}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-yellow-200/30 shadow-lg shadow-black/40"
                />
                
                {user.favoriteComposers.includes(selectedComposer.id) && (
                  <span className="absolute bottom-0 right-[35%] bg-rose-500 text-white p-1.5 rounded-full border border-stone-900 shadow-md">
                    <UserCheck className="w-3.5 h-3.5" />
                  </span>
                )}

                <h3 className="text-yellow-100 font-serif text-sm font-semibold mt-4">
                  {selectedComposer.nameJa}
                </h3>
                <p className="text-stone-400 text-3xs mt-0.5">{selectedComposer.nameEn}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-3xs bg-stone-950/40 p-3 rounded-xl border border-stone-800/80">
                <div className="space-y-0.5">
                  <span className="text-stone-500 block">楽派 / 時代</span>
                  <span className="text-yellow-100 font-medium">{selectedComposer.era}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-stone-500 block">出身国</span>
                  <span className="text-stone-200 font-medium">{selectedComposer.country}</span>
                </div>
                <div className="space-y-0.5 mt-2">
                  <span className="text-stone-500 block">活動期 (生没年)</span>
                  <span className="text-stone-200 font-medium">{selectedComposer.lifespan}</span>
                </div>
                <div className="space-y-0.5 mt-2">
                  <span className="text-stone-500 block">SNSフォロー</span>
                  <span className="text-stone-200 font-medium">
                    {user.favoriteComposers.includes(selectedComposer.id) ? "フォロー中" : "未フォロー"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-3xs text-yellow-100/90 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  バイオグラフィー・エピソード
                </h4>
                <p className="text-stone-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedComposer.biography}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-800/80">
                <h4 className="text-3xs text-yellow-100/90 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" />
                  代表作品・必聴の名盤
                </h4>
                <ul className="space-y-1.5">
                  {selectedComposer.famousPieces.map((piece, idx) => (
                    <li key={idx} className="text-stone-300 text-xs flex items-start gap-2">
                      <span className="text-yellow-200 font-bold font-serif text-3xs mt-1">0{idx + 1}.</span>
                      <span className="leading-snug">{piece}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  if (user.id === "guest-user") {
                    onRequireAuth?.();
                  } else {
                    onToggleFavorite(selectedComposer.id);
                  }
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition duration-200 ${
                  user.favoriteComposers.includes(selectedComposer.id)
                    ? "bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/40 text-rose-300"
                    : "bg-stone-850 hover:bg-stone-800 text-yellow-100 border border-stone-700"
                }`}
              >
                <Heart className="w-4 h-4" fill={user.favoriteComposers.includes(selectedComposer.id) ? "currentColor" : "none"} />
                {user.favoriteComposers.includes(selectedComposer.id) ? "フォローを解除" : "お気に入りに登録"}
              </button>
            </div>
          ) : (
            <div className="bg-stone-900/40 border border-stone-850 border-dashed rounded-2xl p-8 text-center text-stone-500 h-64 flex flex-col justify-center items-center">
              <Music className="w-8 h-8 text-stone-700 mb-2" />
              <p className="text-xs">作曲家を選択すると、詳細な解説や代表曲が表示されます。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
