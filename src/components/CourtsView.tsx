'use client';

import React from 'react';
import { useTournament } from '@/lib/tournament-store';
import { Match, Entry } from '@/types/tournament';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, Play, Tv, Clock, CheckCircle2 } from 'lucide-react';

interface CourtsViewProps {
  onOpenUmpire: (matchId: string) => void;
}

export function CourtsView({ onOpenUmpire }: CourtsViewProps) {
  const { tournament, setMatchStatus } = useTournament();

  const allMatches = tournament.events.flatMap((e) =>
    e.matches.map((m) => ({ ...m, category: e.category, eventName: e.name }))
  );

  const formatPlayerName = (entry?: Entry | null) => {
    if (!entry) return 'TBD';
    if (entry.player2) {
      return `${entry.player1.name} / ${entry.player2.name}`;
    }
    return entry.player1.name;
  };

  const courts = Array.from({ length: tournament.courtsCount }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-card p-4 rounded-xl border shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Courts & Order of Play</h2>
          <p className="text-xs text-muted-foreground">
            Live matches and court queue schedules across all {tournament.courtsCount} courts.
          </p>
        </div>
      </div>

      {/* Grid of Courts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {courts.map((courtNum) => {
          const courtMatches = allMatches.filter((m) => m.courtNumber === courtNum);
          const liveMatch = courtMatches.find((m) => m.status === 'live');
          const queueMatches = courtMatches.filter((m) => m.status === 'upcoming');
          const finishedMatches = courtMatches.filter((m) => m.status === 'finished');

          return (
            <Card key={courtNum} className="border shadow-sm flex flex-col h-full overflow-hidden">
              {/* Court Header */}
              <CardHeader className="py-3 px-4 bg-muted/30 border-b flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <CardTitle className="text-sm font-bold tracking-wide uppercase">
                    Court {courtNum}
                  </CardTitle>
                </div>
                {liveMatch ? (
                  <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold animate-pulse">
                    MATCH LIVE
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-medium text-muted-foreground">
                    AVAILABLE
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="p-4 flex-grow flex flex-col justify-between space-y-4">
                {/* ACTIVE LIVE MATCH */}
                {liveMatch ? (
                  <div className="rounded-lg border bg-card p-3 shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        M#{liveMatch.matchNumber} • {liveMatch.category}
                      </span>
                      <span>{liveMatch.roundName}</span>
                    </div>

                    {/* Live Score Board */}
                    <div className="space-y-2 bg-muted/40 p-2.5 rounded-md border font-sans">
                      {/* Player 1 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                          {liveMatch.score.currentServer === 1 && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" title="Serving" />
                          )}
                          <span className="text-xs font-semibold truncate">
                            {formatPlayerName(liveMatch.entry1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-sm font-bold">
                          {liveMatch.score.games.map((g, i) => (
                            <span
                              key={i}
                              className={`w-6 text-center ${
                                i === liveMatch.score.currentSet - 1
                                  ? 'text-emerald-600 font-extrabold text-base'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {g.p1}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Player 2 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                          {liveMatch.score.currentServer === 2 && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" title="Serving" />
                          )}
                          <span className="text-xs font-semibold truncate">
                            {formatPlayerName(liveMatch.entry2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-sm font-bold">
                          {liveMatch.score.games.map((g, i) => (
                            <span
                              key={i}
                              className={`w-6 text-center ${
                                i === liveMatch.score.currentSet - 1
                                  ? 'text-emerald-600 font-extrabold text-base'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {g.p2}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      size="sm"
                      className="w-full text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-medium"
                      onClick={() => onOpenUmpire(liveMatch.id)}
                    >
                      <Flame className="h-3.5 w-3.5 text-amber-300" />
                      Umpire Live Console
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-xs flex flex-col items-center justify-center gap-1.5 bg-muted/10">
                    <Tv className="h-6 w-6 text-muted-foreground/40 mb-1" />
                    <span className="font-medium">No live match on court</span>
                    <span>Assign from upcoming queue</span>
                  </div>
                )}

                {/* COURT QUEUE / NEXT MATCHES */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Next Up ({queueMatches.length})
                    </span>
                  </div>

                  {queueMatches.length > 0 ? (
                    <div className="space-y-1.5">
                      {queueMatches.slice(0, 3).map((match, idx) => (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/30 border text-[11px] hover:bg-muted/60 transition-colors"
                        >
                          <div className="truncate max-w-[180px]">
                            <div className="font-medium truncate">
                              {formatPlayerName(match.entry1)} vs {formatPlayerName(match.entry2)}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              M#{match.matchNumber} • {match.roundName}
                            </div>
                          </div>
                          {!liveMatch && idx === 0 && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-[10px] gap-1 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                              onClick={() => {
                                setMatchStatus(match.id, 'live');
                                onOpenUmpire(match.id);
                              }}
                            >
                              <Play className="h-2.5 w-2.5" />
                              Start
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[11px] text-muted-foreground italic py-1">
                      Queue empty.
                    </div>
                  )}
                </div>

                {/* COMPLETED MATCHES ON THIS COURT */}
                {finishedMatches.length > 0 && (
                  <div className="text-[11px] text-muted-foreground pt-1 border-t flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    <span>{finishedMatches.length} match(es) completed today</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
