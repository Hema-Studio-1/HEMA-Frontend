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
