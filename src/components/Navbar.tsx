'use client';

import React from 'react';
import { useTournament } from '@/lib/tournament-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Trophy,
  Tv,
  GitBranch,
  Calendar,
  Users,
  Activity,
  RotateCcw,
  Plus,
  Flame,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenNewTournament: () => void;
}

export function Navbar({ currentTab, onTabChange, onOpenNewTournament }: NavbarProps) {
  const { tournament, resetDefaultData, allLiveMatchesCount } = useTournament() as any;

  const liveMatches = tournament.events
    .flatMap((e: any) => e.matches)
    .filter((m: any) => m.status === 'live');

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight">BuatTournament</span>
              <Badge variant="outline" className="border-emerald-600/30 text-emerald-700 bg-emerald-50 text-[10px] uppercase font-semibold">
                Badminton
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[220px] md:max-w-[340px]">
              {tournament.name} • {tournament.venue}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-muted/60 p-1 rounded-lg border">
          <Button
            variant={currentTab === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('overview')}
            className="text-xs font-medium h-8 gap-1.5"
          >
            <Activity className="h-3.5 w-3.5" />
            Overview
          </Button>

          <Button
            variant={currentTab === 'bracket' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('bracket')}
            className="text-xs font-medium h-8 gap-1.5"
          >
            <GitBranch className="h-3.5 w-3.5" />
            Draws & Bracket
          </Button>

          <Button
            variant={currentTab === 'courts' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('courts')}
            className="text-xs font-medium h-8 gap-1.5"
          >
            <Tv className="h-3.5 w-3.5" />
            Courts
            {liveMatches.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-4 px-1 text-[10px] animate-pulse">
                {liveMatches.length} LIVE
              </Badge>
            )}
          </Button>

          <Button
            variant={currentTab === 'umpire' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('umpire')}
            className="text-xs font-medium h-8 gap-1.5"
          >
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            Umpire Console
          </Button>

          <Button
            variant={currentTab === 'matches' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('matches')}
            className="text-xs font-medium h-8 gap-1.5"
          >
            <Calendar className="h-3.5 w-3.5" />
            Schedule
          </Button>

          <Button
            variant={currentTab === 'players' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('players')}
            className="text-xs font-medium h-8 gap-1.5"
          >
            <Users className="h-3.5 w-3.5" />
            Players
          </Button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetDefaultData}
            title="Reset sample data"
            className="text-xs h-8 hidden sm:flex gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            Reset Data
          </Button>

          <Button
            size="sm"
            onClick={onOpenNewTournament}
            className="text-xs h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-3.5 w-3.5" />
            New Tournament
          </Button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex lg:hidden overflow-x-auto border-t px-2 py-1.5 gap-1 bg-muted/30">
        <Button
          variant={currentTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('overview')}
          className="text-xs h-7 px-2.5 shrink-0"
        >
          Overview
        </Button>
        <Button
          variant={currentTab === 'bracket' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('bracket')}
          className="text-xs h-7 px-2.5 shrink-0"
        >
          Draws
        </Button>
        <Button
          variant={currentTab === 'courts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('courts')}
          className="text-xs h-7 px-2.5 shrink-0"
        >
          Courts {liveMatches.length > 0 && `(${liveMatches.length})`}
        </Button>
        <Button
          variant={currentTab === 'umpire' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('umpire')}
          className="text-xs h-7 px-2.5 shrink-0"
        >
          Umpire
        </Button>
        <Button
          variant={currentTab === 'matches' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('matches')}
          className="text-xs h-7 px-2.5 shrink-0"
        >
          Schedule
        </Button>
        <Button
          variant={currentTab === 'players' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('players')}
          className="text-xs h-7 px-2.5 shrink-0"
        >
          Players
        </Button>
      </div>
    </header>
  );
}
