import { MoreVertical, Plus, Upload, X } from "lucide-react";
import React, { useState } from "react";
import { AssignTeamMemberDialog } from "./AssignTeamMemberDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { ProjectInfoPanel } from "./ProjectInfoPanel";

interface Project {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  roomCount: number;
  createdAt: Date;
}

interface ProjectsProps {
  onProjectClick: (projectName: string) => void;
}

export function Projects({ onProjectClick }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<
    string | null
  >(null);
  const [projectToEdit, setProjectToEdit] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageFile: null as File | null,
  });

  const handleCreateProject = () => {
    if (!formData.name.trim()) return;

    // Create project without image by default
    const newProject: Project = {
      id: "2026-03-19T17:54:49.425Z",
      name: formData.name,
      description: formData.description || "No designs yet",
      imageUrl: undefined, // No image by default
      roomCount: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date(),
    };

    setProjects([...projects, newProject]);
    setFormData({ name: "", description: "", imageFile: null });
    setIsCreating(false);
  };

  const handleUpdateProject = () => {
    if (!formData.name.trim() || !projectToEdit) return;
    setProjects(
      projects.map((p) =>
        p.id === projectToEdit
          ? {
              ...p,
              name: formData.name,
              description: formData.description || p.description,
            }
          : p,
      ),
    );
    setFormData({ name: "", description: "", imageFile: null });
    setProjectToEdit(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    setMenuOpenId(null);
    setDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleDeleteClick = (id: string) => {
    setProjectToDelete(id);
    setDeleteDialogOpen(true);
    setMenuOpenId(null);
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", imageFile: null });
    setIsCreating(false);
    setProjectToEdit(null);
  };

  const handleAssignTeamMember = (memberId: string, note: string) => {
    // Handle assignment logic here
    console.log("Assigned member:", memberId, "Note:", note);
    setIsAssignDialogOpen(false);
    setMenuOpenId(null);
  };

  return (
    <div className="grid h-full grid-rows-[auto_1fr]">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-16 px-4">
        <h2 className="text-3xl lg:text-4xl tracking-tight text-foreground">
          My Projects
        </h2>
      </div>

      {/* Empty State */}
      {projects.length === 0 && !isCreating && (
        <div
          className="flex items-center justify-center px-4"
          style={
            {
              // minHeight: 'calc(100vh - 300px)'
            }
          }
        >
          <div
            className="bg-[#FDFCFB] rounded-sm flex flex-col items-center justify-center text-center transition-colors duration-300"
            style={{
              width: "100%",
              maxWidth: "560px",
              minHeight: "350px",
              padding: "50px 48px",
            }}
          >
            {/* Minimal placeholder icon */}
            <div className="w-12 h-12 border border-[#E8E6E3] rounded-sm flex items-center justify-center mb-6">
              <Plus className="text-textSecondary transition-colors duration-300 size-6" />
            </div>

            {/* Title */}
            <h3 className="text-2xl lg:text-3xl tracking-tight mb-2 text-foreground">
              Create your first project
            </h3>

            {/* Subtext */}
            <p className="text-sm text-textSecondary mb-8 leading-relaxed max-w-sm">
              Organize spaces, references, and AI generations in one place.
            </p>

            {/* Primary Button */}
            <button
              onClick={() => setIsCreating(true)}
              className="px-8 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300"
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      {/* Project List */}
      {projects.length > 0 && (
        <div className="px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {/* Create New Project Tile */}
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
                <Plus className="text-textSecondary mb-4 group-hover:text-[#626262] transition-colors duration-300 size-6" />

                {/* Title */}
                <h4
                  className="text-[18px] mb-2 text-foreground"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Create new project
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
                  Start organizing spaces and designs
                </p>
              </div>
            </div>

            {projects.map((project) => (
              <div
                key={project.id}
                className="relative group"
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                {project.imageUrl ? (
                  // Image-First Card (With Image)
                  <div
                    className="cursor-pointer"
                    onClick={() => onProjectClick(project.name)}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-sm mb-4">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-64 object-cover transition-opacity duration-500 group-hover:opacity-85"
                      />
                    </div>

                    {/* Project Name */}
                    <h4
                      className="text-[18px] mb-2 text-foreground group-hover:text-[#626262] transition-colors duration-300"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 300,
                      }}
                    >
                      {project.name}
                    </h4>

                    {/* Meta */}
                    <p
                      className="text-[12px] text-textSecondary"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        letterSpacing: "0.02em",
                      }}
                    >
                      Rooms: {project.roomCount}
                    </p>
                  </div>
                ) : (
                  // Text-First Card (No Image)
                  <div
                    className="bg-[#FDFCFB] rounded-sm cursor-pointer transition-colors duration-300 hover:bg-[#FAF9F7] relative"
                    style={{
                      minHeight: "280px",
                      padding: "48px 32px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    onClick={() => onProjectClick(project.name)}
                  >
                    {/* Project Name */}
                    <h4
                      className="text-[24px] mb-3 text-foreground"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 300,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {project.name}
                    </h4>

                    {/* Description */}
                    <p
                      className="text-[13px] text-[#c5c5c5]"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                        lineHeight: "1.6",
                      }}
                    >
                      {project.description || "No designs yet"}
                    </p>
                  </div>
                )}

                {/* Three-dot menu - appears on hover */}
                {hoveredProjectId === project.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(
                        menuOpenId === project.id ? null : project.id,
                      );
                    }}
                    className="absolute top-3 right-3 p-1.5 hover:opacity-60 transition-opacity duration-300 bg-background/80 backdrop-blur-sm rounded-sm"
                  >
                    <MoreVertical
                      size={16}
                      className="text-[#626262]"
                      strokeWidth={1.5}
                    />
                  </button>
                )}

                {/* Minimal Dropdown Menu */}
                {menuOpenId === project.id && (
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
                        setSelectedProjectForDetails(project.id);
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
                        const proj = projects.find((p) => p.id === project.id);
                        if (proj) {
                          setFormData({
                            name: proj.name,
                            description: proj.description ?? "",
                            imageFile: null,
                          });
                          setProjectToEdit(proj.id);
                        }
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
                      onClick={() => handleDeleteClick(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {(isCreating || projectToEdit !== null) && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-50 transition-opacity duration-500"
            onClick={handleCancel}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-background rounded-sm w-full max-w-xl p-12 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleCancel}
                className="absolute top-6 right-6 p-2 hover:opacity-60 transition-opacity duration-300"
              >
                <X size={20} className="text-[#626262]" strokeWidth={1.5} />
              </button>

              {/* Title */}
              <h3
                className="text-[28px] mb-8 text-foreground"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                }}
              >
                {projectToEdit ? "Edit project" : "New Project"}
              </h3>

              {/* Form */}
              <div className="space-y-8">
                {/* Project Name */}
                <div>
                  <label
                    className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                    }}
                  >
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., APT Jungfrau"
                    className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                    }}
                  >
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description"
                    className="w-full px-0 py-3 text-[16px] text-foreground placeholder:text-[#c5c5c5] focus:outline-none bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] transition-colors duration-500"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  />
                </div>

                {/* Reference Upload */}
                <div>
                  <label
                    className="block text-[12px] text-textSecondary mb-3 uppercase tracking-widest"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                    }}
                  >
                    Reference Image (Optional)
                  </label>
                  <button
                    className="flex items-center gap-2 text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    <Upload size={16} strokeWidth={1.5} />
                    Upload image
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-6 mt-12">
                <button
                  onClick={handleCancel}
                  className="text-[13px] text-textSecondary hover:text-[#626262] transition-colors duration-300"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={
                    projectToEdit ? handleUpdateProject : handleCreateProject
                  }
                  disabled={!formData.name.trim()}
                  className="px-8 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.03em",
                  }}
                >
                  {projectToEdit ? "Update" : "Create Project"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirm Dialog */}
      {deleteDialogOpen && projectToDelete && (
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={() => handleDeleteProject(projectToDelete)}
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

      {/* Project Info Panel */}
      <ProjectInfoPanel
        isOpen={selectedProjectForDetails !== null}
        onClose={() => setSelectedProjectForDetails(null)}
        project={
          selectedProjectForDetails
            ? {
                id: selectedProjectForDetails,
                name:
                  projects.find((p) => p.id === selectedProjectForDetails)
                    ?.name || "",
                description:
                  projects.find((p) => p.id === selectedProjectForDetails)
                    ?.description ||
                  "Modern architectural project featuring clean lines and natural materials.",
                spacesCount:
                  projects.find((p) => p.id === selectedProjectForDetails)
                    ?.roomCount || 0,
                spaces: [
                  {
                    id: "1",
                    name: "Living Room",
                    type: "Living Space",
                    lastUpdated: "2 hours ago",
                  },
                  {
                    id: "2",
                    name: "Master Bedroom",
                    type: "Bedroom",
                    lastUpdated: "1 day ago",
                  },
                  {
                    id: "3",
                    name: "Kitchen",
                    type: "Kitchen",
                    lastUpdated: "3 days ago",
                  },
                ],
                status: "In Progress" as const,
                createdDate: "Jan 15, 2025",
                lastUpdated: "2 hours ago",
                teamMembers: [
                  {
                    id: "1",
                    name: "Sarah Chen",
                    role: "Lead Designer",
                    assignedSpaces: 2,
                  },
                  {
                    id: "2",
                    name: "Marcus Johnson",
                    role: "Reviewer",
                    assignedSpaces: 1,
                  },
                ],
                recentActivity: [
                  {
                    id: "1",
                    user: "Sarah Chen",
                    action: "updated",
                    space: "Living Room",
                    timestamp: "2 hours ago",
                  },
                  {
                    id: "2",
                    user: "Marcus Johnson",
                    action: "commented on",
                    space: "Master Bedroom",
                    timestamp: "1 day ago",
                  },
                  {
                    id: "3",
                    user: "Sarah Chen",
                    action: "created",
                    space: "Kitchen",
                    timestamp: "3 days ago",
                  },
                ],
              }
            : null
        }
        onSpaceClick={(spaceId) => {
          console.log("Open space:", spaceId);
          setSelectedProjectForDetails(null);
        }}
        onRename={() => {
          const id = selectedProjectForDetails;
          if (id) {
            const proj = projects.find((p) => p.id === id);
            if (proj) {
              setFormData({
                name: proj.name,
                description: proj.description ?? "",
                imageFile: null,
              });
              setProjectToEdit(proj.id);
            }
            setSelectedProjectForDetails(null);
          }
        }}
        onAssignMember={() => {
          setSelectedProjectForDetails(null);
          setIsAssignDialogOpen(true);
        }}
      />

      {/* Click outside to close menu */}
      {menuOpenId && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setMenuOpenId(null)}
        />
      )}
    </div>
  );
}
