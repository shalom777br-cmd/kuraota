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
export async function saveDashboard(dashboard: UserDashboard): Promise<{ success: boolean; isRealSupabase: boolean; error?: string; warning?: string }> {
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
      widgets: dashboard.widgets, // Pass array directly for jsonb type to avoid serialization and conversion errors
      scratchpad_text: dashboard.scratchpadText || "",
      created_at: dashboard.createdAt
    };

    // First, check if a dashboard with this user_id already exists to avoid complex onConflict/index errors
    const { data: existing, error: checkError } = await client
      .from("lharmonie_dashboards")
      .select("id")
      .eq("user_id", dashboard.userId)
      .maybeSingle();

    if (checkError) {
      console.warn("Supabase connection or table check failed:", checkError);
      return {
        success: false,
        isRealSupabase: true,
        error: `データベースの接続テストに失敗しました（${checkError.message}）。テーブルが作成されているか、設定値を確認してください。`
      };
    }

    let error = null;

    if (existing) {
      // Perform explicit UPDATE based on user_id (safest way to maintain single record per user)
      const { error: updateError } = await client
        .from("lharmonie_dashboards")
        .update({
          user_name: dashboard.userName,
          user_avatar: dashboard.userAvatar,
          title: dashboard.title,
          theme: dashboard.theme,
          widgets: dashboard.widgets,
          scratchpad_text: dbPayload.scratchpad_text,
          created_at: dbPayload.created_at
        })
        .eq("user_id", dashboard.userId);
      error = updateError;
    } else {
      // Perform explicit INSERT
      const { error: insertError } = await client
        .from("lharmonie_dashboards")
        .insert(dbPayload);
      error = insertError;
    }

    if (error) {
      console.warn("Supabase DB operation failed:", error);
      let errorDetail = `Supabaseへの登録に失敗しました（${error.message}）。`;
      if (error.message?.includes("relation") || error.message?.includes("not found")) {
        errorDetail += "テーブル 'lharmonie_dashboards' が作成されていない可能性があります。「接続設定」パネルを開き、SQL Editor用のスクリプトを実行してください。";
      } else if (error.message?.includes("policy") || error.message?.includes("permission")) {
        errorDetail += "RLSポリシーにより書き込みが制限されている可能性があります。SQL内のポリシー設定も一緒に実行したかご確認ください。";
      }
      return { 
        success: false, 
        isRealSupabase: true, 
        error: errorDetail
      };
    }

    return { success: true, isRealSupabase: true };
  } catch (err: any) {
    console.warn("Supabase query error:", err);
    return { 
      success: false, 
      isRealSupabase: true, 
      error: `接続エラー（${err.message || err}）。環境変数やネットワーク、認証キーを確認してください。データはローカルに保存されました。` 
    };
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

/**
 * Test Supabase connection and check if table 'lharmonie_dashboards' exists and is accessible.
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: "SupabaseのURLまたはAnon Keyが構成されていません。" };
  }

  try {
    const { error } = await client
      .from("lharmonie_dashboards")
      .select("id")
      .limit(1);

    if (error) {
      console.warn("Supabase connection test failed:", error);
      if (error.message?.includes("relation") || error.message?.includes("not found")) {
        return {
          success: false,
          message: `接続はできましたが、テーブル 'lharmonie_dashboards' が存在しません。SQL Editorでテーブル定義を実行してください。`
        };
      }
      return {
        success: false,
        message: `認証またはポリシー制限エラーが発生しました（${error.message}）。Anon KeyやRLSポリシーを確認してください。`
      };
    }

    return {
      success: true,
      message: "接続成功！ テーブル 'lharmonie_dashboards' は正常に利用可能です。"
    };
  } catch (err: any) {
    console.error("Connection test crashed:", err);
    return {
      success: false,
      message: `接続テスト中に予期せぬエラーが発生しました: ${err.message || err}`
    };
  }
}
