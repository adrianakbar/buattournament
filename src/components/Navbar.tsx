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
  const { tournament, resetDefaultData } = useTournament();

  const liveMatches = tournament.events
    .flatMap((e) => e.matches)
    .filter((m) => m.status === 'live');

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-xs">
      {/* Top Brand Bar */}
      <div className="flex h-14 md:h-16 items-center justify-between px-3 md:px-8 gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <Trophy className="h-4 w-4 md:h-5 md:w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm md:text-lg tracking-tight truncate">
                BuatTournament
              </span>
              <Badge
                variant="outline"
                className="hidden xs:inline-flex border-emerald-600/30 text-emerald-700 bg-emerald-50 text-[9px] md:text-[10px] uppercase font-bold py-0 h-4"
              >
                Badminton
              </Badge>
            </div>
            <p className="text-[10px] md:text-xs text-muted-foreground truncate max-w-[150px] xs:max-w-[220px] md:max-w-[340px]">
              {tournament.name}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
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
                {liveMatches.length}
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
            Umpire
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
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={resetDefaultData}
            title="Reset sample data"
            className="text-xs h-8 hidden sm:flex gap-1"
          >
            <RotateCcw className="h-3 w-3 text-muted-foreground" />
            Reset
          </Button>

          <Button
            size="sm"
            onClick={onOpenNewTournament}
            className="text-xs h-7 md:h-8 px-2.5 md:px-3 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden xs:inline">New Tournament</span>
            <span className="xs:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Mobile Tab Navigation (Horizontal Scroll with snap) */}
      <div className="flex lg:hidden overflow-x-auto no-scrollbar border-t px-2 py-1.5 gap-1.5 bg-muted/40 text-xs">
        <Button
          variant={currentTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('overview')}
          className="text-xs h-7 px-2.5 shrink-0 rounded-full font-medium"
        >
          <Activity className="h-3 w-3 mr-1" />
          Overview
        </Button>
        <Button
          variant={currentTab === 'bracket' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('bracket')}
          className="text-xs h-7 px-2.5 shrink-0 rounded-full font-medium"
        >
          <GitBranch className="h-3 w-3 mr-1" />
          Draws
        </Button>
        <Button
          variant={currentTab === 'courts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('courts')}
          className="text-xs h-7 px-2.5 shrink-0 rounded-full font-medium"
        >
          <Tv className="h-3 w-3 mr-1" />
          Courts
          {liveMatches.length > 0 && (
            <Badge variant="destructive" className="ml-1 h-3.5 px-1 text-[9px] font-bold animate-pulse">
              {liveMatches.length}
            </Badge>
          )}
        </Button>
        <Button
          variant={currentTab === 'umpire' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('umpire')}
          className="text-xs h-7 px-2.5 shrink-0 rounded-full font-medium"
        >
          <Flame className="h-3 w-3 mr-1 text-amber-500" />
          Umpire
        </Button>
        <Button
          variant={currentTab === 'matches' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('matches')}
          className="text-xs h-7 px-2.5 shrink-0 rounded-full font-medium"
        >
          <Calendar className="h-3 w-3 mr-1" />
          Schedule
        </Button>
        <Button
          variant={currentTab === 'players' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onTabChange('players')}
          className="text-xs h-7 px-2.5 shrink-0 rounded-full font-medium"
        >
          <Users className="h-3 w-3 mr-1" />
          Players
        </Button>
      </div>
    </header>
  );
}
