import React, { useState, useEffect } from "react";
import { INITIAL_USER, INITIAL_COMPOSERS, INITIAL_REVIEWS, INITIAL_CONCERTS, INITIAL_POSTS } from "./data";
import { User, Composer, ConcertReview, UpcomingConcert, CommunityPost, Comment } from "./types";
import ComposerTab from "./components/ComposerTab";
import ReviewTab from "./components/ReviewTab";
import ConcertTab from "./components/ConcertTab";
import CommunityTab from "./components/CommunityTab";
import ConciergeTab from "./components/ConciergeTab";
import DashboardTab from "./components/DashboardTab";
import AuthModal from "./components/AuthModal";
import { Music, Calendar, BookOpen, MessageSquare, Compass, Sparkles, Heart, Award, CheckCircle, LogIn, LogOut, Layout } from "lucide-react";

export default function App() {
  // Load state from local storage or fallback to defaults
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem("lharmonie_user");
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [composers, setComposers] = useState<Composer[]>(() => {
    const saved = localStorage.getItem("lharmonie_composers");
    return saved ? JSON.parse(saved) : INITIAL_COMPOSERS;
  });

  const [reviews, setReviews] = useState<ConcertReview[]>(() => {
    const saved = localStorage.getItem("lharmonie_reviews");
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [concerts, setConcerts] = useState<UpcomingConcert[]>(() => {
    const saved = localStorage.getItem("lharmonie_concerts");
    return saved ? JSON.parse(saved) : INITIAL_CONCERTS;
  });

  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem("lharmonie_posts");
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [activeTab, setActiveTab] = useState<"composers" | "reviews" | "concerts" | "community" | "concierge" | "dashboard">("composers");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLogout = () => {
    setUser({
      id: "guest-user",
      name: "ゲスト愛好家",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
      role: "ログインして全ての機能を利用",
      favoriteComposers: []
    });
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  // Save state to local storage when changed
  useEffect(() => {
    localStorage.setItem("lharmonie_user", JSON.stringify(user));

    // Also sync back to registered accounts if they are logged in so their changes (like favorited composers) are fully persistent across sessions and logins
    if (user && user.id !== "guest-user") {
      const accountsKey = "lharmonie_registered_accounts";
      try {
        const existingAccounts = JSON.parse(localStorage.getItem(accountsKey) || "[]");
        let modified = false;
        const updatedAccounts = existingAccounts.map((acc: any) => {
          if (acc.id === user.id) {
            modified = true;
            return {
              ...acc,
              name: user.name,
              avatar: user.avatar,
              role: user.role,
              favoriteComposers: user.favoriteComposers
            };
          }
          return acc;
        });

        if (!modified && user.id === "user-me") {
          updatedAccounts.push({
            id: "user-me",
            email: "me@lharmonie.com",
            passwordHash: "default",
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            favoriteComposers: user.favoriteComposers
          });
        }

        localStorage.setItem(accountsKey, JSON.stringify(updatedAccounts));
      } catch (e) {
        console.error("Error saving registered user changes", e);
      }
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("lharmonie_composers", JSON.stringify(composers));
  }, [composers]);

  useEffect(() => {
    localStorage.setItem("lharmonie_reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("lharmonie_concerts", JSON.stringify(concerts));
  }, [concerts]);

  useEffect(() => {
    localStorage.setItem("lharmonie_posts", JSON.stringify(posts));
  }, [posts]);

  // Handle composer favorite/follow toggle
  const handleToggleFavoriteComposer = (composerId: string) => {
    setUser((prev) => {
      const isFav = prev.favoriteComposers.includes(composerId);
      const updatedFavs = isFav
        ? prev.favoriteComposers.filter((id) => id !== composerId)
        : [...prev.favoriteComposers, composerId];
      return { ...prev, favoriteComposers: updatedFavs };
    });
  };

  // Add a newly submitted or AI-generated composer to list
  const handleAddComposer = (newComposer: Composer) => {
    setComposers((prev) => [newComposer, ...prev]);
  };

  // Add concert review
  const handleAddReview = (newReview: ConcertReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  // Toggle "helpful" or like for review
  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const hasLiked = !r.hasLiked;
          return {
            ...r,
            likes: hasLiked ? r.likes + 1 : r.likes - 1,
            hasLiked,
          };
        }
        return r;
      })
    );
  };

  // Toggle interest in upcoming concert
  const handleToggleInterestConcert = (concertId: string) => {
    setConcerts((prev) =>
      prev.map((c) => {
        if (c.id === concertId) {
          const isInterested = c.interestedUsers.includes(user.id);
          const updatedUsers = isInterested
            ? c.interestedUsers.filter((id) => id !== user.id)
            : [...c.interestedUsers, user.id];
          return {
            ...c,
            interestedUsers: updatedUsers,
            interestedCount: updatedUsers.length,
          };
        }
        return c;
      })
    );
  };

  // Add a new upcoming concert to schedule
  const handleAddConcert = (newConcert: UpcomingConcert) => {
    setConcerts((prev) => [newConcert, ...prev]);
  };

  // Add new forum post
  const handleAddPost = (newPost: CommunityPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Like forum post
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            likes: hasLiked ? p.likes + 1 : p.likes - 1,
            hasLiked,
          };
        }
        return p;
      })
    );
  };

  // Add comment to forum post
  const handleAddComment = (postId: string, comment: Comment) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, comment],
          };
        }
        return p;
      })
    );
  };

  // Auto transition to review tab when clicking "Write Review Draft" from Concierge Recommendation
  const handleConciergeReviewDraftTransition = (composerName: string, pieceName: string) => {
    setActiveTab("reviews");
    // We can also trigger review form or pre-fill inside ReviewTab. We've structured it so they can just use this info
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 flex flex-col antialiased selection:bg-yellow-300/20 selection:text-yellow-100">
      
      {/* Visual Ambient Blur Backgrounds */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-yellow-950/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-stone-900/40 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Header / Branding Bar */}
      <header className="border-b border-stone-900 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-stone-900 border border-yellow-200/15 text-yellow-200/90 rounded-xl shadow-lg shadow-black/20">
              <Music className="w-5 h-5 text-yellow-200/80" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-stone-200 via-yellow-200/70 to-stone-300 leading-tight tracking-wider uppercase">
                L'harmonie Classique
              </h1>
              <p className="text-[10px] text-stone-500 font-serif tracking-wider uppercase mt-0.5">
                Salon de la Musique Classique
              </p>
            </div>
          </div>

          {/* User Status Card */}
          <div className="flex items-center gap-3">
            {user.id === "guest-user" ? (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-850 border border-yellow-200/20 text-yellow-100/90 font-serif font-medium text-xs rounded-xl transition duration-200 shadow-md shadow-black/20"
              >
                <LogIn className="w-3.5 h-3.5 text-yellow-200/80" />
                ログイン / 登録
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-stone-900/40 border border-stone-850 px-4 py-2 rounded-2xl max-w-xs">
                {/* Clickable Avatar to Dashboard */}
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="relative group focus:outline-none flex-shrink-0"
                  title="マイ・サロン (Supabaseダッシュボード) を開く"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-yellow-200/20 object-cover group-hover:scale-105 group-hover:border-yellow-200/60 transition duration-200"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-100 text-stone-950 rounded-full p-0.5 shadow-md shadow-black/40 group-hover:scale-110 transition duration-200">
                    <Layout className="w-2.5 h-2.5" />
                  </div>
                </button>

                {/* Clickable User Information to Dashboard */}
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="hidden sm:block text-left focus:outline-none group/text"
                  title="マイ・サロン (Supabaseダッシュボード) を開く"
                >
                  <span className="text-3xs font-semibold text-yellow-200/90 flex items-center gap-1 uppercase tracking-wider group-hover/text:text-yellow-100 transition">
                    <Award className="w-3 h-3" />
                    {user.role}
                  </span>
                  <span className="text-xs text-stone-200 font-medium truncate block max-w-[120px] group-hover/text:text-yellow-100 transition">{user.name}</span>
                </button>

                <div className="flex items-center gap-1.5 ml-1 border-l border-stone-800 pl-2">
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="text-[10px] text-stone-400 hover:text-stone-200 transition"
                    title="アカウントを切り替える"
                  >
                    切替
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-stone-400 hover:text-red-400 p-1 rounded-lg transition"
                    title="ログアウトする"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Hero Accent Section */}
      <section className="bg-stone-900/20 border-b border-stone-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-sm sm:text-base font-serif text-stone-400 font-medium">
                クラシックを愛する、すべての人へ。
              </h2>
              <p className="text-stone-400 text-xs mt-1 max-w-xl">
                L'harmonie Classique（ラルモニー・クラシック）は、素晴らしい作曲家の功績、胸を震わせた演奏会のレヴュー、そしてこれからのコンサート情報を共有する気品あるファンコミュニティです。
              </p>
            </div>
            
            {/* Quick Profile Stat */}
            <div className="flex items-center gap-6 text-3xs text-stone-500 bg-stone-950/40 p-4 rounded-xl border border-stone-900">
              <div className="space-y-0.5">
                <span className="block text-stone-500">フォロー中の作曲家</span>
                <span className="text-yellow-100 font-serif text-sm font-semibold">{user.favoriteComposers.length}</span>
              </div>
              <div className="w-px h-8 bg-stone-850" />
              <div className="space-y-0.5">
                <span className="block text-stone-500">投稿したレヴュー</span>
                <span className="text-stone-200 font-serif text-sm font-semibold">
                  {reviews.filter((r) => r.authorId === user.id).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-900 scrollbar-none">
          {[
            { id: "composers", label: "作曲家ライブラリ", icon: BookOpen },
            { id: "reviews", label: "演奏会レヴュー", icon: MessageSquare },
            { id: "concerts", label: "コンサート日程", icon: Calendar },
            { id: "community", label: "交流サロン (掲示板)", icon: Music },
            { id: "concierge", label: "AI コンシェルジュ", icon: Compass },
            { id: "dashboard", label: "マイ・サロン (Supabase)", icon: Layout },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-serif font-medium rounded-xl whitespace-nowrap transition duration-250 ${
                  isActive
                    ? "bg-yellow-200/5 text-yellow-100 border-b-2 border-yellow-200 shadow-md"
                    : "text-stone-400 hover:text-stone-200 hover:bg-stone-900/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-yellow-200/80" : "text-stone-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Contents */}
        <div className="space-y-6">
          {activeTab === "composers" && (
            <ComposerTab
              composers={composers}
              user={user}
              onToggleFavorite={handleToggleFavoriteComposer}
              onAddComposer={handleAddComposer}
              onRequireAuth={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewTab
              reviews={reviews}
              user={user}
              onAddReview={handleAddReview}
              onLikeReview={handleLikeReview}
              onRequireAuth={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === "concerts" && (
            <ConcertTab
              concerts={concerts}
              user={user}
              onToggleInterest={handleToggleInterestConcert}
              onAddConcert={handleAddConcert}
              onRequireAuth={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === "community" && (
            <CommunityTab
              posts={posts}
              user={user}
              onAddPost={handleAddPost}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onRequireAuth={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === "concierge" && (
            <ConciergeTab onAddReviewDraft={handleConciergeReviewDraftTransition} />
          )}

          {activeTab === "dashboard" && (
            <DashboardTab
              user={user}
              composers={composers}
              concerts={concerts}
              posts={posts}
              onRequireAuth={() => setIsAuthOpen(true)}
              onUpdateUser={(updatedUser) => setUser(updatedUser)}
            />
          )}
        </div>

      </main>

      {/* Elegant Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 py-10 mt-12 text-center text-stone-600 text-3xs font-serif tracking-widest uppercase">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© 2026 L'harmonie Classique. All Rights Reserved.</p>
          <p className="text-[10px] text-stone-700">芸術と和声が響きあう、美しいコミュニティのために</p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
