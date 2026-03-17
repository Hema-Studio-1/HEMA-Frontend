import { useAIGenerationFlowContext } from "@/contexts/AIGenerationFlowContext";
import { extractSpaceDimensions } from "@/lib/dimensions";
// import { getSpaces } from "@/services/api/spaces";
import { getSignedImgUrl } from "@/supabase/image-url-client";
import type { SpaceType, SpaceWithRelations } from "@/types/space";
import { Edit, Heart, Info, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { SpaceInfoDialog } from "./SpaceInfoDialog";
import { ImageType } from "@/types/image";

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  isLiked?: boolean;
  name: string;
  type: string;
  category: string;
  description: string;
  assets: string[];
  createdDate: string;
  lastUpdated: string;
  sourceSpace?: SpaceWithRelations;
}

interface GalleryProps {
  onEditSpace?: (spaceId: string, spaceData: GalleryImage) => void;
  onViewSpace?: (spaceId: string) => void;
}

const DEFAULT_PREVIEW_URL =
  "https://images.unsplash.com/photo-1646936190308-6faef1ac893c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const MOCK_SPACES: SpaceWithRelations[] = [
  {
    id: "3ecb1768-c64f-4a21-8435-f4bb190e68ff",
    projectId: null,
    name: "Aiko Roach",
    description: "Dolor iusto ea ipsum",
    type: "living_room",
    status: "DRAFT",
    createdBy: "dbaf3c77-18c9-4dee-9696-2f68bbda7486",
    createdAt: "2026-03-08T15:58:10.287Z",
    updatedAt: "2026-03-08T15:58:10.287Z",
    project: null,
    views: [],
    dimensions: [
      {
        id: "b8e015cd-d45f-40a3-8a91-a42a733f53b9",
        spaceId: "3ecb1768-c64f-4a21-8435-f4bb190e68ff",
        widthM: 12,
        depthM: 14,
        heightM: 9,
        createdAt: "2026-03-08T15:58:14.541Z",
      },
    ],
    preferences: [],
    aiContexts: [],
    owner: {},
    images: [
      {
        id: "06bdf6e7-cde1-422c-a5d2-d548566558b7",
        spaceId: "3ecb1768-c64f-4a21-8435-f4bb190e68ff",
        type: ImageType.ORIGINAL,
        storagePath: "hema/1772985484451_2fa0tc3w.jpg",
        width: 1920,
        height: 1280,
        createdAt: "2026-03-08T15:58:10.291Z",
      },
    ],
    memberships: [],
  },
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    projectId: "",
    name: "Modern Living",
    description: "Scandinavian-inspired living room",
    type: "living_room",
    status: "DRAFT",
    createdBy: "dbaf3c77-18c9-4dee-9696-2f68bbda7486",
    createdAt: "2026-03-10T10:00:00.000Z",
    updatedAt: "2026-03-10T10:00:00.000Z",
    project: null,
    views: [],
    dimensions: [],
    preferences: [],
    aiContexts: [],
    owner: {},
    images: [
      {
        id: "img-2",
        projectId: "",
        spaceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        type: ImageType.ORIGINAL,
        storagePath: "hema/sample-living.jpg",
        width: 1920,
        height: 1280,
        createdAt: "2026-03-10T10:00:00.000Z",
      },
    ],
    memberships: [],
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    projectId: "",
    name: "Cozy Bedroom",
    description: "Minimal bedroom design",
    type: "bedroom",
    status: "DRAFT",
    createdBy: "dbaf3c77-18c9-4dee-9696-2f68bbda7486",
    createdAt: "2026-03-11T12:00:00.000Z",
    updatedAt: "2026-03-11T12:00:00.000Z",
    project: null,
    views: [],
    dimensions: [],
    preferences: [],
    aiContexts: [],
    owner: {},
    images: [
      {
        id: "img-3",
        projectId: "",
        spaceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        type: ImageType.ORIGINAL,
        storagePath: "hema/sample-bedroom.jpg",
        width: 1920,
        height: 1280,
        createdAt: "2026-03-11T12:00:00.000Z",
      },
    ],
    memberships: [],
  },
];

const ROOM_TYPE_LABELS: Record<SpaceType, string> = {
  living_room: "Living Room",
  dining_room: "Dining Room",
  bedroom: "Bedroom",
  office: "Home Office",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
};

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getRoomTypeValue(type: SpaceType | string): string {
  const normalizedType = type as string;
  switch (normalizedType) {
    case "living_room":
      return "living-room";
    case "dining_room":
      return "dining-room";
    default:
      return normalizedType;
  }
}

function getDirectImageUrl(image: unknown): string | null {
  if (!image || typeof image !== "object") return null;
  const imageRecord = image as Record<string, unknown>;
  const candidateKeys = ["signedUrl", "url", "imageUrl", "publicUrl"];

  for (const key of candidateKeys) {
    const value = imageRecord[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return null;
}

async function resolveSpacePreviewUrl(
  space: SpaceWithRelations,
): Promise<string> {
  const firstImage = space.images?.[0];
  if (!firstImage) return DEFAULT_PREVIEW_URL;

  const directUrl = getDirectImageUrl(firstImage);
  if (directUrl) return directUrl;

  if (!firstImage.storagePath) return DEFAULT_PREVIEW_URL;

  const signedResult = await getSignedImgUrl(firstImage.storagePath);
  if (signedResult.success && signedResult.signedUrl) {
    return signedResult.signedUrl;
  }

  return DEFAULT_PREVIEW_URL;
}

function getRoomLabel(type: SpaceType | string): string {
  if (type in ROOM_TYPE_LABELS) {
    return ROOM_TYPE_LABELS[type as SpaceType];
  }
  return "Living Room";
}

async function mapSpaceToGalleryItem(
  space: SpaceWithRelations,
): Promise<GalleryImage> {
  const roomLabel = getRoomLabel(space.type);
  const previewUrl = await resolveSpacePreviewUrl(space);

  return {
    id: space.id,
    url: previewUrl,
    alt: `${space.name} preview`,
    caption: roomLabel,
    name: space.name,
    type: roomLabel,
    category: roomLabel,
    description: space.description,
    assets: [
      `Storage: ${space.images?.[0]?.storagePath ?? "n/a"}`,
      `Image type: ${space.images?.[0]?.type ?? "original"}`,
    ],
    createdDate: formatDate(space.createdAt),
    lastUpdated: formatDate(space.updatedAt),
    sourceSpace: space,
  };
}


export function Gallery({ onEditSpace, onViewSpace }: GalleryProps) {
  const { step1, setCurrentStep } = useAIGenerationFlowContext();
  const { status } = useSession();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<GalleryImage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      if (status === "unauthenticated") {
        setImages([]);
      }
      return;
    }

    let isMounted = true;

    async function loadSpaces() {
      // Map mock spaces instead of API call
      const nextImages = await Promise.all(
        MOCK_SPACES.map(mapSpaceToGalleryItem),
      );
      if (!isMounted) return;
      setImages(nextImages.map((img) => ({ ...img, isLiked: false })));
      // const result = await getSpaces();
      // if (!isMounted) return;
      // const nextImages = await Promise.all(
      //   (result.data ?? []).map(mapSpaceToGalleryItem),
      // );
      // if (!isMounted) return;
      // setImages(nextImages.map((img) => ({ ...img, isLiked: false })));
    }

    void loadSpaces();

    return () => {
      isMounted = false;
    };
  }, [status]);

  const handleToggleLike = (id: string) => {
    setImages(
      images.map((img) =>
        img.id === id ? { ...img, isLiked: !img.isLiked } : img,
      ),
    );
  };

  const openDeleteDialog = (image: GalleryImage) => {
    setSpaceToDelete(image);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSpace = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
    setSpaceToDelete(null);
  };

  const handleInfo = (image: GalleryImage) => {
    setSelectedSpace(image);
    setInfoDialogOpen(true);
  };

  return (
    <div className="w-full mt-12 min-w-0">
      {/* Masonry Gallery - full width, columns from viewport; no skipped items */}
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          0: 1,
          420: 2,
          768: 3,
          1200: 4,
          1920: 5,
        }}
        gutterBreakPoints={{ 0: "15px" }}
      >
        <Masonry>
          {images.map((image) => (
            <div key={image.id} className="relative cursor-pointer group">
              {/* Image sits directly on canvas */}
              <NextImage
                src={image.url}
                alt={image.alt}
                width={1080}
                height={720}
                className="w-full h-auto block transition-opacity duration-500 rounded-sm group-hover:opacity-90"
                unoptimized
              />

              {/* Actions on hover */}
              <div className="absolute top-3 right-3 flex gap-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleLike(image.id);
                  }}
                  className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                  title={image.isLiked ? "Unlike" : "Like"}
                >
                  <Heart
                    size={14}
                    className={`transition-colors duration-300 ${
                      image.isLiked
                        ? "text-foreground fill-current"
                        : "text-[#626262]"
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditSpace) {
                      // Edit button state update (commented out)
                      // if (image.sourceSpace) {
                      //   step1.setSpace(image.sourceSpace);
                      //   step1.setSpaceName(image.sourceSpace.name);
                      //   step1.setRoomType(
                      //     getRoomTypeValue(image.sourceSpace.type),
                      //   );
                      //   step1.setUploadedImageUrl(image.url);
                      //   step1.setDimensions(
                      //     extractSpaceDimensions(image.sourceSpace),
                      //   );
                      //   setCurrentStep(1);
                      // }
                      onEditSpace(image.id, image);
                    }
                  }}
                  className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                  title="Edit"
                >
                  <Edit
                    size={14}
                    className="text-[#626262]"
                    strokeWidth={1.5}
                  />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewSpace?.(image.id);
                    handleInfo(image);
                  }}
                  className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                  title="Info"
                >
                  <Info
                    size={14}
                    className="text-[#626262]"
                    strokeWidth={1.5}
                  />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(image);
                  }}
                  className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                  title="Delete"
                >
                  <Trash2
                    size={14}
                    className="text-[#626262]"
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              {/* Tiny caption appears on hover - no buttons */}
              {/* {image.caption && ( */}
              <p className="mt-1.5 font-medium">{image.caption}</p>
              {/* )} */}
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      {/* Info Dialog */}
      <SpaceInfoDialog
        isOpen={infoDialogOpen}
        onClose={() => setInfoDialogOpen(false)}
        space={selectedSpace}
      />

      {/* Delete confirmation dialog */}
      {isDeleteDialogOpen && spaceToDelete && (
        <DeleteConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSpaceToDelete(null);
          }}
          onConfirm={() => handleDeleteSpace(spaceToDelete.id)}
          title="Delete this space?"
          message="This space will be permanently removed. This cannot be undone."
        />
      )}
    </div>
  );
}
