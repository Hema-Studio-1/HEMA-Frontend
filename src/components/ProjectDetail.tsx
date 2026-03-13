import type { SpaceWithRelations } from "@/types/space";
import { ArrowLeft, MoreVertical, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { AssignTeamMemberDialog } from "./AssignTeamMemberDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { SpaceFormDialog } from "./SpaceFormDialog";
import { SpaceData, SpaceInfoPanel } from "./SpaceInfoPanel";

interface Space {
  id: string;
  name: string;
  designCount: number;
  type?: string;
  category?: string;
  styleTags?: string[];
  description?: string;
  generatedAssets?: string[];
  status?: "Draft" | "In progress" | "Final";
  createdBy?: string;
  createdDate?: string;
  lastUpdated?: string;
}

interface ProjectDetailProps {
  projectName: string;
  onBack: () => void;
  onSpaceClick?: (spaceName: string) => void;
}

const mockSpaceData = [
  {
    id: "1",
    name: "Modern Minimal Living Room",
    designCount: 3,
    type: "Living Room",
    category: "Residential",
    styleTags: ["Minimalist", "Scandinavian", "Contemporary"],
    description:
      "A serene living space with clean lines, natural materials, and a focus on functionality without sacrificing comfort.",
    generatedAssets: [
      "3D rendered views (4 angles)",
      "Furniture specification list",
      "Material palette with samples",
      "Lighting plan and fixtures",
      "Shopping list with links",
    ],
    status: "Final" as const,
    createdBy: "Sarah Chen",
    createdDate: "January 15, 2026",
    lastUpdated: "February 8, 2026",
  },
  {
    id: "2",
    name: "Japandi Bedroom",
    designCount: 2,
    type: "Bedroom",
    category: "Residential",
    styleTags: ["Japandi", "Minimal", "Organic"],
    description:
      "A peaceful bedroom combining Japanese minimalism with Scandinavian warmth, featuring natural wood tones and neutral textiles.",
    generatedAssets: [
      "3D rendered views (3 angles)",
      "Furniture specification list",
      "Material and textile palette",
      "Floor plan layout",
    ],
    status: "In progress" as const,
    createdBy: "Michael Torres",
    createdDate: "January 22, 2026",
    lastUpdated: "February 7, 2026",
  },
];

export function ProjectDetail({
  projectName,
  onBack,
  onSpaceClick,
}: ProjectDetailProps) {
  const [spaces, setSpaces] = useState<Space[]>(mockSpaceData);
  const [isCreating, setIsCreating] = useState(false);
  const [spaceToEdit, setSpaceToEdit] = useState<string | null>(null);
  const [spaceToDelete, setSpaceToDelete] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hoveredSpaceId, setHoveredSpaceId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [infoSpaceId, setInfoSpaceId] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleCreateSpace = (space: SpaceWithRelations) => {
    const newSpace: Space = {
      id: space.id,
      name: space.name.trim(),
      designCount: 0,
      type: typeof space.type === "string" ? space.type : space.type,
      category: (space as unknown as { category?: string }).category || "Modern",
      description: space.description || undefined,
    };
    setSpaces([...spaces, newSpace]);
    setIsCreating(false);
  };

  const handleUpdateSpace = (
    id: string,
    data: { name: string; type: string; category: string; description: string },
  ) => {
    setSpaces(
      spaces.map((s) =>
        s.id === id
          ? {
              ...s,
              name: data.name,
              type: data.type,
              category: data.category,
              description: data.description || undefined,
            }
          : s,
      ),
    );
    setSpaceToEdit(null);
  };

  const handleDeleteSpace = (id: string) => {
    setSpaces(spaces.filter((space) => space.id !== id));
    setMenuOpenId(null);
    setSpaceToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    setSpaceToDelete(id);
    setDeleteDialogOpen(true);
    setMenuOpenId(null);
  };

  const handleAssignTeamMember = (memberId: string, note: string) => {
    // Handle assignment logic here
    console.log("Assigned member:", memberId, "Note:", note);
    setIsAssignDialogOpen(false);
    setMenuOpenId(null);
  };

  return (
    <div className="">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
      >
        <ArrowLeft size={16} strokeWidth={1.5} />
        Projects
      </button>

      {/* Top Bar */}
      <div className="flex items-start justify-between mb-12">
        <div>
          <h2 className="text-3xl lg:text-4xl tracking-tight text-foreground mb-2">
            {projectName}
          </h2>
          <p className="text-sm text-textSecondary">
            {spaces.length} {spaces.length === 1 ? "space" : "spaces"}
          </p>
        </div>
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl">
        {/* Create New Space Tile */}
        <div
          className="cursor-pointer group"
          onClick={() => setIsCreating(true)}
        >
          <div
            className="bg-[#FDFCFB] rounded-sm transition-all duration-300 hover:bg-[#FAF9F7] relative"
            style={{
              minHeight: "280px",
              padding: "48px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "1px dashed #E8E6E3",
            }}
          >
            {/* Plus Icon */}
            <Plus
              size={24}
              className="text-textSecondary mb-4 group-hover:text-[#626262] transition-colors duration-300"
              strokeWidth={1.5}
            />

            {/* Title */}
            <h4
              className="text-[18px] mb-2 text-foreground"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              Create new space
            </h4>

            {/* Helper Text */}
            <p
              className="text-[12px] text-[#c5c5c5]"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                lineHeight: "1.6",
              }}
            >
              Add a room or area to this project
            </p>
          </div>
        </div>

        {/* Existing Spaces */}
        {spaces.map((space) => (
          <div
            key={space.id}
            className="relative group"
            onMouseEnter={() => setHoveredSpaceId(space.id)}
            onMouseLeave={() => setHoveredSpaceId(null)}
          >
            <div
              className="bg-[#FDFCFB] rounded-sm flex flex-col justify-center cursor-pointer transition-colors duration-300 hover:bg-[#FAF9F7] relative"
              style={{
                minHeight: "280px",
                padding: "48px 32px",
              }}
              onClick={() => onSpaceClick?.(space.name)}
            >
              {/* Three-dot menu */}
              {hoveredSpaceId === space.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === space.id ? null : space.id);
                  }}
                  className="absolute top-4 right-4 p-2 hover:opacity-60 transition-opacity duration-300"
                >
                  <MoreVertical
                    size={16}
                    className="text-textSecondary"
                    strokeWidth={1.5}
                  />
                </button>
              )}

              {/* Dropdown Menu */}
              {menuOpenId === space.id && (
                <div
                  className="absolute top-11 right-3 bg-[#FDFCFB] py-0.5 z-10 rounded-sm"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    border: "1px solid rgba(0, 0, 0, 0.04)",
                    width: "fit-content",
                  }}
                >
                  <button
                    className="px-2.5 py-1.5 text-left text-[12px] text-foreground hover:bg-background transition-colors duration-300 block w-full"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      setInfoSpaceId(space.id);
                      setMenuOpenId(null);
                    }}
                  >
                    View details
                  </button>
                  <button
                    className="px-2.5 py-1.5 text-left text-[12px] text-foreground hover:bg-background transition-colors duration-300 block w-full"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      setSpaceToEdit(space.id);
                      setMenuOpenId(null);
                    }}
                  >
                    Rename
                  </button>
                  <button
                    className="px-2.5 py-1.5 text-left text-[12px] text-foreground hover:bg-background transition-colors duration-300 block w-full"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      setIsAssignDialogOpen(true);
                      setMenuOpenId(null);
                    }}
                  >
                    Assign team member
                  </button>
                  <button
                    className="px-2.5 py-1.5 text-left text-[12px] hover:bg-background transition-colors duration-300 block w-full"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      whiteSpace: "nowrap",
                      color: "#B88A7D",
                    }}
                    onClick={() => handleDeleteClick(space.id)}
                  >
                    Delete
                  </button>
                </div>
              )}

              {/* Space Name */}
              <h4
                className="text-[20px] mb-2 text-foreground"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 300,
                }}
              >
                {space.name}
              </h4>

              {/* Supporting Text */}
              <p
                className="text-[12px] text-[#c5c5c5]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                {space.designCount === 0
                  ? "No designs yet"
                  : `${space.designCount} designs`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Click outside to close menu */}
      {menuOpenId && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setMenuOpenId(null)}
        />
      )}

      {/* Space Info Panel */}
      {infoSpaceId && (
        <SpaceInfoPanel
          isOpen={!!infoSpaceId}
          onClose={() => setInfoSpaceId(null)}
          space={spaces.find((s) => s.id === infoSpaceId) as any | null}
        />
      )}

      {/* Create / Edit Space Dialog */}
      <SpaceFormDialog
        isOpen={isCreating || spaceToEdit !== null}
        onClose={() => {
          setIsCreating(false);
          setSpaceToEdit(null);
        }}
        mode={spaceToEdit ? "edit" : "create"}
        editSpace={
          spaceToEdit
            ? (spaces.find((s) => s.id === spaceToEdit) ?? undefined)
            : undefined
        }
        onCreate={handleCreateSpace}
        onUpdate={handleUpdateSpace}
      />

      {/* Delete Space Confirmation */}
      {deleteDialogOpen && spaceToDelete && (
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSpaceToDelete(null);
          }}
          onConfirm={() => handleDeleteSpace(spaceToDelete)}
          title="Delete space"
          message="This will permanently delete the space and its designs. This action cannot be undone."
        />
      )}

      {/* Assign Team Member Dialog */}
      {isAssignDialogOpen && (
        <AssignTeamMemberDialog
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          onAssign={handleAssignTeamMember}
        />
      )}
    </div>
  );
}
