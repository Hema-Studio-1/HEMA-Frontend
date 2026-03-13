import { ChevronDown, MoreVertical, Plus, Search } from "lucide-react";
import { useState } from "react";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";
import { CustomDropdown } from "./CustomDropdown";

type Tab = "members" | "tasks";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Designer" | "Reviewer" | "Viewer";
  status: "Active" | "Invited";
}

interface Task {
  id: string;
  title: string;
  relatedSpace: string;
  assignedBy: string;
  status: "Pending" | "In progress" | "Completed";
}

const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@studio.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: "2",
    name: "Michael Torres",
    email: "michael@studio.com",
    role: "Designer",
    status: "Active",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma@studio.com",
    role: "Reviewer",
    status: "Invited",
  },
];

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Review living room design",
    relatedSpace: "Modern Minimal Living Room",
    assignedBy: "Sarah Chen",
    status: "Pending",
  },
  {
    id: "2",
    title: "Update material palette",
    relatedSpace: "Japandi Bedroom",
    assignedBy: "Sarah Chen",
    status: "In progress",
  },
  {
    id: "3",
    title: "Finalize lighting setup",
    relatedSpace: "Minimalist Kitchen",
    assignedBy: "Michael Torres",
    status: "Completed",
  },
];

export function Team() {
  const [activeTab, setActiveTab] = useState<Tab>("members");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [members, setMembers] = useState<TeamMember[]>(mockMembers);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeTaskStatusDropdown, setActiveTaskStatusDropdown] = useState<
    string | null
  >(null);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddMember = (
    name: string,
    email: string,
    role: "Admin" | "Designer" | "Reviewer" | "Viewer",
  ) => {
    const newMember: TeamMember = {
      id: String(members.length + 1),
      name,
      email,
      role,
      status: "Invited",
    };
    setMembers([...members, newMember]);
    setIsAddMemberDialogOpen(false);
  };

  const handleTaskStatusChange = (
    taskId: string,
    newStatus: "Pending" | "In progress" | "Completed",
  ) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
    setActiveTaskStatusDropdown(null);
  };

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl lg:text-4xl leading-[1.1] mb-3 tracking-tight text-foreground">
              Team
            </h1>
            <p className="text-textSecondary leading-relaxed">
              Manage your team, roles, and assigned work
            </p>
          </div>

          {activeTab === "members" && (
            <button
              onClick={() => setIsAddMemberDialogOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                letterSpacing: "0.03em",
              }}
            >
              <Plus size={16} strokeWidth={1.5} />
              Add team member
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-[#E8E6E3] mt-8">
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-3 text-[13px] transition-all duration-300 ${
              activeTab === "members"
                ? "text-foreground border-b-2 border-foreground"
                : "text-textSecondary hover:text-[#626262]"
            }`}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: activeTab === "members" ? 400 : 300,
              letterSpacing: "0.03em",
            }}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-3 text-[13px] transition-all duration-300 ${
              activeTab === "tasks"
                ? "text-foreground border-b-2 border-foreground"
                : "text-textSecondary hover:text-[#626262]"
            }`}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: activeTab === "tasks" ? 400 : 300,
              letterSpacing: "0.03em",
            }}
          >
            My Tasks
          </button>
        </div>
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <div>
          {/* Search & Filter */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-textSecondary"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-4 py-2 text-[14px] text-foreground placeholder:text-[#c5c5c5] bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] focus:outline-none transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <CustomDropdown
                value={roleFilter}
                onChange={setRoleFilter}
                options={[
                  { value: "all", label: "All roles" },
                  { value: "Admin", label: "Admin" },
                  { value: "Designer", label: "Designer" },
                  { value: "Reviewer", label: "Reviewer" },
                  { value: "Viewer", label: "Viewer" },
                ]}
                className="min-w-[140px]"
                variant="filter"
              />
              <button
                onClick={() => setIsAddRoleDialogOpen(true)}
                className="flex items-center gap-1.5 text-[13px] text-[#626262] hover:text-foreground transition-colors duration-300"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0.03em",
                }}
              >
                <Plus size={14} strokeWidth={1.5} />
                Add role
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="mt-8">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 pb-3 mb-4 border-b border-[#E8E6E3]">
              <div className="col-span-5">
                <p
                  className="text-[11px] text-textSecondary uppercase tracking-widest"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                  }}
                >
                  Name / Email
                </p>
              </div>
              <div className="col-span-3">
                <p
                  className="text-[11px] text-textSecondary uppercase tracking-widest"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                  }}
                >
                  Role
                </p>
              </div>
              <div className="col-span-3">
                <p
                  className="text-[11px] text-textSecondary uppercase tracking-widest"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                  }}
                >
                  Status
                </p>
              </div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Rows */}
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-12 gap-4 py-4 border-b border-[#E8E6E3] hover:bg-[#E8E6E3]/20 transition-colors duration-300"
              >
                <div className="col-span-5">
                  <p
                    className="text-[14px] text-foreground mb-1"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {member.name}
                  </p>
                  <p
                    className="text-[12px] text-textSecondary"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {member.email}
                  </p>
                </div>
                <div className="col-span-3 flex items-center">
                  <p
                    className="text-[13px] text-[#626262]"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    {member.role}
                  </p>
                </div>
                <div className="col-span-3 flex items-center">
                  <span
                    className={`px-3 py-1 text-[11px] rounded-full ${
                      member.status === "Active"
                        ? "bg-[#A4AC96]/10 text-[#A4AC96]"
                        : "bg-text-secondary/10 text-textSecondary"
                    }`}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {member.status}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <button className="p-2 hover:bg-[#E8E6E3] rounded-sm transition-colors duration-300">
                    <MoreVertical
                      size={14}
                      className="text-textSecondary"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Tasks Tab */}
      {activeTab === "tasks" && (
        <div className="mt-8">
          {/* Tasks List */}
          {tasks.map((task) => (
            <div
              key={task.id}
              className="py-6 border-b border-[#E8E6E3] hover:bg-[#E8E6E3]/20 transition-colors duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3
                    className="text-[15px] text-foreground mb-2"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                    }}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-4">
                    <p
                      className="text-[12px] text-textSecondary"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Space: {task.relatedSpace}
                    </p>
                    <p
                      className="text-[12px] text-textSecondary"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 300,
                      }}
                    >
                      Assigned by: {task.assignedBy}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTaskStatusDropdown(
                        activeTaskStatusDropdown === task.id ? null : task.id,
                      );
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 text-[11px] cursor-pointer rounded-full transition-all duration-300 ${
                      task.status === "Completed"
                        ? "bg-[#A4AC96]/10 text-[#A4AC96]"
                        : task.status === "In progress"
                          ? "bg-[#EFEDE9] text-[#626262]"
                          : "bg-text-secondary/10 text-textSecondary"
                    }`}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {task.status}
                    <ChevronDown
                      size={12}
                      strokeWidth={1.5}
                      className={`transition-transform duration-300 ${activeTaskStatusDropdown === task.id ? "rotate-180" : ""}`}
                    />
                  </button>
                  {activeTaskStatusDropdown === task.id && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveTaskStatusDropdown(null)}
                      />
                      <div
                        className="absolute right-0 top-full mt-2 min-w-[140px] bg-background border border-[#E8E6E3] rounded-md overflow-hidden z-20"
                        style={{
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
                        }}
                      >
                        {(["Pending", "In progress", "Completed"] as const).map(
                          (status) => (
                            <button
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskStatusChange(task.id, status);
                              }}
                              className={`block w-full px-4 py-2.5 text-left text-[13px] transition-all duration-200 relative ${
                                task.status === status
                                  ? "bg-[#EFEDE9] text-foreground"
                                  : "text-[#626262] hover:bg-[#EFEDE9]/50 hover:text-foreground"
                              }`}
                              style={{
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: task.status === status ? 400 : 300,
                                letterSpacing: "0.03em",
                              }}
                            >
                              {task.status === status && (
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-[#A4AC96]" />
                              )}
                              <span
                                className={task.status === status ? "ml-3" : ""}
                              >
                                {status}
                              </span>
                            </button>
                          ),
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Team Member Dialog */}
      <AddTeamMemberDialog
        isOpen={isAddMemberDialogOpen}
        onClose={() => setIsAddMemberDialogOpen(false)}
        onAdd={handleAddMember}
      />

      {/* Add Role Dialog */}
      {isAddRoleDialogOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 transition-opacity duration-500"
            onClick={() => setIsAddRoleDialogOpen(false)}
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-background rounded-md w-full max-w-md"
              style={{
                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-8 pb-6">
                <h2
                  className="text-[24px] text-foreground"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 300,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Add role
                </h2>
                <button
                  onClick={() => setIsAddRoleDialogOpen(false)}
                  className="p-2 text-textSecondary hover:text-foreground transition-colors duration-300"
                >
                  <Plus size={20} strokeWidth={1.5} className="rotate-45" />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 pb-8 space-y-6">
                {/* Role Name */}
                <div>
                  <label
                    className="block text-[11px] text-textSecondary mb-2 uppercase tracking-widest"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                    }}
                  >
                    Role name
                  </label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="e.g. Project Manager"
                    className="w-full px-0 py-3 text-[15px] text-foreground placeholder:text-[#c5c5c5] bg-transparent border-b border-[#E8E6E3] focus:border-[#A4AC96] focus:outline-none transition-colors duration-300"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}
                  />
                  <p
                    className="mt-3 text-[12px] text-textSecondary"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                      lineHeight: "1.6",
                    }}
                  >
                    Roles define permissions and task assignment
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsAddRoleDialogOpen(false)}
                    className="flex-1 px-6 py-3 text-[13px] text-[#626262] hover:text-foreground border border-[#E8E6E3] hover:border-foreground transition-colors duration-300 rounded-md"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.03em",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, this would add the role to a list
                      setIsAddRoleDialogOpen(false);
                      setNewRoleName("");
                    }}
                    className="flex-1 px-6 py-3 bg-foreground text-background text-[13px] hover:bg-[#3d3d3d] transition-colors duration-300 rounded-md"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 400,
                      letterSpacing: "0.03em",
                    }}
                  >
                    Add role
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
