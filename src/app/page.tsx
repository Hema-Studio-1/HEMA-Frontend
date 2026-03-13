"use client";
import { AIGenerationFlow } from "@/components/AIGenerationFlow";
import { Assets } from "@/components/Assets";
import { Filters } from "@/components/Filters";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { MainLayout } from "@/components/MainLayout";
import { MoodBoards } from "@/components/MoodBoards";
import { Notifications } from "@/components/Notifications";
import { ProjectDetail } from "@/components/ProjectDetail";
import { Projects } from "@/components/Projects";
import { Settings } from "@/components/Settings";
import { Sidebar } from "@/components/Sidebar";
import { SpaceFormDialog } from "@/components/SpaceFormDialog";
import { Team } from "@/components/Team";
import { AIGenerationFlowProvider } from "@/contexts/AIGenerationFlowContext";
import type { SpaceWithRelations } from "@/types/space";
import { useState } from "react";

type View =
  | "home"
  | "projects"
  | "assets"
  | "settings"
  | "moodboard"
  | "team"
  | "projectDetail"
  | "aiGeneration"
  | "notifications";

export default function HomePage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [aiFlowSpaceName, setAiFlowSpaceName] = useState<string>("");
  const [isAIFlowFullView, setIsAIFlowFullView] = useState(false);
  const [isCreateSpaceDialogOpen, setIsCreateSpaceDialogOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleNavigation = (view: View) => {
    setCurrentView(view);
  };

  const handleProjectClick = (projectName: string) => {
    setSelectedProject(projectName);
    setCurrentView("projectDetail");
  };

  const handleBackToProjects = () => {
    setCurrentView("projects");
    setSelectedProject("");
  };

  const handleStartAIFlow = (spaceName?: string) => {
    setAiFlowSpaceName(spaceName || "");
    setCurrentView("aiGeneration");
  };

  const handleBackFromAIFlow = () => {
    setCurrentView("home");
    setAiFlowSpaceName("");
    setIsAIFlowFullView(false);
  };

  const handleAIFlowFullViewChange = (isFullView: boolean) => {
    setIsAIFlowFullView(isFullView);
  };

  const handleCreateSpace = () => {
    setIsCreateSpaceDialogOpen(true);
  };

  const handleCreateSpaceFromDialog = (space: SpaceWithRelations) => {
    setIsCreateSpaceDialogOpen(false);
    handleStartAIFlow(space.name);
  };

  const handleEditSpace = (
    _spaceId: string,
    spaceData: {
      name?: string;
      sourceSpace?: SpaceWithRelations;
    },
  ) => {
    const sourceName = spaceData?.sourceSpace?.name ?? spaceData?.name;
    handleStartAIFlow(sourceName);
  };

  const handleViewSpace = (_spaceId: string) => {
    // Set to full view mode
    setIsAIFlowFullView(true);
    // Could add more logic here to load specific space data
  };

  const showNavigation = !isAIFlowFullView || currentView !== "aiGeneration";

  return (
    <AIGenerationFlowProvider initialSpaceName={aiFlowSpaceName}>
      <MainLayout
        header={
          showNavigation ? (
            <Header
              onHomeClick={toggleSidebar}
              onNotificationsClick={() => handleNavigation("notifications")}
            />
          ) : null
        }
        sidebar={
          showNavigation ? (
            <Sidebar
              isExpanded={isSidebarExpanded}
              onToggle={toggleSidebar}
              currentView={
                currentView === "projectDetail"
                  ? "projects"
                  : currentView === "aiGeneration" ||
                      currentView === "notifications"
                    ? "home"
                    : currentView
              }
              onNavigate={handleNavigation}
            />
          ) : undefined
        }
        sidebarExpanded={isSidebarExpanded}
      >
        {currentView === "home" ? (
          <>
            <Hero
              onStartAIFlow={() => handleStartAIFlow()}
              onCreateSpace={handleCreateSpace}
            />
            <Gallery
              onEditSpace={handleEditSpace}
              onViewSpace={handleViewSpace}
            />
          </>
        ) : currentView === "projects" ? (
          <Projects onProjectClick={handleProjectClick} />
        ) : currentView === "projectDetail" ? (
          <ProjectDetail
            projectName={selectedProject}
            onBack={handleBackToProjects}
            onSpaceClick={(spaceName) => handleStartAIFlow(spaceName)}
          />
        ) : currentView === "assets" ? (
          <Assets />
        ) : currentView === "settings" ? (
          <Settings />
        ) : currentView === "moodboard" ? (
          <MoodBoards />
        ) : currentView === "team" ? (
          <Team />
        ) : currentView === "notifications" ? (
          <Notifications />
        ) : (
          <AIGenerationFlow
            onBack={handleBackFromAIFlow}
            onFullViewChange={handleAIFlowFullViewChange}
          />
        )}

        {currentView === "home" && <Filters />}
      </MainLayout>

      <SpaceFormDialog
        isOpen={isCreateSpaceDialogOpen}
        onClose={() => setIsCreateSpaceDialogOpen(false)}
        mode="create"
        onCreate={handleCreateSpaceFromDialog}
      />
    </AIGenerationFlowProvider>
  );
}
