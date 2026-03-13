/** biome-ignore-all lint/suspicious/noExplicitAny: supabase action returns unknown error shape */
"use server";
import { ENV_VARIABLES } from "@/lib/env-variables";
import { getSignedImgUrlServer } from "@/supabase/image-url-server";
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";

interface UploadResult {
  id: string;
  url: string;
  name: string;
  path: string;
  size: number;
  type: string;
  success: boolean;
  error?: string;
}

export async function uploadImages(
  files: File | File[],
  path: string,
  bucket: string = ENV_VARIABLES.BUCKET_NAME,
): Promise<UploadResult[]> {
  const filesToUpload = Array.isArray(files) ? files : [files];
  if (filesToUpload.length === 0) {
    return [
      {
        id: "",
        url: "",
        name: "Invalid file",
        path: "",
        size: 0,
        type: "",
        success: false,
        error: "No valid image files selected (max 50MB)",
      },
    ];
  }

  // Upload all files in parallel with better error handling
  const results = await Promise.all(
    filesToUpload.map(async (file) => {
      try {
        return await uploadSingleFile(file, bucket, path);
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        return {
          id: "",
          url: "",
          name: file.name,
          path: "",
          size: file.size,
          type: file.type,
          success: false,
          error: err instanceof Error ? err.message : "Upload failed",
        };
      }
    }),
  );

  // Log results for debugging
  console.log(
    `Upload results: ${results.filter((r) => r.success).length} successful, ${
      results.filter((r) => !r.success).length
    } failed`,
  );

  // Revalidate the path if provided
  if (path) {
    revalidatePath(path);
  }

  return results;
}

export async function uploadSingleFile(
  file: File,
  bucket: string = ENV_VARIABLES.BUCKET_NAME,
  path?: string,
): Promise<UploadResult> {
  const supabase = await createClient();
  console.log(`Uploading ${file.name} (${file.size} bytes) to ${path}`);
  try {
    // Get file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
    // Create unique filename with timestamp + random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10); // Random alphanumeric string
    const fileName = `${timestamp}_${randomString}.${fileExt}`;
    const filePath = path ? path.concat(`/${fileName}`) : fileName;
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        upsert: false,
      });
    if (error) {
      console.error(`Supabase upload error for ${file.name}:`, error);
      throw new Error(error.message);
    }
    // Get signed URL
    const signedUrl = await getSignedImgUrlServer(filePath);
    console.log(`Successfully uploaded ${file.name} to ${filePath}`);
    return {
      id: data?.id || fileName,
      url: signedUrl,
      name: file.name,
      path: filePath,
      size: file.size,
      type: file.type,
      success: true,
    };
  } catch (error: any) {
    console.error(`Error in uploadSingleFile for ${file.name}:`, error);
    return {
      id: "",
      url: "",
      name: file.name,
      path: "",
      size: file.size,
      type: file.type,
      success: false,
      error: error.message || "Failed to upload file",
    };
  }
}

export async function uploadSingleImage(
  file: File,
  path: string,
  bucket: string = ENV_VARIABLES.BUCKET_NAME,
): Promise<UploadResult> {
  return uploadSingleFile(file, bucket, path);
}
