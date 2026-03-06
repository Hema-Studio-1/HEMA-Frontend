import { useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Heart, Edit, Info, Trash2 } from 'lucide-react';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { SpaceInfoDialog } from './SpaceInfoDialog';
import React from 'react';

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
}

interface GalleryProps {
  onEditSpace?: (spaceId: string, spaceData: GalleryImage) => void;
  onViewSpace?: (spaceId: string) => void;
}

const galleryImages: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1646936190308-6faef1ac893c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtaW5pbWFsJTIwbGl2aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzA1ODc3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Modern minimal living room',
    caption: 'Minimal living, soft daylight',
    name: 'Modern Minimal Living Room',
    type: 'Living Room',
    category: 'Modern Minimal',
    description: 'A modern minimal living room with soft daylight filtering through large windows. Features clean lines, neutral tones, and carefully curated furniture pieces.',
    assets: ['Boucle sofa in off-white', 'Oak coffee table', 'Ceramic table lamp', 'Wool area rug'],
    createdDate: 'February 1, 2026',
    lastUpdated: 'February 5, 2026'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1718636268253-d6ad2a0aeee9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmRpJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MDU4NzcxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Japandi bedroom interior',
    caption: 'Japandi bedroom, neutral tones',
    name: 'Japandi Bedroom Interior',
    type: 'Bedroom',
    category: 'Japandi',
    description: 'A Japandi bedroom interior with neutral tones, combining Japanese minimalism with Scandinavian functionality.',
    assets: ['Platform bed in natural oak', 'Linen bedding set', 'Washi paper pendant light', 'Bamboo side table'],
    createdDate: 'February 2, 2026',
    lastUpdated: 'February 2, 2026'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1669046222569-a7672da06e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwa2l0Y2hlbiUyMGRlc2lnbnxlbnwxfHx8fDE3NzA1ODc3MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Minimalist kitchen design',
    caption: 'Minimalist kitchen, warm wood',
    name: 'Minimalist Kitchen Design',
    type: 'Kitchen',
    category: 'Minimalist',
    description: 'A minimalist kitchen design with warm wood cabinetry and integrated appliances for a seamless aesthetic.',
    assets: ['White oak cabinets', 'Quartz countertop', 'Integrated range hood', 'Brushed brass hardware'],
    createdDate: 'February 3, 2026',
    lastUpdated: 'February 3, 2026'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1760067538241-33a8694d9e23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwbW9kZXJuJTIwbGl2aW5nJTIwc3BhY2V8ZW58MXx8fHwxNzcwNTg3NzE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Warm modern living space',
    caption: 'Modern living, earthy palette',
    name: 'Warm Modern Living Space',
    type: 'Living Space',
    category: 'Modern',
    description: 'A warm modern living space with an earthy palette, featuring terracotta accents and natural materials.',
    assets: ['Modular sofa in terracotta', 'Walnut media console', 'Ceramic floor vase', 'Abstract art piece'],
    createdDate: 'February 4, 2026',
    lastUpdated: 'February 4, 2026'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1732532973384-51d517700353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwaW50ZXJpb3IlMjBuYXR1cmFsJTIwbGlnaHR8ZW58MXx8fHwxNzcwNTg3NzE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Architectural interior with natural light',
    caption: 'Natural light, open space',
    name: 'Architectural Interior with Natural Light',
    type: 'Interior',
    category: 'Architectural',
    description: 'An architectural interior with natural light and open space, showcasing structural elements as design features.',
    assets: ['Exposed concrete walls', 'Floor-to-ceiling windows', 'Steel framed glass partition', 'Linear LED lighting'],
    createdDate: 'February 5, 2026',
    lastUpdated: 'February 5, 2026'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1535049752-3baf525dd015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBtaW5pbWFsaXN0JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzcwNTg3NzE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Scandinavian minimalist interior',
    caption: 'Scandinavian aesthetic, clean lines',
    name: 'Scandinavian Minimalist Interior',
    type: 'Interior',
    category: 'Scandinavian Minimalist',
    description: 'A Scandinavian minimalist interior with clean lines, white walls, and natural wood accents.',
    assets: ['White painted walls', 'Birch wood flooring', 'Mid-century modern chair', 'Sheepskin throw'],
    createdDate: 'February 6, 2026',
    lastUpdated: 'February 6, 2026'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1471874116287-eed9b5dce261?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJtJTIwd29vZCUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MDU4NzcxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Warm wood interior design',
    caption: 'Warm wood, tactile surfaces',
    name: 'Warm Wood Interior Design',
    type: 'Interior Design',
    category: 'Warm Wood',
    description: 'A warm wood interior design with tactile surfaces, emphasizing natural materials and textures.',
    assets: ['Reclaimed wood paneling', 'Leather lounge chair', 'Wool cushions', 'Cast iron fireplace'],
    createdDate: 'February 7, 2026',
    lastUpdated: 'February 7, 2026'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1623944431758-e856760d7b65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXV0cmFsJTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MDU4NzcxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'Neutral bedroom interior',
    caption: 'Neutral bedroom, soft textures',
    name: 'Neutral Bedroom Interior',
    type: 'Bedroom Interior',
    category: 'Neutral',
    description: 'A neutral bedroom interior with soft textures, creating a calming and restful environment.',
    assets: ['Upholstered bed frame', 'Egyptian cotton sheets', 'Velvet accent pillows', 'Dimmable wall sconces'],
    createdDate: 'February 8, 2026',
    lastUpdated: 'February 8, 2026'
  }
];

export function Gallery({ onEditSpace, onViewSpace }: GalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [images, setImages] = useState<GalleryImage[]>(galleryImages.map(img => ({ ...img, isLiked: false })));
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<GalleryImage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<GalleryImage | null>(null);

  const handleToggleLike = (id: string) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, isLiked: !img.isLiked } : img
    ));
  };

  const openDeleteDialog = (image: GalleryImage) => {
    setSpaceToDelete(image);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSpace = (id: string) => {
    setImages(images.filter(img => img.id !== id));
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
          1920: 5
        }}
        gutterBreakPoints={{ 0: '15px' }}
      >
        <Masonry>
          {images.map((image) => (
            <div
              key={image.id}
              className="relative cursor-pointer group"
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image sits directly on canvas */}
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-auto block transition-opacity duration-500 rounded-sm"
                style={{
                  opacity: hoveredId === image.id ? 0.85 : 1
                }}
              />
              
              {/* Actions on hover */}
              <div
                className="absolute top-3 right-3 flex gap-2 transition-opacity duration-300"
                style={{
                  opacity: hoveredId === image.id ? 1 : 0
                }}
              >
                <button
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
                        ? 'text-foreground fill-current' 
                        : 'text-[#626262]'
                    }`}
                    strokeWidth={1.5}
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditSpace) {
                      onEditSpace(image.id, image);
                    }
                  }}
                  className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                  title="Edit"
                >
                  <Edit size={14} className="text-[#626262]" strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleInfo(image);
                  }}
                  className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                  title="Info"
                >
                  <Info size={14} className="text-[#626262]" strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteDialog(image);
                  }}
                  className="p-2 bg-[#FDFCFB]/90 backdrop-blur-sm rounded-sm hover:bg-[#FDFCFB] transition-colors duration-300"
                  title="Delete"
                >
                  <Trash2 size={14} className="text-[#626262]" strokeWidth={1.5} />
                </button>
              </div>
              
              {/* Tiny caption appears on hover - no buttons */}
              {/* {image.caption && ( */}
                <p
                  className="mt-1.5 font-medium"
                >
                  {image.caption}
                </p>
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