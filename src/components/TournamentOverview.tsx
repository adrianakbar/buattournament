'use client';

import React from 'react';
import { useTournament } from '@/lib/tournament-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Trophy,
  Users,
  Tv,
  Calendar,
  CheckCircle2,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface TournamentOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenUmpire: (matchId: string) => void;
}

export function TournamentOverview({ onNavigateTab, onOpenUmpire }: TournamentOverviewProps) {
  const { tournament } = useTournament();

  const allMatches = tournament.events.flatMap((e) =>
    e.matches.map((m) => ({ ...m, category: e.category, eventName: e.name }))
  );

  const totalMatches = allMatches.length;
  const finishedMatches = allMatches.filter((m) => m.status === 'finished');
  const liveMatches = allMatches.filter((m) => m.status === 'live');
  const upcomingMatches = allMatches.filter((m) => m.status === 'upcoming');

  const totalEntries = tournament.events.reduce((acc, evt) => acc + evt.entries.length, 0);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hero Tournament Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none hidden sm:block">
          <Trophy className="w-72 h-72" />
        </div>

        <div className="max-w-2xl space-y-2 md:space-y-3 relative z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30 text-[10px] md:text-xs uppercase tracking-wide py-0">
              BWF Standard Rules
            </Badge>
            <Badge className="bg-amber-400/20 text-amber-200 border-amber-300/30 text-[10px] md:text-xs py-0">
              {tournament.status.toUpperCase()}
            </Badge>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight text-white leading-tight">
            {tournament.name}
          </h1>

          <p className="text-xs md:text-base text-emerald-100/80">
            {tournament.venue} • {tournament.city}
          </p>

          <div className="flex items-center gap-3 sm:gap-6 text-[11px] md:text-xs text-emerald-200/70 pt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {tournament.startDate} to {tournament.endDate}
            </span>
            <span className="flex items-center gap-1">
              <Tv className="h-3.5 w-3.5" />
              {tournament.courtsCount} Courts
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {tournament.events.length} Categories
            </span>
          </div>
        </div>
      </div>

      {/* Metric Stats Cards (2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <Card className="border shadow-2xs">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase">
                Players
              </p>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5 tracking-tight">{totalEntries}</h3>
              <p className="text-[9px] sm:text-[11px] text-muted-foreground mt-0.5 truncate">
                All events
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-2xs">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase">
                Live Now
              </p>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5 tracking-tight text-rose-600 flex items-center gap-1.5">
                {liveMatches.length}
                {liveMatches.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </h3>
              <p className="text-[9px] sm:text-[11px] text-muted-foreground mt-0.5 truncate">
                On court
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-2xs">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase">
                Finished
              </p>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5 tracking-tight">
                {finishedMatches.length}
              </h3>
              <p className="text-[9px] sm:text-[11px] text-muted-foreground mt-0.5 truncate">
                of {totalMatches} matches
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-2xs">
          <CardContent className="p-3 sm:p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase">
                Upcoming
              </p>
              <h3 className="text-xl sm:text-2xl font-bold mt-0.5 tracking-tight">
                {upcomingMatches.length}
              </h3>
              <p className="text-[9px] sm:text-[11px] text-muted-foreground mt-0.5 truncate">
                Queue queue
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Live Matches Spotlight */}
      {liveMatches.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm md:text-base tracking-tight flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Live Matches in Progress
            </h3>
            <Button
              variant="link"
              size="sm"
              onClick={() => onNavigateTab('courts')}
              className="text-xs text-emerald-600 gap-1 p-0 h-auto font-semibold"
            >
              All courts <ArrowRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {liveMatches.map((m) => (
              <Card key={m.id} className="border-2 border-emerald-500/60 shadow-xs overflow-hidden">
                <div className="bg-emerald-600/10 px-3 py-1.5 border-b flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="destructive" className="h-4 px-1 text-[8px] font-bold animate-pulse">
                      LIVE
                    </Badge>
                    <span className="font-bold text-foreground text-[11px]">Court {m.courtNumber || 1}</span>
                    <span className="text-muted-foreground text-[11px]">• {m.category}</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">{m.roundName}</span>
                </div>

                <CardContent className="p-3 md:p-4 space-y-2.5">
                  <div className="space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 truncate max-w-[170px] sm:max-w-[200px] font-sans">
                        {m.score.currentServer === 1 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        )}
                        <span className="font-bold truncate">
                          {m.entry1?.player2
                            ? `${m.entry1.player1.name} / ${m.entry1.player2.name}`
                            : m.entry1?.player1.name || 'TBD'}
                        </span>
                      </div>
                      <div className="flex gap-1.5 font-bold">
                        {m.score.games.map((g, i) => (
                          <span
                            key={i}
                            className={`w-5 text-center ${
                              i === m.score.currentSet - 1
                                ? 'font-black text-emerald-600 text-sm sm:text-base'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {g.p1}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 truncate max-w-[170px] sm:max-w-[200px] font-sans">
                        {m.score.currentServer === 2 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                        )}
                        <span className="font-bold truncate">
                          {m.entry2?.player2
                            ? `${m.entry2.player1.name} / ${m.entry2.player2.name}`
                            : m.entry2?.player1.name || 'TBD'}
                        </span>
                      </div>
                      <div className="flex gap-1.5 font-bold">
                        {m.score.games.map((g, i) => (
                          <span
                            key={i}
                            className={`w-5 text-center ${
                              i === m.score.currentSet - 1
                                ? 'font-black text-emerald-600 text-sm sm:text-base'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {g.p2}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-medium"
                    onClick={() => onOpenUmpire(m.id)}
                  >
                    <Flame className="h-3.5 w-3.5 text-amber-300" />
                    Open Umpire Scorekeeper
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <Card
          onClick={() => onNavigateTab('bracket')}
          className="border hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer p-3.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2">
              <Trophy className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-emerald-600 transition-transform" />
          </div>
          <h4 className="font-bold text-xs md:text-sm">Draws & Bracket Tree</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
            Visual BWF tournament bracket with seed indicators and PDF export.
          </p>
        </Card>

        <Card
          onClick={() => onNavigateTab('courts')}
          className="border hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer p-3.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2">
              <Tv className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-blue-600 transition-transform" />
          </div>
          <h4 className="font-bold text-xs md:text-sm">Court Order of Play</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
            Court allocation, active matches, and queue per court.
          </p>
        </Card>

        <Card
          onClick={() => onNavigateTab('umpire')}
          className="border hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer p-3.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
              <Flame className="h-4 w-4" />
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-amber-600 transition-transform" />
          </div>
          <h4 className="font-bold text-xs md:text-sm">Electronic Umpire Console</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
            Fast touch-friendly score console with BWF 3x21 rally point rules.
          </p>
        </Card>
      </div>

      {/* Rules Notice */}
      <div className="rounded-xl border bg-muted/30 p-3 text-[11px] text-muted-foreground flex items-center gap-2.5">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <div>
          <strong className="text-foreground">BWF Standard Rules:</strong> Best of 3 games to 21
          points • Deuce to 30 cap • 11-pt interval alert • Seed 1 & 2 opposite bracket halves.
        </div>
      </div>
    </div>
  );
}
