// API Response Types
export interface Recommendation {
  title: string;
  composer: string;
  era: string;
  description: string;
  movement: string;
}

export interface ReviewResponse {
  title: string;
  reviewText: string;
  highlight: string;
  suggestion: string;
}

export interface ComposerInfo {
  name: string;
  era: string;
  country: string;
  lifespan: string;
  biography: string;
  funFact: string;
  keyPieces: Array<{
    title: string;
    description: string;
  }>;
}

// Filter Types
export interface RecommendationFilters {
  mood?: string;
  instrument?: string;
  era?: string;
  customPrompt?: string;
}

// Form Types
export interface ReviewFormData {
  composer: string;
  piece: string;
  performanceDate: string;
  venue: string;
  performer: string;
  notes: string;
  rating: number;
}
