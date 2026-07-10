import React, { useState } from "react";
import { ConcertReview, User } from "../types";
import { Star, MessageSquare, ThumbsUp, Sparkles, MapPin, Calendar, Music, Send, Loader2, Plus, X, Heart, MessageCircle } from "lucide-react";

interface ReviewTabProps {
  reviews: ConcertReview[];
  user: User;
  onAddReview: (review: ConcertReview) => void;
  onLikeReview: (reviewId: string) => void;
}

export default function ReviewTab({ reviews, user, onAddReview, onLikeReview }: ReviewTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  
  // Review inputs
  const [composer, setComposer] = useState("");
  const [piece, setPiece] = useState("");
  const [performanceDate, setPerformanceDate] = useState("");
  const [venue, setVenue] = useState("");
  const [performer, setPerformer] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState(""); // for AI draft notes

  // Suggestions from AI
  const [aiHighlight, setAiHighlight] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");

  const handleAiPolish = async () => {
    if (!composer || !piece || !notes) {
      alert("AI推敲機能を使用するには、作曲家名、演奏曲名、そして『メモ・感想』の入力が必要です。");
      return;
    }
    setAiLoading(true);
    try {
      const response = await fetch("/api/review-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          composer,
          piece,
          performanceDate,
          venue,
          performer,
          notes,
          rating
        })
      });
      if (!response.ok) throw new Error("推敲に失敗しました");
      const data = await response.json();
      
      setTitle(data.title || "");
      setReviewText(data.reviewText || "");
      setAiHighlight(data.highlight || "");
      setAiSuggestion(data.suggestion || "");
    } catch (err) {
      console.error(err);
      alert("AI推敲中にエラーが発生しました。");
    } finally {
      setAiLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composer || !piece || !title || !reviewText) {
      alert("すべての必須項目を入力してください。");
      return;
    }

    const newReview: ConcertReview = {
      id: "review-" + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      composer,
      piece,
      performanceDate,
      venue,
      performer,
      rating,
      title,
      reviewText: reviewText + (aiSuggestion ? `\n\n【関連推薦】\n${aiSuggestion}` : ""),
      createdAt: new Date().toISOString(),
      likes: 0,
      commentsCount: 0
    };

    onAddReview(newReview);
    
    // Reset state
    setComposer("");
    setPiece("");
    setPerformanceDate("");
    setVenue("");
    setPerformer("");
    setRating(5);
    setReviewText("");
    setTitle("");
    setNotes("");
    setAiHighlight("");
    setAiSuggestion("");
    setShowAddModal(false);
  };

  return (
    <div id="review-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-stone-900/40 border border-stone-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-serif text-yellow-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-yellow-200" />
            演奏会レヴュー・フォーラム
          </h2>
          <p className="text-stone-400 text-xs mt-1">
            あなたが足を運んだクラシックコンサートの音響、解釈、感動を言葉にし、仲間と語り合いましょう。
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 border border-yellow-200/20 hover:bg-stone-850 text-yellow-100/90 font-semibold text-xs rounded-xl transition duration-200 shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4" />
          レヴューを投稿する (AI執筆支援)
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-stone-900/70 border border-stone-800 rounded-2xl p-6 hover:border-yellow-200/20 transition duration-300 flex flex-col justify-between">
            <div>
              {/* Review Header */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={r.authorAvatar}
                  alt={r.authorName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-stone-800 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-stone-200 text-xs font-semibold">{r.authorName}</h4>
                  <p className="text-stone-500 text-3xs">{new Date(r.createdAt).toLocaleDateString("ja-JP")}</p>
                </div>
                <div className="flex text-yellow-200">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-3.5 h-3.5"
                      fill={idx < r.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>

              {/* Concert info sub-bar */}
              <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-850/80 text-3xs space-y-1.5 mb-4 text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-yellow-200/80 flex-shrink-0" />
                  <span className="truncate"><strong>{r.composer}</strong> : {r.piece}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-stone-500 flex-shrink-0" />
                  <span className="truncate">{r.performer}</span>
                </div>
                <div className="flex items-center justify-between text-4xs text-stone-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.venue}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.performanceDate}</span>
                </div>
              </div>

              {/* Review Title & Text */}
              <h3 className="text-yellow-100 font-serif text-sm font-semibold mb-2">
                {r.title}
              </h3>
              <p className="text-stone-300 text-xs leading-relaxed whitespace-pre-wrap line-clamp-6">
                {r.reviewText}
              </p>
            </div>

            {/* Social footer */}
            <div className="flex items-center justify-between border-t border-stone-800/80 pt-4 mt-4">
              <button
                onClick={() => onLikeReview(r.id)}
                className={`flex items-center gap-1.5 text-3xs transition ${
                  r.hasLiked ? "text-rose-400 font-medium" : "text-stone-400 hover:text-rose-400"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" fill={r.hasLiked ? "currentColor" : "none"} />
                <span>{r.likes} 役に立った</span>
              </button>
              
              <div className="flex items-center gap-1.5 text-3xs text-stone-500">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{r.commentsCount} コメント</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Concert Review Modal with Gemini Support */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif text-yellow-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-200" />
                コンサートレヴュー作成
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">作曲家名 (必須)</label>
                  <input
                    type="text"
                    required
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: グスタフ・マーラー"
                  />
                </div>
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">プログラム/演奏曲 (必須)</label>
                  <input
                    type="text"
                    required
                    value={piece}
                    onChange={(e) => setPiece(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: 交響曲第5番 嬰ハ短調"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">演奏者 / 楽団 / 指揮</label>
                  <input
                    type="text"
                    value={performer}
                    onChange={(e) => setPerformer(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: 指揮: カラヤン / ベルリンフィル"
                  />
                </div>
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">コンサート会場 / ホール</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: サントリーホール"
                  />
                </div>
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">公演日</label>
                  <input
                    type="date"
                    value={performanceDate}
                    onChange={(e) => setPerformanceDate(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-1.5">
                <span className="text-2xs text-stone-400">総合評価 (星5段階):</span>
                <div className="flex text-yellow-200">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      className="p-1 hover:scale-110 transition duration-150"
                    >
                      <Star
                        className="w-5 h-5"
                        fill={starValue <= rating ? "currentColor" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Gemini Section */}
              <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-yellow-100">
                    🪄 AIレヴュー推敲機能 (Rédacteur d'Harmonie)
                  </label>
                  <button
                    type="button"
                    onClick={handleAiPolish}
                    disabled={aiLoading}
                    className="flex items-center gap-1 px-3 py-1.5 bg-yellow-200/5 hover:bg-yellow-200/10 border border-yellow-200/20 text-yellow-100 hover:text-yellow-50 font-medium text-2xs rounded-lg transition disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    AIに推敲してもらう
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mb-3 leading-relaxed">
                  箇条書きの短い感想やメモを入力してボタンを押すと、AIがクラシック音楽の批評に相応しい洗練された音楽用語を交え、感動が伝わる文章とタイトルを自動作成します。
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-900 text-stone-200 border border-stone-700 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none resize-none"
                  placeholder="例: 第3楽章のアダージョが本当に涙が出るほど美しかった。会場の響きは最高だったが、隣の人の咳が少し気になった。"
                />
              </div>

              {/* Output Fields */}
              <div className="space-y-3 pt-3 border-t border-stone-800">
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">レヴューのタイトル (必須)</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2.5 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="公演を一言で言い表す印象的なタイトル"
                  />
                </div>

                <div>
                  <label className="block text-2xs text-stone-400 mb-1">レヴュー本文 (必須)</label>
                  <textarea
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={6}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none resize-none"
                    placeholder="コンサートの感想、演奏の素晴らしさ、ホールの響きなどを自由に綴ってください。"
                  />
                </div>

                {aiHighlight && (
                  <div className="p-3 bg-stone-950/40 rounded-xl border border-yellow-200/10 text-2xs">
                    <span className="text-yellow-100 font-medium block mb-1">💡 AIが抽出したコンサートの一押しハイライト</span>
                    <p className="text-stone-300 leading-relaxed">{aiHighlight}</p>
                  </div>
                )}
                
                {aiSuggestion && (
                  <div className="p-3 bg-stone-950/40 rounded-xl border border-stone-800 text-2xs">
                    <span className="text-yellow-100 font-medium block mb-1">💿 関連するおすすめの録音・アルバム</span>
                    <p className="text-stone-300 leading-relaxed">{aiSuggestion}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200 transition"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-950 border border-yellow-200/20 hover:bg-stone-900 text-yellow-100/90 font-semibold text-xs rounded-xl transition shadow-md shadow-black/20"
                >
                  レヴューを公開する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Helper UserCheck to satisfy the TypeScript compiler inside ReviewTab
function UserCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}
