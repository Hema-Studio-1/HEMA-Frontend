import { ENV_VARIABLES } from "@/lib/env-variables";
import { createClient } from "./client";

export async function getSignedImgUrl(
  path: string,
  bucket: string = ENV_VARIABLES.BUCKET_NAME,
  expiresIn: number = 60 * 60 * 24,
): Promise<{ message: string; success: boolean; signedUrl: string }> {
  const supabase = createClient();

  try {
    // Clean the path if needed
    const cleanPath = path?.startsWith("/") ? path?.substring(1) : path;
    // Get signed URL
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(cleanPath, expiresIn);

    if (error || !data || !data.signedUrl) {
      return {
        success: false,
        message: error?.message || "Failed to generate signed URL",
        signedUrl: "",
      };
    }
    return {
      success: true,
      message: "Signed URL generated successfully",
      signedUrl: data.signedUrl,
    };
  } catch (er: unknown) {
    const message =
      er instanceof Error ? er.message : "Failed to generate signed URL";
    return {
      success: false,
      message,
      signedUrl: "",
    };
  }
}
