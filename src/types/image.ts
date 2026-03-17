export enum ImageType {
  ORIGINAL = "original",
  MASK = "mask",
  INTERMEDIATE = "intermediate",
  INSPIRATION = "inspiration",
  FINAL = "final",
}

export interface Image {
  id: string;
  projectId?: string;
  spaceId?: string;
  type: ImageType;
  storagePath: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface CreateImageRequest {
  projectId?: string;
  spaceId?: string;
  type: ImageType;
  storagePath: string;
  width?: number;
  height?: number;
}

export interface CreateImageResponse {
  id: string;
  projectId?: string | null;
  spaceId?: string | null;
  type: ImageType;
  storagePath: string;
  width?: number | null;
  height?: number | null;
  createdAt: string;
}
