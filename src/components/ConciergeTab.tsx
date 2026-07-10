import React, { useState } from "react";
import { MusicRecommendation } from "../types";
import { Sparkles, Music, Loader2, Compass, ArrowRight, Heart, Volume2 } from "lucide-react";

interface ConciergeTabProps {
  onAddReviewDraft?: (composer: string, piece: string) => void;
}

export default function ConciergeTab({ onAddReviewDraft }: ConciergeTabProps) {
  const [mood, setMood] = useState("peaceful");
  const [instrument, setInstrument] = useState("piano");
  const [era, setEra] = useState("romantic");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<MusicRecommendation[]>([]);
  const [error, setError] = useState("");

  const handleRecommend = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          instrument,
          era,
          prompt: customPrompt.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("推薦結果の取得に失敗しました。");
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (err: any) {
      console.error(err);
      setError("AIコンシェルジュが応答に失敗しました。しばらく時間をおいて再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const moods = [
    { id: "peaceful", label: "静穏・リラックス", emoji: "🌿" },
    { id: "energetic", label: "情熱・歓喜・エネルギッシュ", emoji: "🔥" },
    { id: "melancholic", label: "哀愁・悲痛・ロマンチック", emoji: "💧" },
    { id: "focus", label: "集中・知的探求", emoji: "📚" },
    { id: "mysterious", label: "神秘・幻想的", emoji: "✨" }
  ];

  const instruments = [
    { id: "piano", label: "ピアノ独奏・協奏曲" },
    { id: "strings", label: "ヴァイオリン・弦楽・室内楽" },
    { id: "orchestra", label: "大管弦楽・交響曲" },
    { id: "vocal", label: "オペラ・合唱・声楽" },
    { id: "organ", label: "パイプオルガン・古楽器" }
  ];

  const eras = [
    { id: "baroque", label: "バロック (バッハ、ヴィヴァルディ)" },
    { id: "classical", label: "古典派 (モーツァルト、ベートーヴェン)" },
    { id: "romantic", label: "ロマン派 (ショパン、シューマン、ブラームス)" },
    { id: "modern", label: "近代・印象派 (ドビュッシー、ラヴェル)" },
    { id: "contemporary", label: "現代・ミニマリズム (ライヒ、武満徹)" }
  ];

  return (
    <div id="concierge-tab" className="space-y-6">
      {/* Introduction Banner */}
      <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center gap-6">
        <div className="p-3.5 bg-yellow-200/5 border border-yellow-200/20 text-yellow-200 rounded-2xl flex-shrink-0 w-12 h-12 flex items-center justify-center">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-serif text-yellow-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-200" />
            AI コンシェルジュ・クラシック (Concierge Classique)
          </h2>
          <p className="text-stone-400 text-xs mt-1 leading-relaxed">
            「こんな気分の時に聴くべきクラシックは？」「次に聴くべき作品を探している...」
            音楽コンシェルジュが、あなたの気分、お好みの楽器、お好きな時代に合わせて至高の作品と必聴の楽章を推薦します。
          </p>
        </div>
      </div>

      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mood select */}
        <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl space-y-3">
          <h3 className="text-stone-300 text-xs font-serif font-medium flex items-center gap-1.5 border-b border-stone-800 pb-2">
            <span>① 現在の気分は？</span>
          </h3>
          <div className="space-y-2">
            {moods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-2xs transition font-medium ${
                  mood === m.id
                    ? "bg-yellow-200/10 border border-yellow-200/30 text-yellow-100"
                    : "bg-stone-950/40 border border-stone-850 text-stone-400 hover:bg-stone-950/70"
                }`}
              >
                <span>{m.label}</span>
                <span className="text-xs">{m.emoji}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Instrument select */}
        <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl space-y-3">
          <h3 className="text-stone-300 text-xs font-serif font-medium flex items-center gap-1.5 border-b border-stone-800 pb-2">
            <span>② 聴きたい楽器・形態は？</span>
          </h3>
          <div className="space-y-2">
            {instruments.map((ins) => (
              <button
                key={ins.id}
                onClick={() => setInstrument(ins.id)}
                className={`w-full text-left p-2.5 rounded-xl text-2xs transition font-medium ${
                  instrument === ins.id
                    ? "bg-yellow-200/10 border border-yellow-200/30 text-yellow-100"
                    : "bg-stone-950/40 border border-stone-850 text-stone-400 hover:bg-stone-950/70"
                }`}
              >
                {ins.label}
              </button>
            ))}
          </div>
        </div>

        {/* Era select */}
        <div className="bg-stone-900/60 border border-stone-800 p-5 rounded-2xl space-y-3">
          <h3 className="text-stone-300 text-xs font-serif font-medium flex items-center gap-1.5 border-b border-stone-800 pb-2">
            <span>③ 音楽の歴史的時代は？</span>
          </h3>
          <div className="space-y-2">
            {eras.map((e) => (
              <button
                key={e.id}
                onClick={() => setEra(e.id)}
                className={`w-full text-left p-2.5 rounded-xl text-2xs transition font-medium ${
                  era === e.id
                    ? "bg-yellow-200/10 border border-yellow-200/30 text-yellow-100"
                    : "bg-stone-950/40 border border-stone-850 text-stone-400 hover:bg-stone-950/70"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom query prompt */}
      <div className="bg-stone-900/40 border border-stone-800 p-5 rounded-2xl space-y-3">
        <label className="block text-2xs text-stone-400 font-medium">
          🍀 AIコンシェルジュへの個別のリクエスト（自由記入）
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="例: ラフマニノフの協奏曲第2番のように美しくてロマンチックで、オーケストラが盛り上がるピアノ曲をおすすめしてください。"
            className="flex-1 bg-stone-950 text-stone-200 border border-stone-800 rounded-xl px-4 py-3 text-xs focus:ring-1 focus:ring-yellow-200 outline-none placeholder-stone-600"
          />
          <button
            onClick={handleRecommend}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 border border-yellow-200/20 hover:bg-stone-850 text-yellow-100/90 font-bold text-xs rounded-xl transition duration-200 shadow-lg shadow-black/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            推薦を依頼する
          </button>
        </div>
      </div>

      {/* Recommendation Results */}
      {loading && (
        <div className="py-16 text-center space-y-3 bg-stone-900/20 border border-stone-800 rounded-2xl">
          <Loader2 className="w-8 h-8 text-yellow-200 animate-spin mx-auto" />
          <p className="text-xs font-serif text-yellow-100">AIコンシェルジュが極上の名曲をキュレーション中です...</p>
          <p className="text-[10px] text-stone-500">楽譜を紐解き、各楽曲の美学を分析しています。少々お待ちください。</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-950/30 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center">
          {error}
        </div>
      )}

      {!loading && recommendations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-stone-300 font-serif font-medium text-xs flex items-center gap-1.5">
              <Music className="w-4 h-4 text-yellow-200" />
              コンシェルジュ推薦：至極 of クラシック名曲 3選
            </h3>
            <span className="text-[10px] text-stone-500">
              ※各曲の詳細と名曲解説、聴きどころがまとまっています。
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-stone-900 border border-stone-800 rounded-2xl p-5 hover:border-yellow-200/30 transition duration-300 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] bg-yellow-200/5 text-yellow-200 px-2 py-0.5 rounded-full font-serif border border-yellow-200/15">
                      {rec.era}
                    </span>
                    <span className="text-stone-600 font-serif text-xs font-bold">#0{idx + 1}</span>
                  </div>

                  <div>
                    <h4 className="text-stone-100 font-serif font-semibold text-xs leading-snug">
                      {rec.title}
                    </h4>
                    <p className="text-stone-400 text-3xs mt-1">作曲家: {rec.composer}</p>
                  </div>

                  <p className="text-stone-300 text-xs leading-relaxed">
                    {rec.description}
                  </p>

                  <div className="p-3 bg-stone-950/50 rounded-xl border border-stone-850/80 space-y-1">
                    <span className="text-[10px] text-yellow-200 font-semibold flex items-center gap-1">
                      <Volume2 className="w-3.5 h-3.5" />
                      必聴の楽章・ハイライト
                    </span>
                    <p className="text-stone-400 text-xs leading-relaxed">
                      {rec.movement}
                    </p>
                  </div>
                </div>

                {onAddReviewDraft && (
                  <button
                    onClick={() => onAddReviewDraft(rec.composer, rec.title)}
                    className="w-full mt-5 py-2 bg-stone-800 hover:bg-stone-750 text-yellow-100 hover:text-yellow-50 text-3xs font-medium rounded-xl transition flex items-center justify-center gap-1.5 border border-stone-700/80"
                  >
                    この曲のレヴューの下書きを書く
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && recommendations.length === 0 && !error && (
        <div className="text-center py-16 bg-stone-900/10 border border-stone-850 border-dashed rounded-2xl text-stone-500">
          <Compass className="w-10 h-10 text-stone-700 mx-auto mb-3" />
          <p className="text-xs font-serif">気分、楽器、時代を選択して、「推薦を依頼する」ボタンを押してください。</p>
        </div>
      )}
    </div>
  );
}
