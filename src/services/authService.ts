import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const authService = {
  // Sign up
  async signUp(email: string, password: string, displayName: string): Promise<{ userId: string; email: string }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to create user');

    // Create user profile
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: data.user.id,
        email,
        display_name: displayName,
      },
    ]);

    if (profileError) throw profileError;

    return { userId: data.user.id, email };
  },

  // Sign in
  async signIn(email: string, password: string): Promise<{ userId: string; email: string }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Failed to sign in');

    return { userId: data.user.id, email: data.user.email || '' };
  },

  // Sign out
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser(): Promise<{ userId: string; email: string } | null> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return { userId: data.user.id, email: data.user.email || '' };
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update user profile
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (userId: string | null, email: string | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback(session.user.id, session.user.email || null);
      } else {
        callback(null, null);
      }
    });
    return data?.subscription;
  },
};
