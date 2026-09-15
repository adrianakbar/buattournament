'use client';

import React, { useState } from 'react';
import { TournamentProvider, useTournament } from '@/lib/tournament-store';
import { Navbar } from '@/components/Navbar';
import { TournamentOverview } from '@/components/TournamentOverview';
import { BracketViewer } from '@/components/BracketViewer';
import { CourtsView } from '@/components/CourtsView';
import { UmpireConsole } from '@/components/UmpireConsole';
import { MatchList } from '@/components/MatchList';
import { PlayersList } from '@/components/PlayersList';
import { NewTournamentDialog } from '@/components/NewTournamentDialog';
import { GenerateDrawDialog } from '@/components/GenerateDrawDialog';
import { Toaster } from '@/components/ui/sonner';

function TournamentAppContent() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [isNewTournamentOpen, setIsNewTournamentOpen] = useState<boolean>(false);
  const [isGenerateDrawOpen, setIsGenerateDrawOpen] = useState<boolean>(false);

  const { setUmpireMatchId } = useTournament();

  const handleOpenUmpire = (matchId: string) => {
    setUmpireMatchId(matchId);
    setCurrentTab('umpire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenNewTournament={() => setIsNewTournamentOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        {currentTab === 'overview' && (
          <TournamentOverview
            onNavigateTab={setCurrentTab}
            onOpenUmpire={handleOpenUmpire}
          />
        )}

        {currentTab === 'bracket' && (
          <BracketViewer
            onOpenUmpire={handleOpenUmpire}
            onOpenGenerateDraw={() => setIsGenerateDrawOpen(true)}
          />
        )}

        {currentTab === 'courts' && (
          <CourtsView onOpenUmpire={handleOpenUmpire} />
        )}

        {currentTab === 'umpire' && (
          <UmpireConsole onBackToDraws={() => setCurrentTab('bracket')} />
        )}

        {currentTab === 'matches' && (
          <MatchList onOpenUmpire={handleOpenUmpire} />
        )}

        {currentTab === 'players' && <PlayersList />}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 px-4 md:px-8 bg-muted/20 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>BuatTournament</strong> • BWF Standard Badminton Tournament Software
          </span>
          <span className="text-[11px]">
            Designed with Next.js 16, Tailwind CSS v4 & shadcn/ui
          </span>
        </div>
      </footer>

      {/* Modals */}
      <NewTournamentDialog
        open={isNewTournamentOpen}
        onOpenChange={setIsNewTournamentOpen}
      />

      <GenerateDrawDialog
        open={isGenerateDrawOpen}
        onOpenChange={setIsGenerateDrawOpen}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}

export default function Page() {
  return (
    <TournamentProvider>
      <TournamentAppContent />
    </TournamentProvider>
  );
}
