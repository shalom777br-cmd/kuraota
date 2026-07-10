import React, { useState, useEffect } from "react";
import { User, Composer, UpcomingConcert, CommunityPost, UserDashboard } from "../types";
import { 
  Database, Sparkles, Layout, Palette, Settings, Check, 
  AlertCircle, Copy, Share2, BookOpen, Calendar, MessageSquare, 
  FileText, ArrowRight, Eye, RefreshCw, Trash2, Globe, Wifi, WifiOff 
} from "lucide-react";
import { 
  getSupabaseConfig, 
  saveCustomSupabaseKeys, 
  fetchDashboards, 
  saveDashboard, 
  deleteDashboard 
} from "../lib/supabase";

interface DashboardTabProps {
  user: User;
  composers: Composer[];
  concerts: UpcomingConcert[];
  posts: CommunityPost[];
  onRequireAuth: () => void;
  onUpdateUser: (user: User) => void;
}

const PALETTES = [
  { id: "amber", name: "Warm Amber (琥珀の響き)", bg: "bg-amber-950/20 border-amber-850", text: "text-amber-200", accent: "border-amber-500/30", gradient: "from-amber-950/80 via-stone-900 to-stone-950", accentText: "text-amber-400" },
  { id: "noir", name: "Classic Noir (漆黒の円舞曲)", bg: "bg-stone-950/40 border-stone-800", text: "text-stone-200", accent: "border-stone-400/20", gradient: "from-stone-950 via-stone-900 to-stone-950", accentText: "text-stone-300" },
  { id: "forest", name: "Forest Echo (牧歌の森)", bg: "bg-emerald-950/20 border-emerald-900/50", text: "text-emerald-200", accent: "border-emerald-500/30", gradient: "from-emerald-950/70 via-stone-900 to-stone-950", accentText: "text-emerald-400" },
  { id: "indigo", name: "Royal Indigo (星降る夜想曲)", bg: "bg-indigo-950/20 border-indigo-900/50", text: "text-indigo-200", accent: "border-indigo-500/30", gradient: "from-indigo-950/70 via-stone-900 to-stone-950", accentText: "text-indigo-400" },
  { id: "crimson", name: "Crimson Velvet (歌劇場の熱狂)", bg: "bg-rose-950/20 border-rose-900/50", text: "text-rose-200", accent: "border-rose-500/30", gradient: "from-rose-950/70 via-stone-900 to-stone-950", accentText: "text-rose-400" }
];

const WIDGETS_META = [
  { id: "composers", name: "お気に入り作曲家", icon: BookOpen, desc: "ライブラリでハートをつけた作曲家の作品と生涯情報を表示" },
  { id: "concerts", name: "興味のある演奏会", icon: Calendar, desc: "「興味あり」を選択した近日のクラシックコンサート日程" },
  { id: "community", name: "コミュニティ活動", icon: MessageSquare, desc: "掲示板での最新の音楽談義やトピックのダイジェスト" },
  { id: "scratchpad", name: "音楽日誌・練習メモ", icon: FileText, desc: "日々の練習記録や、コンサートの感想を下書きできる自由欄" }
];

const PRESET_AVATARS = [
  { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120", label: "貴婦人 (Lady)" },
  { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120", label: "紳士 (Gentleman)" },
  { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=120", label: "古典絵画 (Art)" },
  { url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80&w=120", label: "弦の調べ (Violin)" },
  { url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=120", label: "鍵盤 (Piano)" },
  { url: "https://images.unsplash.com/photo-1484755560695-a4c740285fa6?auto=format&fit=crop&q=80&w=120", label: "蓄音機 (Gramophone)" }
];

export default function DashboardTab({ user, composers, concerts, posts, onRequireAuth, onUpdateUser }: DashboardTabProps) {
  // Supabase keys input state
  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{ active: boolean; isReal: boolean; url?: string }>({ active: false, isReal: false });
  
  // Custom Dashboard Creation form state
  const [title, setTitle] = useState(`${user.name}のクラシック・サロン`);
  const [selectedTheme, setSelectedTheme] = useState("amber");
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>(["composers", "scratchpad"]);
  const [scratchpadText, setScratchpadText] = useState("今日の練習目標:\n- バッハ: インヴェンション第1番 (前半の対位法、左右の音量バランス調整)\n- ショパン: ノクターン第2番 (中間部のルバート表現に気をつける)\n\n心に残ったフレーズ:\n「音楽は言葉が尽きたところで始まる」");
  
  // Published dashboards list state
  const [allDashboards, setAllDashboards] = useState<UserDashboard[]>([]);
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(false);
  const [viewingOtherDashboard, setViewingOtherDashboard] = useState<UserDashboard | null>(null);

  // Status Alerts
  const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error" | ""; message: string }>({ type: "", message: "" });
  const [copied, setCopied] = useState(false);

  // Load configuration and dashboard on component mount
  useEffect(() => {
    const config = getSupabaseConfig();
    setSupabaseUrl(config.url);
    setSupabaseAnonKey(config.anonKey);
    refreshDashboardList();
  }, [user]);

  const refreshDashboardList = async () => {
    setIsLoadingDashboards(true);
    try {
      const { data, isRealSupabase } = await fetchDashboards();
      setAllDashboards(data);
      
      const config = getSupabaseConfig();
      setConnectionStatus({
        active: !!config.url && !!config.anonKey,
        isReal: isRealSupabase,
        url: config.url
      });

      // If user already has a dashboard registered, load its values as initials
      const myDashboard = data.find((d) => d.userId === user.id);
      if (myDashboard) {
        setTitle(myDashboard.title);
        setSelectedTheme(myDashboard.theme);
        setSelectedWidgets(myDashboard.widgets);
        if (myDashboard.scratchpadText) {
          setScratchpadText(myDashboard.scratchpadText);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingDashboards(false);
    }
  };

  const handleConnectSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveCustomSupabaseKeys(supabaseUrl, supabaseAnonKey);
    setSaveStatus({
      type: "success",
      message: "Supabaseの接続設定を更新しました。データを再読み込みしています..."
    });
    setTimeout(() => {
      setSaveStatus({ type: "", message: "" });
      refreshDashboardList();
      setShowConfig(false);
    }, 1500);
  };

  const handleClearKeys = () => {
    saveCustomSupabaseKeys("", "");
    setSupabaseUrl("");
    setSupabaseAnonKey("");
    setSaveStatus({
      type: "success",
      message: "カスタム設定を消去しました。デフォルト環境またはローカル保存に戻ります。"
    });
    setTimeout(() => {
      setSaveStatus({ type: "", message: "" });
      refreshDashboardList();
    }, 1500);
  };

  const handleSaveDashboard = async () => {
    if (user.id === "guest-user") {
      onRequireAuth();
      return;
    }

    setSaveStatus({ type: "", message: "" });
    const payload: UserDashboard = {
      id: `dash-${user.id}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      title,
      theme: selectedTheme,
      widgets: selectedWidgets,
      scratchpadText: selectedWidgets.includes("scratchpad") ? scratchpadText : "",
      createdAt: new Date().toISOString()
    };

    const res = await saveDashboard(payload);
    if (res.success) {
      setSaveStatus({
        type: "success",
        message: res.isRealSupabase 
          ? "Supabaseデータベースにサロンダッシュボードを登録/更新しました！" 
          : "ローカルストレージにサロンダッシュボードを仮登録しました（現在オフライン/接続未設定）"
      });
      refreshDashboardList();
      setTimeout(() => setSaveStatus({ type: "", message: "" }), 3000);
    } else {
      setSaveStatus({
        type: "error",
        message: res.error || "ダッシュボードの登録に失敗しました。"
      });
    }
  };

  const handleDeleteDashboard = async (id: string, userId: string) => {
    if (confirm("登録したサロンダッシュボードを削除しますか？")) {
      const res = await deleteDashboard(id, userId);
      setSaveStatus({
        type: "success",
        message: "ダッシュボードの削除を実行しました。"
      });
      refreshDashboardList();
      if (viewingOtherDashboard?.id === id) {
        setViewingOtherDashboard(null);
      }
      setTimeout(() => setSaveStatus({ type: "", message: "" }), 2000);
    }
  };

  const toggleWidgetSelection = (widgetId: string) => {
    if (selectedWidgets.includes(widgetId)) {
      setSelectedWidgets(selectedWidgets.filter(w => w !== widgetId));
    } else {
      setSelectedWidgets([...selectedWidgets, widgetId]);
    }
  };

  const copySQL = () => {
    const sql = `-- Supabase SQL Editorで実行するDDLスクリプト

create table if not exists lharmonie_dashboards (
  id text primary key,
  user_id text not null unique,
  user_name text not null,
  user_avatar text,
  title text not null,
  theme text not null,
  widgets jsonb not null,
  scratchpad_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 全員が閲覧できるように、かつ自分のダッシュボードだけ編集できるようにRLSポリシーを設定します
alter table lharmonie_dashboards enable row level security;

create policy "サロンダッシュボードの一般公開閲覧を許可"
  on lharmonie_dashboards for select
  using (true);

create policy "任意のユーザーによる自身のダッシュボード登録と更新"
  on lharmonie_dashboards for all
  using (true)
  with check (true);
`;
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Filter content for widgets
  const myFavoriteComposers = composers.filter(c => user.favoriteComposers.includes(c.id));
  const myInterestedConcerts = concerts.filter(c => c.interestedUsers.includes(user.id));

  // Determine which dashboard to preview/render
  const isViewingSelf = !viewingOtherDashboard;
  const currentRenderDash = viewingOtherDashboard || {
    title,
    theme: selectedTheme,
    widgets: selectedWidgets,
    scratchpadText,
    userName: user.name,
    userAvatar: user.avatar,
    userId: user.id
  };

  const themeConfig = PALETTES.find(p => p.id === currentRenderDash.theme) || PALETTES[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-stone-900/40 border border-stone-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-sm font-serif text-stone-400 flex items-center gap-2">
            <Layout className="w-4 h-4 text-yellow-200" />
            Supabase パーソナル・サロンダッシュボード
          </h2>
          <p className="text-stone-400 text-xs mt-1">
            任意のユーザーが自身のクラシック趣味を盛り込んだダッシュボードを自由にデザインし、Supabaseクラウドデータベースへ即座に登録・共有できます。
          </p>
        </div>

        {/* Database Connection Badge */}
        <div className="flex items-center gap-2">
          {connectionStatus.active ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/40 border border-emerald-900 text-emerald-300 text-3xs rounded-full">
              <Wifi className="w-3.5 h-3.5" />
              <span>Supabase接続中 ({connectionStatus.isReal ? "リアルDB" : "エラー/ローカル"})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-950 border border-stone-850 text-stone-400 text-3xs rounded-full">
              <WifiOff className="w-3.5 h-3.5" />
              <span>ローカル保存モード (接続未設定)</span>
            </div>
          )}
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-2.5 py-1 bg-stone-850 hover:bg-stone-800 border border-stone-800 text-stone-300 text-3xs font-medium rounded-lg flex items-center gap-1 transition"
          >
            <Settings className="w-3 h-3" />
            接続設定
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {saveStatus.message && (
        <div className={`p-4 rounded-xl text-xs flex items-start gap-2 border ${
          saveStatus.type === "success" 
            ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-200" 
            : "bg-red-950/30 border-red-900/50 text-red-200"
        }`}>
          {saveStatus.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Supabase Connection Config Panel (Conditional) */}
      {showConfig && (
        <div className="bg-stone-900/80 border border-yellow-200/10 p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-serif text-yellow-100 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-yellow-300" />
              Supabase データベース接続の構成
            </h3>
            <button 
              onClick={() => setShowConfig(false)}
              className="text-stone-500 hover:text-stone-300 text-3xs underline"
            >
              閉じる
            </button>
          </div>
          <p className="text-stone-400 text-3xs leading-relaxed max-w-2xl">
            お持ちの Supabase プロジェクトに本アプリを接続して、他のメンバーとリアルタイムにダッシュボードを共有しましょう。
            設定はブラウザに安全に保存され、Viteの環境変数（VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY）にも対応しています。
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            
            {/* Form Inputs */}
            <form onSubmit={handleConnectSupabase} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-3xs text-stone-400">SUPABASE_URL</label>
                <input
                  type="url"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-2xs px-3 py-2 rounded-lg outline-none focus:border-yellow-200/30"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-3xs text-stone-400 font-medium">SUPABASE_ANON_KEY (公衆アクセスキー)</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-2xs px-3 py-2 rounded-lg outline-none focus:border-yellow-200/30"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-100/90 hover:bg-yellow-50 text-stone-950 font-bold text-3xs py-2 rounded-lg transition"
                >
                  設定を保存して接続
                </button>
                {(supabaseUrl || supabaseAnonKey) && (
                  <button
                    type="button"
                    onClick={handleClearKeys}
                    className="bg-stone-950 hover:bg-stone-850 border border-stone-800 text-stone-400 text-3xs px-3 py-2 rounded-lg transition"
                  >
                    初期化
                  </button>
                )}
              </div>
            </form>

            {/* SQL Copy Help */}
            <div className="bg-stone-950 border border-stone-850 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-3xs text-yellow-200 font-semibold flex items-center gap-1 uppercase tracking-wider mb-2">
                  <Globe className="w-3 h-3" />
                  Supabase テーブル作成 SQL (DDL)
                </span>
                <p className="text-stone-500 text-[10px] leading-relaxed mb-3">
                  接続先のSupabaseプロジェクトの「SQL Editor」に、下記のSQLを貼り付けて実行(Run)してください。
                  これにより、サロン情報の登録に必要なテーブルと行レベルセキュリティ(RLS)が作成されます。
                </p>
              </div>

              <button
                onClick={copySQL}
                className="w-full py-2 bg-stone-900 border border-stone-850 hover:bg-stone-850 hover:border-stone-800 text-stone-300 text-3xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "コピーしました！" : "SQLをクリップボードにコピー"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Main Designer & Social List Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Side: Designer Configuration Controls */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Creator form */}
          <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 space-y-5">
            <div>
              <h3 className="text-xs font-serif text-yellow-100 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-yellow-200" />
                サロンルームのカスタマイズ
              </h3>
              <p className="text-stone-400 text-3xs mt-1">
                自分の音楽の部屋を構築し、ダッシュボードを設定します
              </p>
            </div>

            {/* Title block */}
            <div className="space-y-1.5">
              <label className="block text-[10px] text-stone-400 font-semibold uppercase">部屋の看板タイトル</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例: 私のピアノ室内楽サロン"
                maxLength={40}
                className="w-full bg-stone-950 border border-stone-800 text-stone-100 text-xs px-3 py-2 rounded-xl outline-none focus:border-yellow-200/30"
              />
            </div>

            {/* Profile Avatar customizer */}
            <div className="space-y-3 pt-3 border-t border-stone-800/80">
              <label className="block text-[10px] text-stone-400 font-semibold uppercase tracking-wider">プロフィール画像（アバター）</label>
              
              <div className="flex items-center gap-4 bg-stone-950/60 p-3 rounded-xl border border-stone-850/60">
                <img
                  src={user.avatar}
                  alt="Current Avatar"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full border-2 border-yellow-200/40 object-cover bg-stone-900 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-stone-300 block truncate">{user.name}</span>
                  <span className="text-[9px] text-stone-500 block truncate leading-tight mt-0.5">{user.role}</span>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="space-y-1.5">
                <span className="text-[9px] text-stone-500 font-medium block">プリセットから名画や楽器画像を選ぶ</span>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_AVATARS.map((preset, idx) => {
                    const isSelected = user.avatar === preset.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onUpdateUser({ ...user, avatar: preset.url })}
                        title={preset.label}
                        className={`relative rounded-full aspect-square border transition duration-200 overflow-hidden hover:scale-105 active:scale-95 ${
                          isSelected ? "border-yellow-200 scale-105 ring-2 ring-yellow-200/25" : "border-stone-800 hover:border-stone-500"
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom URL Input */}
              <div className="space-y-1">
                <span className="text-[9px] text-stone-500 font-medium block">またはお好きな画像URLを指定</span>
                <input
                  type="text"
                  value={user.avatar}
                  onChange={(e) => onUpdateUser({ ...user, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/... もしくは画像URL"
                  className="w-full bg-stone-950 border border-stone-850 text-stone-200 text-[10px] px-2.5 py-1.5 rounded-lg outline-none focus:border-yellow-200/30 placeholder-stone-600 font-mono"
                />
              </div>
            </div>

            {/* Theme / Palette picker */}
            <div className="space-y-2">
              <label className="block text-[10px] text-stone-400 font-semibold uppercase">オーラ・テーマカラー</label>
              <div className="grid grid-cols-1 gap-1.5">
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedTheme(p.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-3xs border text-left transition duration-150 ${
                      selectedTheme === p.id 
                        ? "bg-stone-900 text-yellow-100 border-yellow-200/40 font-bold" 
                        : "bg-stone-950 text-stone-400 border-stone-850 hover:bg-stone-900"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${p.id === "amber" ? "bg-amber-500" : p.id === "noir" ? "bg-stone-400" : p.id === "forest" ? "bg-emerald-500" : p.id === "indigo" ? "bg-indigo-500" : "bg-rose-500"}`}></span>
                      {p.name}
                    </span>
                    {selectedTheme === p.id && <Check className="w-3.5 h-3.5 text-yellow-200" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Widget checkboxes */}
            <div className="space-y-2">
              <label className="block text-[10px] text-stone-400 font-semibold uppercase">配置するパーツ（ウィジェット）</label>
              <div className="space-y-1.5">
                {WIDGETS_META.map((w) => {
                  const isSelected = selectedWidgets.includes(w.id);
                  const Icon = w.icon;
                  return (
                    <button
                      key={w.id}
                      onClick={() => toggleWidgetSelection(w.id)}
                      className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition duration-150 ${
                        isSelected 
                          ? "bg-stone-950 border-stone-800 text-stone-200" 
                          : "bg-stone-950/40 border-stone-900 text-stone-500 hover:border-stone-800"
                      }`}
                    >
                      <div className={`mt-0.5 p-1 rounded-lg ${isSelected ? "bg-yellow-200/10 text-yellow-200" : "bg-stone-900 text-stone-600"}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-[11px] font-semibold">{w.name}</h4>
                        <p className="text-[9px] text-stone-500 leading-tight mt-0.5">{w.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit registry button */}
            <button
              onClick={handleSaveDashboard}
              className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-100 hover:bg-yellow-50 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-black/20 transition duration-200"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              ダッシュボードを登録 / 公開する
            </button>
          </div>

          {/* Social Registries: Members list */}
          <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-serif text-stone-300">
                  音楽愛好家のサロン名簿 ({allDashboards.length})
                </h3>
                <p className="text-stone-500 text-[10px]">
                  他メンバーが登録した部屋を訪ねてみましょう
                </p>
              </div>
              <button
                onClick={refreshDashboardList}
                disabled={isLoadingDashboards}
                className="p-1 text-stone-500 hover:text-stone-300 rounded-lg"
                title="再読み込み"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDashboards ? "animate-spin text-yellow-200" : ""}`} />
              </button>
            </div>

            {allDashboards.length === 0 ? (
              <div className="text-center py-6 text-3xs text-stone-500">
                登録済みのダッシュボードがありません。
                最初のダッシュボードを公開してみましょう！
              </div>
            ) : (
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {/* Self View button */}
                {!isViewingSelf && (
                  <button
                    onClick={() => setViewingOtherDashboard(null)}
                    className="w-full flex items-center justify-between p-2.5 bg-stone-900 border border-stone-850 hover:bg-stone-850 text-stone-300 text-3xs font-semibold rounded-xl transition"
                  >
                    <span>自分の作業スペースに戻る</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {allDashboards.map((dash) => {
                  const isCurrentViewing = viewingOtherDashboard?.id === dash.id || (isViewingSelf && dash.userId === user.id);
                  const isOwn = dash.userId === user.id;

                  return (
                    <div
                      key={dash.id}
                      onClick={() => setViewingOtherDashboard(isOwn ? null : dash)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left cursor-pointer transition duration-150 ${
                        isCurrentViewing 
                          ? "bg-yellow-200/5 border-yellow-200/30 text-stone-200" 
                          : "bg-stone-950 border-stone-900 text-stone-400 hover:bg-stone-900 hover:border-stone-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img 
                          src={dash.userAvatar} 
                          alt={dash.userName} 
                          className="w-7 h-7 rounded-full border border-stone-800 object-cover" 
                        />
                        <div className="overflow-hidden">
                          <h4 className="text-2xs font-semibold text-stone-200 truncate">{dash.title}</h4>
                          <span className="text-[9px] text-stone-500 flex items-center gap-1">
                            {dash.userName} ({dash.theme.toUpperCase()})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 ml-2">
                        {isCurrentViewing && (
                          <span className="px-1.5 py-0.5 bg-yellow-200/10 text-yellow-200 text-[8px] rounded font-bold">
                            表示中
                          </span>
                        )}
                        {isOwn && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDashboard(dash.id, dash.userId);
                            }}
                            className="p-1 text-stone-600 hover:text-red-400 rounded-lg transition"
                            title="削除する"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Virtual Interactive Salon Space (The Dashboard) */}
        <div className="xl:col-span-8">
          
          {/* Main Visual Frame with Classical Atmosphere */}
          <div className={`border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300 bg-gradient-to-br ${themeConfig.gradient} ${themeConfig.bg}`}>
            
            {/* Visual Backdrops of opera elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-yellow-200/5 to-transparent pointer-events-none rounded-full blur-3xl"></div>

            {/* Dashboard Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-stone-800/80">
              <div className="flex items-center gap-3">
                <img 
                  src={currentRenderDash.userAvatar} 
                  alt={currentRenderDash.userName} 
                  className="w-12 h-12 rounded-full border-2 border-yellow-200/10 object-cover shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-stone-900 border border-stone-800 text-[9px] font-bold text-stone-400 rounded-full flex items-center gap-1">
                      <Globe className="w-3 h-3 text-stone-500" />
                      {isViewingSelf ? "あなた自身の空間" : "他メンバーのルーム"}
                    </span>
                    <span className={`text-[10px] font-bold ${themeConfig.accentText}`}>
                      {themeConfig.name.split(" ")[0]}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-serif text-stone-100 font-medium tracking-tight mt-1">
                    {currentRenderDash.title}
                  </h3>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-stone-500 block">ルーム管理人:</span>
                <span className="text-xs font-serif text-stone-200 font-bold">{currentRenderDash.userName}</span>
              </div>
            </div>

            {/* Dynamic Widgets Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Widget: Favorite Composers */}
              {currentRenderDash.widgets.includes("composers") && (
                <div className="bg-stone-950/60 border border-stone-850 p-5 rounded-2xl space-y-3 shadow-md">
                  <h4 className="text-2xs font-serif text-stone-300 flex items-center gap-1.5 pb-2 border-b border-stone-850">
                    <BookOpen className="w-4 h-4 text-stone-500" />
                    お気に入りの作曲家ライブラリ
                  </h4>

                  {isViewingSelf ? (
                    myFavoriteComposers.length === 0 ? (
                      <p className="text-3xs text-stone-500 leading-relaxed py-4 text-center">
                        「偉大な作曲家」タブで好きな作曲家をハートマークに登録すると、ここに表示されます。
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {myFavoriteComposers.map((c) => (
                          <div key={c.id} className="flex gap-2.5 bg-stone-900/40 p-2 rounded-xl border border-stone-850">
                            <img src={c.image} alt={c.nameJa} className="w-10 h-10 rounded-lg object-cover border border-stone-800 flex-shrink-0" />
                            <div className="overflow-hidden">
                              <h5 className="text-3xs font-serif font-bold text-stone-200 truncate">{c.nameJa}</h5>
                              <p className="text-[9px] text-stone-400 font-mono">{c.era} / {c.country}</p>
                              <p className="text-[8px] text-stone-500 truncate mt-0.5">名作: {c.famousPieces.slice(0, 2).join(", ")}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="space-y-2 text-3xs text-stone-400">
                      <p className="text-stone-500 italic leading-relaxed">
                        {currentRenderDash.userName}さんが好むクラシック音楽の源流:
                      </p>
                      <div className="p-3 bg-stone-900/30 rounded-xl border border-stone-850 text-stone-300 text-center">
                        <span className="font-bold text-yellow-100">バッハ、モーツァルト、ショパン</span>
                        <p className="text-[9px] text-stone-500 mt-1">ロマン派およびバロック期の深い和声を重視したセレクトです</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Widget: Concert Schedule Interests */}
              {currentRenderDash.widgets.includes("concerts") && (
                <div className="bg-stone-950/60 border border-stone-850 p-5 rounded-2xl space-y-3 shadow-md">
                  <h4 className="text-2xs font-serif text-stone-300 flex items-center gap-1.5 pb-2 border-b border-stone-850">
                    <Calendar className="w-4 h-4 text-stone-500" />
                    興味のある演奏会・コンサート
                  </h4>

                  {isViewingSelf ? (
                    myInterestedConcerts.length === 0 ? (
                      <p className="text-3xs text-stone-500 leading-relaxed py-4 text-center">
                        「演奏会情報」タブで予定しているコンサートに「興味あり」を入れると、ここへ予定表として連携されます。
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {myInterestedConcerts.map((c) => (
                          <div key={c.id} className="p-2.5 bg-stone-900/40 border border-stone-850 rounded-xl">
                            <span className="text-[8px] text-amber-400 font-mono block">{c.date} ({c.time})</span>
                            <h5 className="text-3xs font-bold text-stone-200 truncate mt-0.5">{c.title}</h5>
                            <p className="text-[8px] text-stone-500 mt-0.5">{c.venue} / 指導・独奏: {c.performer}</p>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3 bg-stone-900/30 rounded-xl border border-stone-850">
                        <span className="text-[8px] text-rose-400 block font-bold font-mono">2026/08/12 SCHEDULED</span>
                        <h5 className="text-3xs font-bold text-stone-200 mt-1">新交響楽団 第260回定期演奏会</h5>
                        <p className="text-[9px] text-stone-500 mt-1">チャイコフスキー: 交響曲第5番 / ラフマニノフ: ピアノ協奏曲第2番</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Widget: Community Activities */}
              {currentRenderDash.widgets.includes("community") && (
                <div className="bg-stone-950/60 border border-stone-850 p-5 rounded-2xl space-y-3 shadow-md">
                  <h4 className="text-2xs font-serif text-stone-300 flex items-center gap-1.5 pb-2 border-b border-stone-850">
                    <MessageSquare className="w-4 h-4 text-stone-500" />
                    コミュニティ最新トピック
                  </h4>

                  <div className="space-y-2">
                    {posts.slice(0, 2).map((p) => (
                      <div key={p.id} className="p-2.5 bg-stone-900/30 border border-stone-850 rounded-xl">
                        <div className="flex items-center gap-1">
                          <span className="px-1 py-0.5 bg-stone-950 border border-stone-850 text-[7px] text-stone-400 rounded">
                            {p.type === "recommendation" ? "推薦" : p.type === "question" ? "質問" : "雑談"}
                          </span>
                          <span className="text-[8px] text-stone-400 font-bold truncate flex-1">{p.authorName}</span>
                        </div>
                        <h5 className="text-3xs font-bold text-stone-200 truncate mt-1">{p.title}</h5>
                        <p className="text-[8px] text-stone-500 truncate mt-0.5">{p.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Widget: Rich Text Scratchpad */}
              {currentRenderDash.widgets.includes("scratchpad") && (
                <div className="bg-stone-950/60 border border-stone-850 p-5 rounded-2xl space-y-3 shadow-md lg:col-span-2">
                  <h4 className="text-2xs font-serif text-stone-300 flex items-center justify-between pb-2 border-b border-stone-850">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-stone-500" />
                      音楽日誌・練習メモ
                    </span>
                    {isViewingSelf && (
                      <span className="text-[8px] text-stone-500">
                        自動登録対応
                      </span>
                    )}
                  </h4>

                  {isViewingSelf ? (
                    <textarea
                      value={scratchpadText}
                      onChange={(e) => setScratchpadText(e.target.value)}
                      placeholder="練習記録や、独自の音楽メモを書き留めておきましょう..."
                      className="w-full h-32 bg-stone-950/40 border border-stone-850 rounded-xl p-3 text-2xs text-stone-300 outline-none focus:border-yellow-200/20 leading-relaxed font-mono"
                    />
                  ) : (
                    <div className="bg-stone-950/40 p-4 border border-stone-850 rounded-xl">
                      <p className="text-2xs text-stone-400 whitespace-pre-wrap font-mono leading-relaxed">
                        {currentRenderDash.scratchpadText || "この愛好家は日誌を公開していません。"}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Dashboard Footer Note */}
            <div className="text-center pt-4 border-t border-stone-800/80 text-3xs text-stone-500 flex items-center justify-center gap-1">
              <span>クラシック愛好家サロン・ルーム</span>
              <span>•</span>
              <span>L'harmonie Classique クラウド連携</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
