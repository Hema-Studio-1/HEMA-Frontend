import type {
  CreateFullSpaceRequest,
  CreateFullSpaceResponse,
  CreateSpaceWithImageRequest,
  CreateSpaceWithImageResponse,
  DetectFurnitureRequest,
  DetectFurnitureResponse,
  EmptyCompleteRoomRequest,
  EmptyCompleteRoomResponse,
  FillRoomFromFloorPlanRequest,
  FillRoomFromFloorPlanResponse,
  FillRoomFromInspirationFurnitureRequest,
  FillRoomFromInspirationFurnitureResponse,
  FillRoomFromInspirationFurnitureWithActualImageRequest,
  FillRoomFromSurpriseRequest,
  FillRoomFromSurpriseResponse,
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
  data: MeasureRoomRequest,
): Promise<FetchResponse<MeasureRoomResponse>> {
  return $axiosReq<MeasureRoomResponse>({
    url: "spaces/measure-room",
    method: "POST",
    data,
    silent: true,
  });
}

export async function createSpace(
  data: CreateFullSpaceRequest,
): Promise<FetchResponse<CreateFullSpaceResponse>> {
  return $axiosReq<CreateFullSpaceResponse>({
    url: "spaces/create-space",
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

export async function emptyCompleteRoom(
  spaceId: string,
  data: EmptyCompleteRoomRequest,
): Promise<FetchResponse<EmptyCompleteRoomResponse>> {
  return $axiosReq<EmptyCompleteRoomResponse>({
    url: `spaces/${spaceId}/empty-complete-room`,
    method: "POST",
    data,
    silent: true,
  });
}

export async function fillRoomFromInspirationFurniture(
  spaceId: string,
  data: FillRoomFromInspirationFurnitureRequest,
): Promise<FetchResponse<FillRoomFromInspirationFurnitureResponse>> {
  return $axiosReq<FillRoomFromInspirationFurnitureResponse>({
    url: `spaces/${spaceId}/fill-room-from-inpiration-furniture`,
    method: "POST",
    data,
    silent: true,
  });
}

export async function fillRoomFromInspirationFurnitureWithActualImage(
  spaceId: string,
  data: FillRoomFromInspirationFurnitureWithActualImageRequest,
): Promise<FetchResponse<FillRoomFromInspirationFurnitureResponse>> {
  return $axiosReq<FillRoomFromInspirationFurnitureResponse>({
    url: `spaces/${spaceId}/fill-room-from-inpiration-furniture-with-acutal-image`,
    method: "POST",
    data,
    silent: true,
  });
}

export async function fillRoomFromSurprise(
  spaceId: string,
  data: FillRoomFromSurpriseRequest,
): Promise<FetchResponse<FillRoomFromSurpriseResponse>> {
  return $axiosReq<FillRoomFromSurpriseResponse>({
    url: `spaces/${spaceId}/fill-room-from-surprise`,
    method: "POST",
    data,
    silent: true,
  });
}

export async function fillRoomFromFloorPlan(
  spaceId: string,
  data: FillRoomFromFloorPlanRequest,
): Promise<FetchResponse<FillRoomFromFloorPlanResponse>> {
  return $axiosReq<FillRoomFromFloorPlanResponse>({
    url: `spaces/${spaceId}/fill-room-from-floor-plan`,
    method: "POST",
    data,
    silent: true,
  });
}
