# Supabase Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase dashboard under Project Settings > API.

## Database Setup

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Run the migration in `supabase/migrations/001_init.sql`

This will create:
- `profiles` table - User profiles
- `reviews` table - Saved concert reviews
- `saved_recommendations` table - Saved music recommendations

## Authentication

Supabase authentication is already configured in the app. Users can:
- Sign up with email and password
- Sign in with email and password
- Sign out
- Update their profile

## Services

- `src/services/authService.ts` - Authentication functions
- `src/services/reviewService.ts` - Review management
- `src/hooks/useAuth.ts` - Auth state management hook
