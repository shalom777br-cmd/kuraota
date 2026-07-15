import React, { useState } from "react";
import { User } from "../types";
import { Mail, Lock, User as UserIcon, Shield, Chrome, Sparkles, AlertCircle, X, Check, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

interface LocalAccount {
  id?: string;
  email: string;
  passwordHash: string; // Plain-text logic in local storage for simulation
  name: string;
  role: string;
  avatar: string;
  favoriteComposers?: string[];
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("クラシック愛好家");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Google Login Simulation States
  const [showGoogleSim, setShowGoogleSim] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");

  if (!isOpen) return null;

  // Helper to generate a stable, persistent ID from email to prevent dynamic IDs on every login
  const getStableId = (userEmail: string, prefix = "user") => {
    const cleaned = userEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    return `${prefix}-${cleaned}`;
  };

  // Preset google accounts to choose from or type custom
  const googlePresets = [
    {
      name: "クラシックを愛するリスナー",
      email: "listener@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
      role: "ピアノ曲愛好家 / リスナー"
    },
    {
      name: "バイオリン初心者",
      email: "violin.classic@gmail.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120",
      role: "弦楽器の響きが好き"
    }
  ];

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("メールアドレスとパスワードを入力してください。");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上で設定してください。");
      return;
    }

    const accountsKey = "lharmonie_registered_accounts";
    const existingAccounts: LocalAccount[] = JSON.parse(localStorage.getItem(accountsKey) || "[]");

    if (isSignUp) {
      // Sign Up process
      if (!name) {
        setError("お名前（ニックネーム）を入力してください。");
        return;
      }

      const alreadyExists = existingAccounts.some((acc) => acc.email.toLowerCase() === email.toLowerCase());
      if (alreadyExists) {
        setError("このメールアドレスは既に登録されています。");
        return;
      }

      const randomAvatars = [
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=120",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120"
      ];
      const selectedAvatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

      const stableId = getStableId(email);
      const newAccount: LocalAccount = {
        id: stableId,
        email,
        passwordHash: password, // For client-side demo
        name,
        role: role || "クラシック愛好家",
        avatar: selectedAvatar,
        favoriteComposers: []
      };

      existingAccounts.push(newAccount);
      localStorage.setItem(accountsKey, JSON.stringify(existingAccounts));

      setSuccess("アカウント登録に成功しました！ログインしています...");
      setTimeout(() => {
        onLoginSuccess({
          id: newAccount.id || stableId,
          name: newAccount.name,
          avatar: newAccount.avatar,
          role: newAccount.role,
          favoriteComposers: []
        });
        onClose();
      }, 1200);

    } else {
      // Log In process
      const accountIndex = existingAccounts.findIndex(
        (acc) => acc.email.toLowerCase() === email.toLowerCase() && acc.passwordHash === password
      );

      // Check default fallback simulation account
      if (accountIndex === -1 && email === "admin@gmail.com" && password === "password123") {
        setSuccess("デモ管理者としてログインしました。");
        
        const adminId = "user-admin";
        let adminAccount = existingAccounts.find((acc) => acc.id === adminId);
        if (!adminAccount) {
          adminAccount = {
            id: adminId,
            email: "admin@gmail.com",
            passwordHash: "password123",
            name: "L'harmonie管理者",
            avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120",
            role: "アンサンブル指導者 / 全般クラシック研究家",
            favoriteComposers: ["beethoven", "bach"]
          };
          existingAccounts.push(adminAccount);
          localStorage.setItem(accountsKey, JSON.stringify(existingAccounts));
        }

        setTimeout(() => {
          onLoginSuccess({
            id: adminAccount!.id || adminId,
            name: adminAccount!.name,
            avatar: adminAccount!.avatar,
            role: adminAccount!.role,
            favoriteComposers: adminAccount!.favoriteComposers || ["beethoven", "bach"]
          });
          onClose();
        }, 1000);
        return;
      }

      if (accountIndex === -1) {
        setError("メールアドレスまたはパスワードが正しくありません。登録していない場合は「新規アカウント作成」をお選びください。");
        return;
      }

      const account = existingAccounts[accountIndex];
      // Generate ID if missing
      if (!account.id) {
        account.id = getStableId(account.email);
        existingAccounts[accountIndex] = account;
        localStorage.setItem(accountsKey, JSON.stringify(existingAccounts));
      }

      setSuccess("ログインに成功しました！");
      setTimeout(() => {
        onLoginSuccess({
          id: account.id!,
          name: account.name,
          avatar: account.avatar,
          role: account.role,
          favoriteComposers: account.favoriteComposers || []
        });
        onClose();
      }, 1000);
    }
  };

  const handleGoogleSelect = (name: string, email: string, avatar: string, role: string) => {
    setSuccess(`Googleアカウント「${name}」で接続しました！`);
    
    const accountsKey = "lharmonie_registered_accounts";
    const existingAccounts: LocalAccount[] = JSON.parse(localStorage.getItem(accountsKey) || "[]");
    
    const stableId = getStableId(email, "google");
    let account = existingAccounts.find((acc) => acc.id === stableId || acc.email.toLowerCase() === email.toLowerCase());
    
    if (!account) {
      account = {
        id: stableId,
        email,
        passwordHash: "google-oauth-sim",
        name,
        role,
        avatar,
        favoriteComposers: []
      };
      existingAccounts.push(account);
      localStorage.setItem(accountsKey, JSON.stringify(existingAccounts));
    } else {
      // Ensure it has ID
      if (!account.id) {
        account.id = stableId;
        localStorage.setItem(accountsKey, JSON.stringify(existingAccounts));
      }
    }

    setTimeout(() => {
      onLoginSuccess({
        id: account!.id || stableId,
        name: account!.name,
        avatar: account!.avatar,
        role: account!.role,
        favoriteComposers: account!.favoriteComposers || []
      });
      setShowGoogleSim(false);
      onClose();
    }, 1200);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleName || !customGoogleEmail) return;

    handleGoogleSelect(
      customGoogleName,
      customGoogleEmail,
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
      "Google接続メンバー"
    );
  };

  return (
    <>
      {/* Main Authentication Dialog */}
      <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-serif text-yellow-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-200" />
                {isSignUp ? "アカウント登録" : "サロンへログイン"}
              </h3>
              <p className="text-stone-400 text-3xs mt-1">
                {isSignUp ? "愛好家コミュニティに加わり、対話や感想の推敲を行いましょう" : "登録済みの情報でクラシックの世界にアクセス"}
              </p>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-200 p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Error & Success Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-red-200 text-2xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-emerald-200 text-2xs flex items-start gap-2">
              <Check className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400 animate-bounce" />
              <span>{success}</span>
            </div>
          )}

          {/* Social / Google Auth Trigger */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleGoogleSelect(
                "Shalom",
                "shalom777br@gmail.com",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120",
                "クラシック特別会員 (Google連携済)"
              )}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-stone-950 hover:bg-stone-900 border border-stone-800 text-stone-200 text-2xs font-semibold rounded-xl transition duration-200 shadow-md shadow-black/10 hover:border-yellow-200/40"
            >
              <Chrome className="w-4 h-4 text-red-400" />
              Google アカウントで自動ログイン (ワンタップ)
            </button>
            
            <div className="flex items-center gap-2 text-3xs text-stone-500 py-1">
              <div className="h-px bg-stone-850 flex-1"></div>
              <span>またはメールアドレスでログイン</span>
              <div className="h-px bg-stone-850 flex-1"></div>
            </div>
          </div>

          {/* Email Login/Register Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-1">
                  <label className="block text-[10px] text-stone-400 font-medium">お名前（ニックネーム）</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="例: ショパンの弟子"
                      className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-stone-400 font-medium">自己紹介 / 好きな楽器・作曲家</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="例: ピアノ練習中 / 印象主義好き"
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="block text-[10px] text-stone-400 font-medium">メールアドレス</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] text-stone-400 font-medium">パスワード</label>
                {!isSignUp && (
                  <span className="text-[10px] text-stone-500 hover:text-stone-400 cursor-pointer">
                    パスワードを忘れた場合
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl pl-9 pr-10 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <button
              type="submit"
              className="w-full py-2.5 bg-stone-950 border border-yellow-200/20 hover:bg-stone-900 text-yellow-100/90 font-semibold text-xs rounded-xl transition duration-200 shadow-md shadow-black/20"
            >
              {isSignUp ? "アカウントを新規登録" : "メールアドレスでログイン"}
            </button>
          </form>

          {/* Toggle Tab */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
                setSuccess("");
              }}
              className="text-3xs text-stone-400 hover:text-yellow-100 underline decoration-dashed underline-offset-4"
            >
              {isSignUp ? "すでにアカウントをお持ちですか？ ログイン画面へ" : "アカウントをお持ちでないですか？ 新規登録へ"}
            </button>
          </div>
        </div>
      </div>

      {/* Google Authenticator Simulation Pop-up dialog */}
      {showGoogleSim && (
        <div className="fixed inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-fadeIn">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-stone-850">
              <div className="flex items-center gap-2">
                <Chrome className="w-5 h-5 text-red-400" />
                <h4 className="text-xs font-semibold text-stone-100">Google でサインイン</h4>
              </div>
              <button onClick={() => setShowGoogleSim(false)} className="text-stone-400 hover:text-stone-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-stone-400 mb-4 leading-relaxed">
              L'harmonie Classique があなたのプロフィール情報（氏名、メールアドレス、アバター画像）を要求しています。接続するアカウントを選択してください。
            </p>

            {/* Preset List */}
            <div className="space-y-2 mb-5">
              {googlePresets.map((acc, index) => (
                <button
                  key={index}
                  onClick={() => handleGoogleSelect(acc.name, acc.email, acc.avatar, acc.role)}
                  className="w-full flex items-center gap-3 p-3 bg-stone-950 hover:bg-stone-850 rounded-2xl border border-stone-850 hover:border-stone-800 text-left transition duration-150"
                >
                  <img src={acc.avatar} alt={acc.name} className="w-8 h-8 rounded-full border border-stone-800" />
                  <div>
                    <h5 className="text-2xs font-semibold text-stone-200">{acc.name}</h5>
                    <p className="text-[9px] text-stone-500">{acc.email}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Google Account creation for absolute freedom */}
            <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 bg-stone-950/50 p-4 rounded-2xl border border-stone-850">
              <div className="flex items-center gap-1.5 text-3xs text-yellow-100 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>カスタムのGoogleアカウントでログイン</span>
              </div>
              <input
                type="text"
                required
                placeholder="Googleアカウント名（表示名）"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                className="w-full bg-stone-950 text-stone-200 border border-stone-800 rounded-xl px-2.5 py-1.5 text-[11px] outline-none"
              />
              <input
                type="email"
                required
                placeholder="Googleメールアドレス"
                value={customGoogleEmail}
                onChange={(e) => setCustomGoogleEmail(e.target.value)}
                className="w-full bg-stone-950 text-stone-200 border border-stone-800 rounded-xl px-2.5 py-1.5 text-[11px] outline-none"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-yellow-100 hover:bg-yellow-50 text-stone-950 font-bold text-3xs rounded-lg transition"
              >
                このGoogleアカウントで認証する
              </button>
            </form>

            <div className="mt-4 text-[9px] text-stone-500 text-center">
              Googleによる安全なデモログインシミュレータ。本物のAPIキーを使用せず、安全にブラウザ上で動作します。
            </div>
          </div>
        </div>
      )}
    </>
  );
}
