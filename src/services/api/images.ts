import type { CreateImageRequest, CreateImageResponse } from "@/types/image";
import { $axiosReq } from "./api-service";
import type { FetchResponse } from "./api.types";

export async function createImage(
  data: CreateImageRequest,
): Promise<FetchResponse<CreateImageResponse>> {
  return $axiosReq<CreateImageResponse>({
    url: "images",
    method: "POST",
    data,
    silent: true,
  });
}
