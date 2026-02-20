'use client'
import { useState } from 'react';
import { MainLayout } from '@/components/MainLayout';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Hero } from '@/components/Hero';
import { Gallery } from '@/components/Gallery';
import { Filters } from '@/components/Filters';
import { Projects } from '@/components/Projects';
import { ProjectDetail } from '@/components/ProjectDetail';
import { Assets } from '@/components/Assets';
import { Settings } from '@/components/Settings';
import { AIGenerationFlow } from '@/components/AIGenerationFlow';
import { MoodBoards } from '@/components/MoodBoards';
import { SpaceFormDialog } from '@/components/SpaceFormDialog';
import { Team } from '@/components/Team';
import { Notifications } from '@/components/Notifications';
import React from 'react';

type View = 'home' | 'projects' | 'assets' | 'settings' | 'moodboard' | 'team' | 'projectDetail' | 'aiGeneration' | 'notifications';

export default function HomePage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [aiFlowSpaceName, setAiFlowSpaceName] = useState<string>('');
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
    setCurrentView('projectDetail');
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProject('');
  };

  const handleStartAIFlow = (spaceName?: string) => {
    setAiFlowSpaceName(spaceName || '');
    setCurrentView('aiGeneration');
  };

  const handleBackFromAIFlow = () => {
    setCurrentView('home');
    setAiFlowSpaceName('');
    setIsAIFlowFullView(false);
  };

  const handleAIFlowFullViewChange = (isFullView: boolean) => {
    setIsAIFlowFullView(isFullView);
  };

  const handleCreateSpace = () => {
    setIsCreateSpaceDialogOpen(true);
  };

  const handleCreateSpaceFromDialog = (data: { name: string; type: string; category: string; description: string }) => {
    setIsCreateSpaceDialogOpen(false);
    handleStartAIFlow(data.name);
  };

  const handleEditSpace = (spaceId: string, spaceData: any) => {
    // Redirect to AI generation flow with prefilled data
    handleStartAIFlow(spaceData.name);
  };

  const handleViewSpace = (spaceId: string) => {
    // Set to full view mode
    setIsAIFlowFullView(true);
    // Could add more logic here to load specific space data
  };

  const showNavigation = !isAIFlowFullView || currentView !== 'aiGeneration';

  return (
    <>
    <MainLayout
      header={
        showNavigation ? (
          <Header
            onHomeClick={toggleSidebar}
            onNotificationsClick={() => handleNavigation('notifications')}
          />
        ) : null
      }
      sidebar={
        showNavigation ? (
          <Sidebar
            isExpanded={isSidebarExpanded}
            onToggle={toggleSidebar}
            currentView={
                currentView === 'projectDetail'
                  ? 'projects'
                  : currentView === 'aiGeneration' || currentView === 'notifications'
                    ? 'home'
                    : currentView
              }
            onNavigate={handleNavigation}
          />
        ) : undefined
      }
      sidebarExpanded={isSidebarExpanded}
    >
      {currentView === 'home' ? (
        <>
          <Hero onStartAIFlow={() => handleStartAIFlow()} onCreateSpace={handleCreateSpace} />
          <Gallery onEditSpace={handleEditSpace} onViewSpace={handleViewSpace} />
        </>
      ) : currentView === 'projects' ? (
        <Projects onProjectClick={handleProjectClick} />
      ) : currentView === 'projectDetail' ? (
        <ProjectDetail
          projectName={selectedProject}
          onBack={handleBackToProjects}
          onSpaceClick={(spaceName) => handleStartAIFlow(spaceName)}
        />
      ) : currentView === 'assets' ? (
        <Assets />
      ) : currentView === 'settings' ? (
        <Settings />
      ) : currentView === 'moodboard' ? (
        <MoodBoards />
      ) : currentView === 'team' ? (
        <Team />
      ) : currentView === 'notifications' ? (
        <Notifications />
      ) : (
        <AIGenerationFlow
          initialSpaceName={aiFlowSpaceName}
          onBack={handleBackFromAIFlow}
          onFullViewChange={handleAIFlowFullViewChange}
        />
      )}

      {currentView === 'home' && <Filters />}
    </MainLayout>

    <SpaceFormDialog
      isOpen={isCreateSpaceDialogOpen}
      onClose={() => setIsCreateSpaceDialogOpen(false)}
      mode="create"
      onCreate={handleCreateSpaceFromDialog}
    />
    </>
  );
}