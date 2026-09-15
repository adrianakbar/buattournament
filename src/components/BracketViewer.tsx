'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/tournament-store';
import { Match, Entry } from '@/types/tournament';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, Flame, Shuffle, Trophy, Tv, Users } from 'lucide-react';

interface BracketViewerProps {
  onOpenUmpire: (matchId: string) => void;
  onOpenGenerateDraw: () => void;
}

export function BracketViewer({ onOpenUmpire, onOpenGenerateDraw }: BracketViewerProps) {
  const {
    tournament,
    selectedEventId,
    setSelectedEventId,
    activeEvent,
    assignCourt,
    setMatchStatus,
    finishMatchManually,
  } = useTournament();

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  if (!activeEvent) {
    return <div className="p-8 text-center text-muted-foreground">No event found.</div>;
  }

  // Group matches by round
  const matchesByRound: Record<number, Match[]> = {};
  for (const match of activeEvent.matches) {
    if (!matchesByRound[match.roundNumber]) {
      matchesByRound[match.roundNumber] = [];
    }
    matchesByRound[match.roundNumber].push(match);
  }

  const sortedRounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  const formatPlayerName = (entry?: Entry | null) => {
    if (!entry) return 'To Be Decided (TBD)';
    if (entry.player2) {
      return `${entry.player1.name} / ${entry.player2.name}`;
    }
    return entry.player1.name;
  };

  const formatPlayerClub = (entry?: Entry | null) => {
    if (!entry) return '';
    if (entry.player2) {
      return `${entry.player1.club} / ${entry.player2.club}`;
    }
    return entry.player1.club;
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Categories & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">{activeEvent.name}</h2>
            <Badge variant="secondary" className="text-xs">
              {activeEvent.bracketSize}-Player Draw
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            BWF Knockout Single Elimination • {activeEvent.entries.length} registered entries
          </p>
        </div>

        {/* Category Tabs & Draw Generator */}
        <div className="flex items-center gap-2 flex-wrap">
          <Tabs value={selectedEventId} onValueChange={setSelectedEventId}>
            <TabsList className="h-9">
              {tournament.events.map((evt) => (
                <TabsTrigger key={evt.id} value={evt.id} className="text-xs px-3">
                  {evt.category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenGenerateDraw}
            className="text-xs h-9 gap-1.5 border-emerald-600/30 text-emerald-700 hover:bg-emerald-50"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Re-seed & Draw
          </Button>
        </div>
      </div>

      {/* Bracket Tree Container */}
      <div className="overflow-x-auto pb-8 pt-2">
        <div className="flex gap-8 min-w-max px-2">
          {sortedRounds.map((roundNum) => {
            const matches = matchesByRound[roundNum] || [];
            const roundTitle = matches[0]?.roundName || `Round ${roundNum}`;

            return (
              <div key={roundNum} className="w-[300px] flex flex-col">
                {/* Round Title */}
                <div className="text-center mb-4 sticky top-16 z-10 bg-background/90 backdrop-blur py-1.5 rounded-md border shadow-xs">
                  <span className="font-semibold text-xs tracking-wider uppercase text-muted-foreground">
                    {roundTitle}
                  </span>
                  <span className="text-[11px] text-muted-foreground/70 ml-1.5">
                    ({matches.length} {matches.length === 1 ? 'Match' : 'Matches'})
                  </span>
                </div>

                {/* Match Cards in this round */}
                <div className="flex flex-col justify-around flex-grow gap-6">
                  {matches.map((match) => {
                    const isLive = match.status === 'live';
                    const isFinished = match.status === 'finished';
                    const isBye = match.isBye;

                    const p1Won = isFinished && match.winnerId === match.entry1?.id;
                    const p2Won = isFinished && match.winnerId === match.entry2?.id;

                    return (
                      <div key={match.id} className="relative group">
                        <Card
                          onClick={() => setSelectedMatch(match)}
                          className={`cursor-pointer transition-all duration-150 hover:shadow-md border text-xs overflow-hidden ${
                            isLive
                              ? 'ring-2 ring-emerald-500 shadow-sm border-emerald-300'
                              : 'hover:border-muted-foreground/40'
                          }`}
                        >
                          {/* Match Header Bar */}
                          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/40 border-b text-[11px] text-muted-foreground font-medium">
                            <span className="font-semibold text-foreground/80">
                              M#{match.matchNumber}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {match.courtNumber && (
                                <Badge variant="outline" className="h-4 px-1 text-[10px] bg-background">
                                  Court {match.courtNumber}
                                </Badge>
                              )}
                              {isLive && (
                                <Badge variant="destructive" className="h-4 px-1.5 text-[9px] font-bold tracking-wide animate-pulse">
                                  LIVE
                                </Badge>
                              )}
                              {isBye && (
                                <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                                  BYE
                                </Badge>
                              )}
                            </div>
                          </div>

                          <CardContent className="p-0 divide-y">
                            {/* Player 1 Row */}
                            <div
                              className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                                p1Won
                                  ? 'bg-emerald-50/70 font-semibold text-emerald-950'
                                  : p2Won
                                  ? 'text-muted-foreground line-through opacity-75'
                                  : ''
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                {match.entry1?.seed && (
                                  <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                    [{match.entry1.seed}]
                                  </span>
                                )}
                                <div className="truncate">
                                  <div className="truncate">{formatPlayerName(match.entry1)}</div>
                                  <div className="text-[10px] text-muted-foreground truncate font-normal">
                                    {formatPlayerClub(match.entry1)}
                                  </div>
                                </div>
                              </div>

                              {/* Scores */}
                              <div className="flex items-center gap-1.5 font-mono text-xs shrink-0">
                                {match.score.games.map((g, i) => (
                                  <span
                                    key={i}
                                    className={`w-5 text-center ${
                                      g.p1 > g.p2 ? 'font-bold text-foreground' : 'text-muted-foreground'
                                    }`}
                                  >
                                    {g.p1}
                                  </span>
                                ))}
                                {p1Won && <Check className="h-3.5 w-3.5 text-emerald-600 ml-0.5" />}
                              </div>
                            </div>

                            {/* Player 2 Row */}
                            <div
                              className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                                p2Won
                                  ? 'bg-emerald-50/70 font-semibold text-emerald-950'
                                  : p1Won
                                  ? 'text-muted-foreground line-through opacity-75'
                                  : ''
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                {match.entry2?.seed && (
                                  <span className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                    [{match.entry2.seed}]
                                  </span>
                                )}
                                <div className="truncate">
                                  <div className="truncate">{formatPlayerName(match.entry2)}</div>
                                  <div className="text-[10px] text-muted-foreground truncate font-normal">
                                    {formatPlayerClub(match.entry2)}
                                  </div>
                                </div>
                              </div>

                              {/* Scores */}
                              <div className="flex items-center gap-1.5 font-mono text-xs shrink-0">
                                {match.score.games.map((g, i) => (
                                  <span
                                    key={i}
                                    className={`w-5 text-center ${
                                      g.p2 > g.p1 ? 'font-bold text-foreground' : 'text-muted-foreground'
                                    }`}
                                  >
                                    {g.p2}
                                  </span>
                                ))}
                                {p2Won && <Check className="h-3.5 w-3.5 text-emerald-600 ml-0.5" />}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Match Quick Actions Modal */}
      {selectedMatch && (
        <Dialog open={!!selectedMatch} onOpenChange={(open) => !open && setSelectedMatch(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Match #{selectedMatch.matchNumber}</span>
                <Badge variant={selectedMatch.status === 'live' ? 'destructive' : 'secondary'}>
                  {selectedMatch.status.toUpperCase()}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedMatch.roundName} • {activeEvent.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              {/* Matchup Summary */}
              <div className="p-3 rounded-lg bg-muted/50 border space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">
                    {formatPlayerName(selectedMatch.entry1)}
                  </div>
                  <div className="font-mono font-bold">
                    {selectedMatch.score.games.map((g) => g.p1).join(' - ')}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-center font-semibold uppercase tracking-wider">
                  VS
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">
                    {formatPlayerName(selectedMatch.entry2)}
                  </div>
                  <div className="font-mono font-bold">
                    {selectedMatch.score.games.map((g) => g.p2).join(' - ')}
                  </div>
                </div>
              </div>

              {/* Court Allocation */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Assign Court</label>
                <Select
                  value={selectedMatch.courtNumber ? String(selectedMatch.courtNumber) : 'none'}
                  onValueChange={(val) => {
                    const num = val === 'none' ? null : Number(val);
                    assignCourt(selectedMatch.id, num);
                    setSelectedMatch({ ...selectedMatch, courtNumber: num });
                  }}
                >
                  <SelectTrigger className="w-full h-9 text-xs">
                    <SelectValue placeholder="Select Court" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {Array.from({ length: tournament.courtsCount }, (_, i) => i + 1).map((c) => (
                      <SelectItem key={c} value={String(c)}>
                        Court {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Match Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Match Status</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedMatch.status === 'upcoming' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setMatchStatus(selectedMatch.id, 'upcoming');
                      setSelectedMatch({ ...selectedMatch, status: 'upcoming' });
                    }}
                  >
                    Upcoming
                  </Button>
                  <Button
                    variant={selectedMatch.status === 'live' ? 'destructive' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setMatchStatus(selectedMatch.id, 'live');
                      setSelectedMatch({ ...selectedMatch, status: 'live' });
                    }}
                  >
                    Live
                  </Button>
                  <Button
                    variant={selectedMatch.status === 'finished' ? 'secondary' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setMatchStatus(selectedMatch.id, 'finished');
                      setSelectedMatch({ ...selectedMatch, status: 'finished' });
                    }}
                  >
                    Finished
                  </Button>
                </div>
              </div>

              {/* Open Umpire Console Button */}
              <div className="pt-2">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-medium"
                  onClick={() => {
                    onOpenUmpire(selectedMatch.id);
                    setSelectedMatch(null);
                  }}
                >
                  <Flame className="h-4 w-4 text-amber-300" />
                  Open Umpire Score Console
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
