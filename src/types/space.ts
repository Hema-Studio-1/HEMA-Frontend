import type { Image, ImageType } from "./image";

export enum SpaceType {
  LIVING_ROOM = "living_room",
  DINING_ROOM = "dining_room",
  BEDROOM = "bedroom",
  OFFICE = "office",
  KITCHEN = "kitchen",
  BATHROOM = "bathroom",
}

export enum SpaceStatus {
  APPROVED = "APPROVED",
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  REJECTED = "REJECTED",
}

export interface CreateSpaceWithImageRequest {
  projectId?: string;
  name: string;
  description: string;
  imageType: ImageType;
  imageStoragePath: string;
  imageWidth?: number;
  imageHeight?: number;
}

export interface SpaceDimension {
  id: string;
  spaceId: string;
  widthM: string | number;
  depthM: string | number;
  heightM: string | number;
  createdAt: string | Date;
}

export interface SpaceWithRelations {
  id: string;
  projectId?: string | null;
  name: string;
  description: string;
  type: SpaceType | string;
  status: SpaceStatus | string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  images?: Image[];
  dimensions?: SpaceDimension[];
  preferences?: unknown[];
  aiContexts?: unknown[];
  owner?: unknown;
  views?: unknown[];
  memberships?: unknown[];
  project?: unknown;
}

export type CreateSpaceWithImageResponse = SpaceWithRelations;

export interface MeasureRoomRequest {
  imageId: string;
}

export interface MeasureRoomResponse {
  space: SpaceWithRelations | null;
}

export type GetSpacesResponse = SpaceWithRelations[];

export interface UpdateSpaceDetailsRequest {
  widthM?: number;
  depthM?: number;
  heightM?: number;
  budget?: number;
  type?: string;
}

export interface UpdateSpaceDetailsResponse extends SpaceWithRelations {}

export interface DetectFurnitureRequest {
  imageId: string;
}

export interface DetectedObject {
  detected: string;
  maskUrl: string;
  objectUrl?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

export interface DetectFurnitureResponse {
  delayTime?: number;
  executionTime?: number;
  id?: string;
  output: {
    detected_image?: string;
    detections: DetectedObject[];
    final_mask?: string;
  };
  status?: string;
  workerId?: string;
}

export interface RemoveFurnitureRequest {
  imageId: string;
  maskUrls: string[];
}

export interface RemoveFurnitureResponse {
  data: string;
}
