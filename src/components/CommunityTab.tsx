import React, { useState } from "react";
import { CommunityPost, User, Comment } from "../types";
import { MessageSquare, ThumbsUp, Plus, X, Tag, Calendar, UserCheck, Music, Sparkles } from "lucide-react";

interface CommunityTabProps {
  posts: CommunityPost[];
  user: User;
  onAddPost: (post: CommunityPost) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, comment: Comment) => void;
  onRequireAuth?: () => void;
}

export default function CommunityTab({ posts, user, onAddPost, onLikePost, onAddComment, onRequireAuth }: CommunityTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"general" | "recommendation" | "question" | "concert-news">("general");

  // Comment input state dictionary
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost: CommunityPost = {
      id: "post-" + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: user.role,
      type,
      title,
      content,
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    onAddPost(newPost);
    setTitle("");
    setContent("");
    setType("general");
    setShowAddForm(false);
  };

  const handleCommentSubmit = (postId: string) => {
    if (user.id === "guest-user") {
      onRequireAuth?.();
      return;
    }
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: "comment-" + Date.now(),
      authorName: user.name,
      authorAvatar: user.avatar,
      content: text,
      createdAt: new Date().toISOString()
    };

    onAddComment(postId, newComment);
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  return (
    <div id="community-tab" className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-stone-900/40 border border-stone-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-serif text-yellow-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-yellow-200" />
            クラシック交流サロン (コミュニティ)
          </h2>
          <p className="text-stone-400 text-xs mt-1">
            愛聴盤の紹介、楽器の練習方法、作曲家の解釈など、あらゆるクラシック音楽のトピックで自由に歓談しましょう。
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
          スレッドを立ち上げる
        </button>
      </div>

      {/* Add Post Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-xl p-6 md:p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif text-yellow-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-200" />
                新規トピック投稿
              </h3>
              <button onClick={() => setShowAddForm(false)} className="text-stone-400 hover:text-stone-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="block text-2xs text-stone-400 mb-1">トピックタイプ (必須)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "general", label: "雑談", color: "bg-stone-850 hover:bg-stone-800 text-stone-300" },
                    { id: "recommendation", label: "名盤推薦", color: "bg-yellow-200/5 text-yellow-200 hover:bg-yellow-200/10" },
                    { id: "question", label: "質問・相談", color: "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20" },
                    { id: "concert-news", label: "公演ニュース", color: "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as any)}
                      className={`py-2 px-3 text-2xs font-semibold rounded-xl transition text-center border ${
                        type === t.id ? "border-yellow-200 bg-yellow-200/10 text-yellow-100" : "border-stone-800"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-2xs text-stone-400 mb-1">タイトル (必須)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                  placeholder="例: ラフマニノフのピアノ協奏曲第2番、皆さんの最高の名盤は？"
                />
              </div>

              <div>
                <label className="block text-2xs text-stone-400 mb-1">投稿内容 (必須)</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none resize-none"
                  placeholder="名盤の感想、演奏動画の紹介、解釈の疑問など自由に書き込んでください。"
                />
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
                  className="px-5 py-2.5 bg-stone-950 border border-yellow-200/20 hover:bg-stone-900 text-yellow-100/90 font-semibold text-xs rounded-xl transition shadow-md shadow-black/20"
                >
                  サロンに投稿する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((p) => {
          const typeLabels: Record<string, { label: string; style: string }> = {
            general: { label: "雑談", style: "bg-stone-800 text-stone-300" },
            recommendation: { label: "名盤推薦", style: "bg-yellow-200/5 text-yellow-200 border border-yellow-200/15" },
            question: { label: "質問・相談", style: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/15" },
            "concert-news": { label: "公演ニュース", style: "bg-teal-500/10 text-teal-400 border border-teal-500/15" }
          };

          const labelInfo = typeLabels[p.type] || { label: "その他", style: "bg-stone-800 text-stone-300" };

          return (
            <div key={p.id} className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 space-y-4">
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={p.authorAvatar}
                    alt={p.authorName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-stone-800 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-stone-200 text-xs font-semibold">{p.authorName}</h4>
                      <span className="text-[10px] text-stone-500 font-medium">{p.authorRole}</span>
                    </div>
                    <span className="text-stone-600 text-4xs block mt-0.5">
                      {new Date(p.createdAt).toLocaleString("ja-JP")}
                    </span>
                  </div>
                </div>
                
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${labelInfo.style}`}>
                  {labelInfo.label}
                </span>
              </div>

              {/* Post Body */}
              <div className="space-y-2">
                <h3 className="text-yellow-100 font-serif font-semibold text-sm leading-snug">
                  {p.title}
                </h3>
                <p className="text-stone-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {p.content}
                </p>
              </div>

              {/* Post Action bar */}
              <div className="flex items-center gap-4 text-3xs border-y border-stone-800/60 py-3 text-stone-500">
                <button
                  onClick={() => {
                    if (user.id === "guest-user") {
                      onRequireAuth?.();
                    } else {
                      onLikePost(p.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 transition ${
                    p.hasLiked ? "text-rose-400" : "hover:text-stone-300"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" fill={p.hasLiked ? "currentColor" : "none"} />
                  <span>{p.likes} いいね</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{p.comments.length} コメント</span>
                </div>
              </div>

              {/* Comments Area */}
              {p.comments.length > 0 && (
                <div className="space-y-3 pl-2 sm:pl-4 border-l border-stone-800 pt-1">
                  {p.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2.5 items-start text-xs bg-stone-950/20 p-2.5 rounded-xl border border-stone-850/60">
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full border border-stone-850 object-cover flex-shrink-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-300 text-2xs font-semibold">{comment.authorName}</span>
                          <span className="text-[9px] text-stone-600">
                            {new Date(comment.createdAt).toLocaleDateString("ja-JP")}
                          </span>
                        </div>
                        <p className="text-stone-400 text-2xs leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Input */}
              <div className="flex gap-2.5 items-center pt-1.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full border border-stone-800 object-cover flex-shrink-0"
                />
                <input
                  type="text"
                  placeholder="サロンで返信する..."
                  value={commentInputs[p.id] || ""}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [p.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCommentSubmit(p.id);
                  }}
                  className="flex-1 bg-stone-950 text-stone-200 border border-stone-800/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleCommentSubmit(p.id)}
                  className="p-2 bg-stone-800 hover:bg-stone-750 text-yellow-200 rounded-xl transition border border-stone-700"
                >
                  <Tag className="w-3.5 h-3.5 rotate-90" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
