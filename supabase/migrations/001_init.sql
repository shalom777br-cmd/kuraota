-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  avatar_url text,
  bio text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reviews table
CREATE TABLE reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  composer text NOT NULL,
  piece text NOT NULL,
  performance_date date,
  venue text,
  performer text,
  notes text,
  rating integer NOT NULL,
  review_title text NOT NULL,
  review_text text NOT NULL,
  highlight text NOT NULL,
  suggestion text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create saved recommendations table
CREATE TABLE saved_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  composer text NOT NULL,
  era text NOT NULL,
  description text NOT NULL,
  movement text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX reviews_user_id_idx ON reviews(user_id);
CREATE INDEX saved_recommendations_user_id_idx ON saved_recommendations(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles
CREATE POLICY "Users can read all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Reviews
CREATE POLICY "Users can read all reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Saved Recommendations
CREATE POLICY "Users can read all saved recommendations" ON saved_recommendations FOR SELECT USING (true);
CREATE POLICY "Users can insert their own saved recommendations" ON saved_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved recommendations" ON saved_recommendations FOR DELETE USING (auth.uid() = user_id);
