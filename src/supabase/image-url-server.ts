import { ENV_VARIABLES } from '@/lib/env-variables';
import { createClient } from '@/supabase/server';

export const getSignedImgUrlServer = async (path: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(ENV_VARIABLES.BUCKET_NAME)
    .createSignedUrl(path, 60 * 60 * 24); // 1 day
  if (error) throw new Error(error.message);
  return data?.signedUrl;
};
