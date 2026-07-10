import React, { useState } from "react";
import { UpcomingConcert, User } from "../types";
import { Calendar, MapPin, Clock, Music, Heart, Plus, X, Users, Globe, ChevronRight } from "lucide-react";

interface ConcertTabProps {
  concerts: UpcomingConcert[];
  user: User;
  onToggleInterest: (concertId: string) => void;
  onAddConcert: (concert: UpcomingConcert) => void;
}

export default function ConcertTab({ concerts, user, onToggleInterest, onAddConcert }: ConcertTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [composer, setComposer] = useState("");
  const [program, setProgram] = useState("");
  const [performer, setPerformer] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [ticketLink, setTicketLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !composer || !performer || !venue || !date || !time) {
      alert("すべての必須項目を入力してください。");
      return;
    }

    const newConcert: UpcomingConcert = {
      id: "concert-" + Date.now(),
      title,
      composer,
      program: program || title,
      performer,
      venue,
      date,
      time,
      description: description || "この演奏会に関する詳細説明はまだ登録されていません。",
      submittedBy: user.name,
      interestedUsers: [],
      interestedCount: 0,
      ticketLink: ticketLink || undefined
    };

    onAddConcert(newConcert);

    // Reset fields
    setTitle("");
    setComposer("");
    setProgram("");
    setPerformer("");
    setVenue("");
    setDate("");
    setTime("");
    setDescription("");
    setTicketLink("");
    setShowAddForm(false);
  };

  return (
    <div id="concert-tab" className="space-y-6">
      {/* Tab Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-stone-900/40 border border-stone-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-serif text-yellow-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-200" />
            公演・コンサートカレンダー
          </h2>
          <p className="text-stone-400 text-xs mt-1">
            これから開催される注目のコンサート情報。気になる公演に「行きたい！」マークを付けて、SNSの仲間と共有しましょう。
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 border border-yellow-200/20 hover:bg-stone-850 text-yellow-100/90 font-medium text-xs rounded-xl transition duration-200 shadow-lg shadow-black/20"
        >
          <Plus className="w-4 h-4" />
          演奏会情報をシェアする
        </button>
      </div>

      {/* Add Concert Modal Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-2xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif text-yellow-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-yellow-200" />
                演奏会（コンサート）情報登録
              </h3>
              <button onClick={() => setShowAddForm(false)} className="text-stone-400 hover:text-stone-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-2xs text-stone-400 mb-1">演奏会タイトル・テーマ (必須)</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                  placeholder="例: 第100回定期演奏会『運命の扉』"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">主な作曲家 (必須)</label>
                  <input
                    type="text"
                    required
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: L.V.ベートーヴェン"
                  />
                </div>
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">演奏者（指揮、オーケストラ、独奏者） (必須)</label>
                  <input
                    type="text"
                    required
                    value={performer}
                    onChange={(e) => setPerformer(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: 指揮: 佐渡裕 / トーンキュンストラー管弦楽団"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs text-stone-400 mb-1">詳細プログラム・曲目</label>
                <input
                  type="text"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                  placeholder="例: ベートーヴェン:交響曲第5番『運命』、シューベルト:交響曲第7番『未完成』"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">会場 / ホール (必須)</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                    placeholder="例: 東京オペラシティ コンサートホール"
                  />
                </div>
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">開演日 (必須)</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-2xs text-stone-400 mb-1">開演時間 (必須)</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs text-stone-400 mb-1">演奏会の見どころ・紹介文</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none resize-none"
                  placeholder="演奏会の背景や、特に楽しみな点などを自由に書いてください。"
                />
              </div>

              <div>
                <label className="block text-2xs text-stone-400 mb-1">チケット購入先 / 公式詳細URL (任意)</label>
                <input
                  type="url"
                  value={ticketLink}
                  onChange={(e) => setTicketLink(e.target.value)}
                  className="w-full bg-stone-950 text-stone-100 border border-stone-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-200 outline-none"
                  placeholder="https://example.com/tickets"
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
                  className="px-5 py-2 bg-stone-950 border border-yellow-200/20 hover:bg-stone-900 text-yellow-100/90 font-medium text-xs rounded-xl transition shadow-md shadow-black/20"
                >
                  カレンダーに掲載する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Concert List */}
      <div className="space-y-4">
        {concerts.length === 0 ? (
          <div className="text-center py-12 text-stone-500">
            <Calendar className="w-12 h-12 text-stone-700 mx-auto mb-3" />
            <p className="text-xs font-serif">登録されている公演情報はありません。</p>
          </div>
        ) : (
          concerts.map((c) => {
            const isInterested = c.interestedUsers.includes(user.id);
            return (
              <div
                key={c.id}
                className="bg-stone-900/60 hover:bg-stone-900 border border-stone-800 rounded-2xl p-6 transition duration-300 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                {/* Left metadata */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap gap-2 items-center text-3xs">
                    <span className="bg-yellow-200/5 text-yellow-200 px-2 py-0.5 rounded-full font-serif border border-yellow-200/10">
                      {c.composer}
                    </span>
                    <span className="text-stone-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {c.date} {c.time} 開演
                    </span>
                  </div>

                  <h3 className="text-stone-100 font-serif font-semibold text-sm leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-stone-400 text-xs leading-relaxed max-w-2xl">
                    {c.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-3xs text-stone-500 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-stone-600 flex-shrink-0" />
                      <span className="truncate"><strong>演奏:</strong> {c.performer}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-600 flex-shrink-0" />
                      <span className="truncate"><strong>会場:</strong> {c.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Right interactions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 w-full lg:w-auto border-t lg:border-t-0 border-stone-800 pt-4 lg:pt-0">
                  <div className="flex items-center gap-1.5 text-3xs text-stone-400">
                    <Users className="w-4 h-4 text-yellow-200/80" />
                    <span>他 <strong>{c.interestedCount}</strong> 人が関心を持っています</span>
                  </div>

                  <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                    {c.ticketLink && (
                      <a
                        href={c.ticketLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-stone-800 hover:bg-stone-750 text-yellow-100 text-3xs rounded-xl font-medium border border-stone-700 transition"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        詳細・チケット
                      </a>
                    )}
                    <button
                      onClick={() => onToggleInterest(c.id)}
                      className={`flex-1 lg:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-3xs font-semibold rounded-xl transition duration-200 ${
                        isInterested
                          ? "bg-yellow-200/10 text-yellow-100 border border-yellow-200/40 font-bold"
                          : "bg-yellow-200/5 hover:bg-yellow-200/10 text-yellow-200 border border-yellow-200/25"
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" fill={isInterested ? "currentColor" : "none"} />
                      <span>{isInterested ? "行きたい！登録中" : "これから行きたい！"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
