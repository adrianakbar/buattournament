'use client';

import React from 'react';
import { useTournament } from '@/lib/tournament-store';
import { checkGameStatus, checkMatchStatus } from '@/lib/badminton-rules';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RotateCcw,
  Trophy,
  Flame,
  ArrowLeft,
  Tv,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface UmpireConsoleProps {
  onBackToDraws: () => void;
}

export function UmpireConsole({ onBackToDraws }: UmpireConsoleProps) {
  const {
    tournament,
    umpireMatchId,
    setUmpireMatchId,
    umpireMatch,
    addPoint,
    undoPoint,
    setMatchServer,
  } = useTournament();

  const allMatches = tournament.events.flatMap((e) =>
    e.matches.map((m) => ({ ...m, category: e.category, eventName: e.name }))
  );

  // If no match selected, show a selector
  if (!umpireMatch) {
    return (
      <Card className="max-w-2xl mx-auto my-8 border shadow-sm text-center p-8 space-y-6">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <Flame className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Electronic Umpire Console</h2>
          <p className="text-sm text-muted-foreground">
            Select a match to start scoring with official BWF 3x21 rally point rules.
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <Select onValueChange={(id: string | null) => setUmpireMatchId(id)}>
            <SelectTrigger className="h-10 text-xs">
              <SelectValue placeholder="Choose match to umpire..." />
            </SelectTrigger>
            <SelectContent>
              {allMatches.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs">
                  M#{m.matchNumber} [{m.category}] {m.entry1?.player1.name || 'TBD'} vs{' '}
                  {m.entry2?.player1.name || 'TBD'} ({m.status.toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={onBackToDraws} className="gap-1.5 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Bracket
          </Button>
        </div>
      </Card>
    );
  }

  const p1Name = umpireMatch.entry1?.player2
    ? `${umpireMatch.entry1.player1.name} / ${umpireMatch.entry1.player2.name}`
    : umpireMatch.entry1?.player1.name || 'Player 1';

  const p2Name = umpireMatch.entry2?.player2
    ? `${umpireMatch.entry2.player1.name} / ${umpireMatch.entry2.player2.name}`
    : umpireMatch.entry2?.player1.name || 'Player 2';

  const p1Club = umpireMatch.entry1?.player2
    ? `${umpireMatch.entry1.player1.club} / ${umpireMatch.entry1.player2.club}`
    : umpireMatch.entry1?.player1.club || '';

  const p2Club = umpireMatch.entry2?.player2
    ? `${umpireMatch.entry2.player1.club} / ${umpireMatch.entry2.player2.club}`
    : umpireMatch.entry2?.player1.club || '';

  const currentSetIdx = (umpireMatch.score.currentSet || 1) - 1;
  const currentGame = umpireMatch.score.games[currentSetIdx] || { setNumber: 1, p1: 0, p2: 0 };
  const currentSetNum = umpireMatch.score.currentSet || 1;

  // BWF checks
  const gameStatus = checkGameStatus(currentGame);
  const matchStatus = checkMatchStatus(umpireMatch.score.games);

  const server = umpireMatch.score.currentServer || 1;
  const serverScore = server === 1 ? currentGame.p1 : currentGame.p2;
  const serviceCourt = serverScore % 2 === 0 ? 'Right Service Box (Even)' : 'Left Service Box (Odd)';

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between bg-card p-3 rounded-xl border shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBackToDraws} className="h-8 gap-1 text-xs">
            <ArrowLeft className="h-3.5 w-3.5" /> Bracket
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-semibold text-xs bg-muted">
              Match #{umpireMatch.matchNumber}
            </Badge>
            <span className="text-xs font-semibold text-foreground">
              {umpireMatch.roundName}
            </span>
            {umpireMatch.courtNumber && (
              <Badge className="bg-emerald-600 text-white text-[10px]">
                Court {umpireMatch.courtNumber}
              </Badge>
            )}
          </div>
        </div>

        {/* Change Match Dropdown */}
        <div className="flex items-center gap-2">
          <Select value={umpireMatch.id} onValueChange={(id: string | null) => setUmpireMatchId(id)}>
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue placeholder="Switch match" />
            </SelectTrigger>
            <SelectContent>
              {allMatches.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs">
                  M#{m.matchNumber} {m.entry1?.player1.name || 'TBD'} vs{' '}
                  {m.entry2?.player1.name || 'TBD'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Scoreboard Display */}
      <Card className="border shadow-lg overflow-hidden bg-gradient-to-b from-card to-muted/20">
        <CardContent className="p-6 md:p-8 space-y-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between pb-3 border-b text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-foreground">
                Game {currentSetNum} of 3
              </span>
              {gameStatus.isDeuce && (
                <Badge variant="destructive" className="animate-pulse text-[10px]">
                  DEUCE (Lead by 2 / Cap 30)
                </Badge>
              )}
              {gameStatus.isInterval && (
                <Badge className="bg-amber-500 text-white text-[10px]">
                  11-PT INTERVAL (60s Rest)
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px]">
                Sets Won: <strong className="text-foreground">{matchStatus.setsWon.p1} - {matchStatus.setsWon.p2}</strong>
              </span>
            </div>
          </div>

          {/* Player Columns */}
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            {/* Player 1 Side */}
            <div
              className={`rounded-2xl border-2 p-6 flex flex-col justify-between transition-all ${
                server === 1
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-md'
                  : 'border-border bg-card'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Side 1
                  </span>
                  {server === 1 && (
                    <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> SERVING
                    </Badge>
                  )}
                </div>
                <h3 className="text-base md:text-xl font-extrabold tracking-tight truncate">
                  {p1Name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">{p1Club}</p>
              </div>

              {/* Big Score Number */}
              <div className="my-6 text-center">
                <span className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-foreground select-none">
                  {currentGame.p1}
                </span>
              </div>

              {/* +1 Button */}
              <Button
                size="lg"
                disabled={umpireMatch.status === 'finished'}
                className="w-full h-14 md:h-16 text-lg md:text-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-98 transition-transform"
                onClick={() => addPoint(umpireMatch.id, 1)}
              >
                +1 POINT ({p1Name.split(' ')[0]})
              </Button>
            </div>

            {/* Player 2 Side */}
            <div
              className={`rounded-2xl border-2 p-6 flex flex-col justify-between transition-all ${
                server === 2
                  ? 'border-emerald-500 bg-emerald-50/40 shadow-md'
                  : 'border-border bg-card'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Side 2
                  </span>
                  {server === 2 && (
                    <Badge className="bg-emerald-600 text-white text-[10px] gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> SERVING
                    </Badge>
                  )}
                </div>
                <h3 className="text-base md:text-xl font-extrabold tracking-tight truncate">
                  {p2Name}
                </h3>
                <p className="text-xs text-muted-foreground truncate">{p2Club}</p>
              </div>

              {/* Big Score Number */}
              <div className="my-6 text-center">
                <span className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-foreground select-none">
                  {currentGame.p2}
                </span>
              </div>

              {/* +1 Button */}
              <Button
                size="lg"
                disabled={umpireMatch.status === 'finished'}
                className="w-full h-14 md:h-16 text-lg md:text-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-98 transition-transform"
                onClick={() => addPoint(umpireMatch.id, 2)}
              >
                +1 POINT ({p2Name.split(' ')[0]})
              </Button>
            </div>
          </div>

          {/* Service Direction & Umpire Helper */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/50 border text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Service Court:</span>
              <Badge variant="secondary" className="font-semibold text-foreground">
                {serviceCourt}
              </Badge>
            </div>

            {/* Change Server / Undo Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={() => setMatchServer(umpireMatch.id, server === 1 ? 2 : 1)}
              >
                Toggle Server
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 border-rose-200 text-rose-700 hover:bg-rose-50"
                onClick={() => undoPoint(umpireMatch.id)}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Undo Point
              </Button>
            </div>
          </div>

          {/* Game Sets Summary Bar */}
          <div className="p-3 bg-card border rounded-lg flex items-center justify-between text-xs">
            <span className="font-semibold text-muted-foreground">Previous Sets:</span>
            <div className="flex items-center gap-3 font-mono">
              {umpireMatch.score.games.map((g, i) => (
                <div
                  key={i}
                  className={`px-3 py-1 rounded border text-xs ${
                    i === currentSetIdx
                      ? 'bg-emerald-100/60 border-emerald-300 font-bold text-emerald-950'
                      : 'bg-muted/40 font-medium'
                  }`}
                >
                  Set {i + 1}: {g.p1} - {g.p2}
                </div>
              ))}
            </div>
          </div>

          {/* Match Finished Notification */}
          {umpireMatch.status === 'finished' && (
            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-base">Match Completed!</h4>
                  <p className="text-xs text-emerald-800">
                    Winner:{' '}
                    <strong>
                      {umpireMatch.winnerId === umpireMatch.entry1?.id ? p1Name : p2Name}
                    </strong>{' '}
                    has been advanced to the next round in the tournament bracket.
                  </p>
                </div>
              </div>
              <Button
                onClick={onBackToDraws}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
              >
                View in Bracket
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
