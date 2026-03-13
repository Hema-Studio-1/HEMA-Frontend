import { ENV_VARIABLES } from '@/lib/env-variables';
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () =>
  createBrowserClient(ENV_VARIABLES.SUPABASE_URL, ENV_VARIABLES.SUPABASE_ANON_KEY);

export const getSupabaseToken = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token || null;
};

export const getSupabaseUser = async () => {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data?.session?.user || null;
};

export const getCurrentUserId = async (): Promise<string | null> => {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  return data?.session?.user?.id || null;
};
