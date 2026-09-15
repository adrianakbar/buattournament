'use client';

import React from 'react';
import { useTournament } from '@/lib/tournament-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-6">
      {/* Hero Tournament Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <Trophy className="w-72 h-72" />
        </div>

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30 text-xs uppercase tracking-wide">
              Official BWF Standard
            </Badge>
            <Badge className="bg-amber-400/20 text-amber-200 border-amber-300/30 text-xs">
              {tournament.status.toUpperCase()}
            </Badge>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
            {tournament.name}
          </h1>

          <p className="text-sm md:text-base text-emerald-100/80">
            {tournament.venue} • {tournament.city} • Organized by {tournament.organization}
          </p>

          <div className="flex items-center gap-6 text-xs text-emerald-200/70 pt-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {tournament.startDate} to {tournament.endDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Tv className="h-4 w-4" />
              {tournament.courtsCount} Courts
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {tournament.events.length} Categories
            </span>
          </div>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Registered Players</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{totalEntries}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Across all categories</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Live Matches</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight text-rose-600 flex items-center gap-2">
                {liveMatches.length}
                {liveMatches.length > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Active on court</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Completed</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{finishedMatches.length}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                of {totalMatches} total matches
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Upcoming Queue</p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">{upcomingMatches.length}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Awaiting court call</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Live Matches Spotlight */}
      {liveMatches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              Live Matches in Progress
            </h3>
            <Button
              variant="link"
              size="sm"
              onClick={() => onNavigateTab('courts')}
              className="text-xs text-emerald-600 gap-1 p-0 h-auto font-semibold"
            >
              View all courts <ArrowRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((m) => (
              <Card key={m.id} className="border-2 border-emerald-500/60 shadow-sm overflow-hidden">
                <div className="bg-emerald-600/10 px-4 py-2 border-b flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="h-4 px-1.5 text-[9px] animate-pulse">
                      LIVE
                    </Badge>
                    <span className="font-bold text-foreground">Court {m.courtNumber || 1}</span>
                    <span className="text-muted-foreground">• {m.category}</span>
                  </div>
                  <span className="text-muted-foreground">{m.roundName}</span>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2 font-mono">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 truncate max-w-[200px] font-sans">
                        {m.score.currentServer === 1 && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                        <span className="font-bold truncate">
                          {m.entry1?.player2
                            ? `${m.entry1.player1.name} / ${m.entry1.player2.name}`
                            : m.entry1?.player1.name || 'TBD'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {m.score.games.map((g, i) => (
                          <span
                            key={i}
                            className={`w-6 text-center ${
                              i === m.score.currentSet - 1
                                ? 'font-black text-emerald-600 text-base'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {g.p1}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 truncate max-w-[200px] font-sans">
                        {m.score.currentServer === 2 && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                        )}
                        <span className="font-bold truncate">
                          {m.entry2?.player2
                            ? `${m.entry2.player1.name} / ${m.entry2.player2.name}`
                            : m.entry2?.player1.name || 'TBD'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {m.score.games.map((g, i) => (
                          <span
                            key={i}
                            className={`w-6 text-center ${
                              i === m.score.currentSet - 1
                                ? 'font-black text-emerald-600 text-base'
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
                    className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Card
          onClick={() => onNavigateTab('bracket')}
          className="border hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer p-4 group"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Trophy className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <h4 className="font-bold text-sm">Draws & Bracket Tree</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Visual BWF tournament bracket with seed indicators and automatic winner paths.
          </p>
        </Card>

        <Card
          onClick={() => onNavigateTab('courts')}
          className="border hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer p-4 group"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Tv className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <h4 className="font-bold text-sm">Court Order of Play</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Court allocation, active matches, and upcoming match queue per court.
          </p>
        </Card>

        <Card
          onClick={() => onNavigateTab('umpire')}
          className="border hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer p-4 group"
        >
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Flame className="h-5 w-5" />
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <h4 className="font-bold text-sm">Electronic Umpire Console</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Fast touch-friendly score console with BWF 3x21 rally point rules & undo.
          </p>
        </Card>
      </div>

      {/* Rules Notice */}
      <div className="rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
        <div>
          <strong className="text-foreground">BWF Standard Tournament Rules Enforced:</strong> Best
          of 3 games to 21 points • Deuce extends until 2-point difference or max 30 points cap •
          11-point interval rest alert • Automatic Bye distribution to top seeds.
        </div>
      </div>
    </div>
  );
}
