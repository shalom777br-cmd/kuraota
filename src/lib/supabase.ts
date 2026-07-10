import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { UserDashboard } from "../types";

// Dynamic configuration keys
const URL_STORAGE_KEY = "lharmonie_supabase_url";
const ANON_KEY_STORAGE_KEY = "lharmonie_supabase_anon_key";

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
}

/**
 * Gets the current Supabase configuration.
 * Prioritizes keys saved in localStorage (entered by user in UI),
 * then falls back to environment variables injected at build time.
 */
export function getSupabaseConfig(): SupabaseConfig {
  const customUrl = localStorage.getItem(URL_STORAGE_KEY) || "";
  const customAnonKey = localStorage.getItem(ANON_KEY_STORAGE_KEY) || "";

  if (customUrl && customAnonKey) {
    return {
      url: customUrl,
      anonKey: customAnonKey,
      isCustom: true
    };
  }

  // Fallback to environment variables if present
  const envUrl = import.meta.env.VITE_SUPABASE_URL || "";
  const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  return {
    url: envUrl,
    anonKey: envAnonKey,
    isCustom: false
  };
}

/**
 * Saves custom Supabase keys to localStorage for instant UI connection
 */
export function saveCustomSupabaseKeys(url: string, anonKey: string) {
  if (!url || !anonKey) {
    localStorage.removeItem(URL_STORAGE_KEY);
    localStorage.removeItem(ANON_KEY_STORAGE_KEY);
  } else {
    localStorage.setItem(URL_STORAGE_KEY, url.trim());
    localStorage.setItem(ANON_KEY_STORAGE_KEY, anonKey.trim());
  }
}

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = "";

/**
 * Returns a configured Supabase client if keys are available, otherwise null.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
}

  const configKey = `${config.url}_${config.anonKey}`;
  if (cachedClient && cachedConfigKey === configKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    cachedConfigKey = configKey;
    return cachedClient;
  } catch (error) {
    console.error("Failed to create Supabase client:", error);
    return null;
  }
}

/**
 * Fetch all dashboards.
 * Falls back to localStorage if Supabase is not connected.
 */
export async function fetchDashboards(): Promise<{ data: UserDashboard[]; isRealSupabase: boolean }> {
  const client = getSupabaseClient();
  const localKey = "lharmonie_fallback_dashboards";

  if (!client) {
    // Return mock/local storage fallback data
    const localData = JSON.parse(localStorage.getItem(localKey) || "[]");
    return { data: localData, isRealSupabase: false };
  }

  try {
    const { data, error } = await client
      .from("lharmonie_dashboards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetch failed, using localStorage fallback:", error);
      // Fallback if table doesn't exist yet
      const localData = JSON.parse(localStorage.getItem(localKey) || "[]");
      return { data: localData, isRealSupabase: false };
    }

    // Map DB columns to our frontend object interface
    const dashboards: UserDashboard[] = (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      userAvatar: row.user_avatar,
      title: row.title,
      theme: row.theme,
      widgets: Array.isArray(row.widgets) ? row.widgets : JSON.parse(row.widgets || "[]"),
      scratchpadText: row.scratchpad_text || "",
      createdAt: row.created_at
    }));

    return { data: dashboards, isRealSupabase: true };
  } catch (error) {
    console.error("Supabase request crashed, falling back:", error);
    const localData = JSON.parse(localStorage.getItem(localKey) || "[]");
    return { data: localData, isRealSupabase: false };
  }
}

/**
 * Register or update a user's dashboard in Supabase (or localStorage fallback).
 */
export async function saveDashboard(dashboard: UserDashboard): Promise<{ success: boolean; isRealSupabase: boolean; error?: string }> {
  const client = getSupabaseClient();
  const localKey = "lharmonie_fallback_dashboards";

  // Always save locally first as backup and immediate preview sync
  const localData: UserDashboard[] = JSON.parse(localStorage.getItem(localKey) || "[]");
  const filteredLocal = localData.filter((d) => d.userId !== dashboard.userId);
  filteredLocal.unshift(dashboard);
  localStorage.setItem(localKey, JSON.stringify(filteredLocal));

  if (!client) {
    return { success: true, isRealSupabase: false };
  }

  try {
    // Map Frontend model to DB schema
    const dbPayload = {
      id: dashboard.id,
      user_id: dashboard.userId,
      user_name: dashboard.userName,
      user_avatar: dashboard.userAvatar,
      title: dashboard.title,
      theme: dashboard.theme,
      widgets: JSON.stringify(dashboard.widgets),
      scratchpad_text: dashboard.scratchpadText || "",
      created_at: dashboard.createdAt
    };

    // Attempt upsert based on user_id
    const { error } = await client
      .from("lharmonie_dashboards")
      .upsert(dbPayload, { onConflict: "user_id" });

    if (error) {
      console.error("Supabase upsert failed:", error);
      return { 
        success: false, 
        isRealSupabase: true, 
        error: `${error.message}. Ensure the 'lharmonie_dashboards' table exists. See setup instructions in dashboard.` 
      };
    }

    return { success: true, isRealSupabase: true };
  } catch (err: any) {
    console.error("Supabase query error:", err);
    return { success: false, isRealSupabase: true, error: err.message };
  }
}

/**
 * Delete a dashboard
 */
export async function deleteDashboard(id: string, userId: string): Promise<{ success: boolean; isRealSupabase: boolean }> {
  const client = getSupabaseClient();
  const localKey = "lharmonie_fallback_dashboards";

  // Delete locally
  const localData: UserDashboard[] = JSON.parse(localStorage.getItem(localKey) || "[]");
  const filteredLocal = localData.filter((d) => d.id !== id);
  localStorage.setItem(localKey, JSON.stringify(filteredLocal));

  if (!client) {
    return { success: true, isRealSupabase: false };
  }

  try {
    const { error } = await client
      .from("lharmonie_dashboards")
      .delete()
      .eq("id", id)
      .eq("user_id", userId); // Secure deletion check

    if (error) {
      console.error("Supabase delete failed:", error);
      return { success: false, isRealSupabase: true };
    }

    return { success: true, isRealSupabase: true };
  } catch (err) {
    console.error("Supabase delete crashed:", err);
    return { success: false, isRealSupabase: true };
  }
}
