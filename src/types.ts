export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  favoriteComposers: string[]; // composer IDs
}

export interface Composer {
  id: string;
  nameJa: string;
  nameEn: string;
  era: string;
  country: string;
  lifespan: string;
  biography: string;
  funFact?: string;
  image: string;
  famousPieces: string[];
}

export interface ConcertReview {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  composer: string;
  piece: string;
  performanceDate: string;
  venue: string;
  performer: string;
  rating: number;
  title: string;
  reviewText: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
  hasLiked?: boolean;
}

export interface UpcomingConcert {
  id: string;
  title: string;
  composer: string;
  program: string;
  performer: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  submittedBy: string;
  interestedUsers: string[]; // User IDs who clicked "Interested"
  interestedCount: number;
  ticketLink?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  type: "general" | "recommendation" | "question" | "concert-news";
  title: string;
  content: string;
  composerId?: string;
  pieceName?: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
  hasLiked?: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface UserDashboard {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  theme: string;
  widgets: string[];
  scratchpadText?: string;
  createdAt: string;
}

export interface MusicRecommendation {
  title: string;
  composer: string;
  era: string;
  description: string;
  movement: string;
}
