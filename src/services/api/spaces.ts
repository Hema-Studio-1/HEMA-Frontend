import type {
    CreateSpaceWithImageRequest,
    CreateSpaceWithImageResponse,
    DetectFurnitureRequest,
    DetectFurnitureResponse,
    GetSpacesResponse,
    MeasureRoomRequest,
    MeasureRoomResponse,
    RemoveFurnitureRequest,
    RemoveFurnitureResponse,
    UpdateSpaceDetailsRequest,
    UpdateSpaceDetailsResponse,
} from "@/types/space";
import { $axiosReq } from "./api-service";
import type { FetchResponse } from "./api.types";

export async function getSpaces(): Promise<FetchResponse<GetSpacesResponse>> {
  return $axiosReq<GetSpacesResponse>({
    url: "spaces",
    method: "GET",
    silent: true,
  });
}

export async function createSpaceWithImage(
  data: CreateSpaceWithImageRequest,
): Promise<FetchResponse<CreateSpaceWithImageResponse>> {
  return $axiosReq<CreateSpaceWithImageResponse>({
    url: "spaces/with-image",
    method: "POST",
    data,
    silent: true,
  });
}

export async function measureRoom(
  spaceId: string,
  data: MeasureRoomRequest,
): Promise<FetchResponse<MeasureRoomResponse>> {
  return $axiosReq<MeasureRoomResponse>({
    url: `spaces/${spaceId}/measure-room`,
    method: "POST",
    data,
    silent: true,
  });
}

export async function updateSpaceDetails(
  spaceId: string,
  data: UpdateSpaceDetailsRequest,
): Promise<FetchResponse<UpdateSpaceDetailsResponse>> {
  return $axiosReq<UpdateSpaceDetailsResponse>({
    url: `spaces/${spaceId}/details`,
    method: "PUT",
    data,
    silent: true,
  });
}

export async function detectFurniture(
  spaceId: string,
  data: DetectFurnitureRequest,
): Promise<FetchResponse<DetectFurnitureResponse>> {
  return $axiosReq<DetectFurnitureResponse>({
    url: `spaces/${spaceId}/furniture/detect`,
    method: "POST",
    data,
    silent: true,
  });
}

export async function removeFurniture(
  spaceId: string,
  data: RemoveFurnitureRequest,
): Promise<FetchResponse<RemoveFurnitureResponse>> {
  return $axiosReq<RemoveFurnitureResponse>({
    url: `spaces/${spaceId}/remove-furniture`,
    method: "POST",
    data,
    silent: true,
  });
}
