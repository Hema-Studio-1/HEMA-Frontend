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
  width?: number;
  depth?: number;
  height?: number;
  length?: number;
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
  label?: string;
  category?: string;
  maskUrl?: string;
  objectUrl?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

export interface DetectionBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FlatDetectedItem {
  label: string;
  category?: string;
  boundingBox?: DetectionBoundingBox | null;
}

export type GroupedDetectedItems = Record<string, FlatDetectedItem[]>;

/** API may return grouped category buckets or flat detection items */
export interface DetectFurnitureResult {
  itemsDetected?: number;
  detections?: Array<FlatDetectedItem | GroupedDetectedItems>;
  segmentedObjects?: Array<{
    id: string;
    imageId: string;
    label: string;
    maskImageId: string;
    boundingBox?: DetectionBoundingBox | null;
    createdAt: string;
  }>;
  output?: {
    detected_image?: string;
    detections?: DetectedObject[];
    final_mask?: string;
  };
  delayTime?: number;
  executionTime?: number;
  id?: string;
  status?: string;
  workerId?: string;
}

/** API may return { parsed: { itemsDetected, detections }, segmentedObjects } or array or single object */
export interface DetectFurnitureResponseWrapper {
  parsed?: DetectFurnitureResult;
  segmentedObjects?: Array<{
    id?: string;
    imageId?: string;
    label: string;
    maskImageId?: string;
    boundingBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
    createdAt?: string;
  }>;
}
export type DetectFurnitureResponse =
  | DetectFurnitureResult
  | DetectFurnitureResult[]
  | DetectFurnitureResponseWrapper;

export interface BoundingBoxDto {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ItemDto {
  label: string;
  boudingBox: BoundingBoxDto;
}

export interface RemoveFurnitureRequest {
  imageId: string;
  items: ItemDto[];
}

export interface RemoveFurnitureResponse {
  path?: string;
  image: Image;
}

export interface EmptyCompleteRoomRequest {
  imageId: string;
}

export interface EmptyCompleteRoomResponse {
  path?: string;
  image: Image;
}

export interface AIContext {
  style_keywords: string;
  mood: string;
  materials: string;
}

export interface FillRoomFromInspirationFurnitureRequest {
  imageId: string;
  inpirationFurnitureImageId: string;
  aiContext: AIContext;
}

export interface FillRoomFromInspirationFurnitureResponse {
  path?: string;
  image: Image;
}

export interface FillRoomFromSurpriseRequest {
  imageId: string;
  aiContext: AIContext;
}

export interface FillRoomFromSurpriseResponse {
  path?: string;
  image: Image;
}

export interface FillRoomFromFloorPlanRequest {
  imageId: string;
  floorPlanImageId: string;
  aiContext: AIContext;
}

export interface FillRoomFromFloorPlanResponse {
  path?: string;
  image: Image;
}

export interface CreateFullSpaceRequest {
  projectId?: string;
  imageId?: string;
  name: string;
  description?: string;
  type: SpaceType | string;
  status?: SpaceStatus | string;
  widthM?: number;
  depthM?: number;
  heightM?: number;
  budget?: number;
}

export interface CreateFullSpaceResponse {
  space: SpaceWithRelations;
  spacesCountForProject: number;
}
