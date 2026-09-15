'use client';

import React from 'react';
import { Tournament, TournamentEvent, Match, Entry } from '@/types/tournament';
import { Trophy, Check } from 'lucide-react';

interface PrintableBracketSheetProps {
  tournament: Tournament;
  event: TournamentEvent;
}

export const PrintableBracketSheet = React.forwardRef<HTMLDivElement, PrintableBracketSheetProps>(
  ({ tournament, event }, ref) => {
    // Group matches by round
    const matchesByRound: Record<number, Match[]> = {};
    for (const match of event.matches) {
      if (!matchesByRound[match.roundNumber]) {
        matchesByRound[match.roundNumber] = [];
      }
      matchesByRound[match.roundNumber].push(match);
    }

    const sortedRounds = Object.keys(matchesByRound)
      .map(Number)
      .sort((a, b) => a - b);

    // Final match & champion
    const finalRoundNum = sortedRounds[sortedRounds.length - 1];
    const finalMatch = matchesByRound[finalRoundNum]?.[0];
    const championEntry =
      finalMatch?.status === 'finished' && finalMatch?.winnerId
        ? finalMatch.winnerId === finalMatch.entry1?.id
          ? finalMatch.entry1
          : finalMatch.entry2
        : null;

    const formatPlayerName = (entry?: Entry | null) => {
      if (!entry) return 'TBD';
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
      <div
        ref={ref}
        className="w-[1120px] bg-white text-black p-8 font-sans border shadow-sm select-none"
        style={{ minHeight: '750px' }}
      >
        {/* ================= OFFICIAL TOURNAMENT HEADER ================= */}
        <div className="border-b-2 border-black pb-4 mb-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                Official BWF Knockout Draw
              </span>
              <span className="text-xs font-semibold text-gray-600">
                {tournament.organization}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-950 uppercase">
              {tournament.name}
            </h1>
            <p className="text-xs text-gray-600 font-medium">
              {tournament.venue} • {tournament.city} • {tournament.startDate} to {tournament.endDate}
            </p>
          </div>

          <div className="text-right">
            <div className="text-lg font-extrabold text-emerald-800 uppercase tracking-tight">
              {event.name}
            </div>
            <div className="text-xs font-bold text-gray-700">
              {event.bracketSize}-Player Single Elimination
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">
              {event.entries.length} Registered Entries
            </div>
          </div>
        </div>

        {/* ================= BRACKET TREE COLUMNS ================= */}
        <div className="flex justify-between items-stretch gap-4 my-4">
          {sortedRounds.map((roundNum) => {
            const matches = matchesByRound[roundNum] || [];
            const roundTitle = matches[0]?.roundName || `Round ${roundNum}`;

            return (
              <div key={roundNum} className="flex-1 flex flex-col">
                {/* Round Header */}
                <div className="bg-gray-100 border border-gray-300 py-1 text-center font-bold text-[11px] uppercase tracking-wider text-gray-800 rounded mb-4">
                  {roundTitle}
                </div>

                {/* Match boxes distributed evenly */}
                <div className="flex flex-col justify-around flex-grow gap-4">
                  {matches.map((match) => {
                    const isFinished = match.status === 'finished';
                    const p1Won = isFinished && match.winnerId === match.entry1?.id;
                    const p2Won = isFinished && match.winnerId === match.entry2?.id;

                    return (
                      <div
                        key={match.id}
                        className="border border-gray-300 rounded bg-white overflow-hidden text-[11px] shadow-2xs"
                      >
                        {/* Match metadata bar */}
                        <div className="bg-gray-50 border-b border-gray-200 px-2 py-0.5 text-[9px] font-bold text-gray-500 flex justify-between">
                          <span>M#{match.matchNumber}</span>
                          {match.courtNumber && <span>Court {match.courtNumber}</span>}
                          {match.isBye && <span className="text-gray-400">BYE</span>}
                        </div>

                        {/* Player 1 */}
                        <div
                          className={`px-2 py-1.5 flex items-center justify-between border-b border-gray-100 ${
                            p1Won ? 'bg-emerald-50/80 font-bold text-emerald-950' : ''
                          }`}
                        >
                          <div className="truncate pr-1">
                            <div className="truncate flex items-center gap-1">
                              {match.entry1?.seed && (
                                <span className="font-extrabold text-[9px] text-amber-900 bg-amber-100 px-1 rounded">
                                  [{match.entry1.seed}]
                                </span>
                              )}
                              <span className="truncate">{formatPlayerName(match.entry1)}</span>
                            </div>
                            <div className="text-[9px] text-gray-500 truncate font-normal">
                              {formatPlayerClub(match.entry1)}
                            </div>
                          </div>

                          <div className="font-mono text-[10px] shrink-0 font-bold">
                            {match.score.games.map((g, i) => (
                              <span key={i} className="ml-1 text-gray-800">
                                {g.p1}
                              </span>
                            ))}
                            {p1Won && <Check className="inline h-3 w-3 text-emerald-700 ml-1" />}
                          </div>
                        </div>

                        {/* Player 2 */}
                        <div
                          className={`px-2 py-1.5 flex items-center justify-between ${
                            p2Won ? 'bg-emerald-50/80 font-bold text-emerald-950' : ''
                          }`}
                        >
                          <div className="truncate pr-1">
                            <div className="truncate flex items-center gap-1">
                              {match.entry2?.seed && (
                                <span className="font-extrabold text-[9px] text-amber-900 bg-amber-100 px-1 rounded">
                                  [{match.entry2.seed}]
                                </span>
                              )}
                              <span className="truncate">{formatPlayerName(match.entry2)}</span>
                            </div>
                            <div className="text-[9px] text-gray-500 truncate font-normal">
                              {formatPlayerClub(match.entry2)}
                            </div>
                          </div>

                          <div className="font-mono text-[10px] shrink-0 font-bold">
                            {match.score.games.map((g, i) => (
                              <span key={i} className="ml-1 text-gray-800">
                                {g.p2}
                              </span>
                            ))}
                            {p2Won && <Check className="inline h-3 w-3 text-emerald-700 ml-1" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ================= CHAMPION COLUMN ================= */}
          <div className="w-[180px] flex flex-col">
            <div className="bg-amber-100 border border-amber-300 text-amber-950 py-1 text-center font-bold text-[11px] uppercase tracking-wider rounded mb-4">
              Champion
            </div>

            <div className="flex-grow flex items-center justify-center">
              <div className="w-full border-2 border-amber-400 rounded-lg p-3 text-center bg-gradient-to-b from-amber-50 to-white shadow-xs">
                <Trophy className="h-8 w-8 text-amber-600 mx-auto mb-1.5" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">
                  Winner / Juara 1
                </span>
                <div className="font-black text-xs text-gray-950 mt-1 leading-tight">
                  {championEntry ? formatPlayerName(championEntry) : 'TBD'}
                </div>
                {championEntry && (
                  <div className="text-[10px] text-gray-600 font-medium mt-0.5">
                    {formatPlayerClub(championEntry)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= OFFICIAL FOOTER ================= */}
        <div className="border-t-2 border-black pt-3 mt-6 flex items-center justify-between text-[10px] text-gray-500">
          <div>
            <strong>BuatTournament</strong> • Official Badminton Software System
          </div>
          <div>
            BWF Scoring Rules: Best of 3 Games to 21 Points • Deuce Cap 30
          </div>
          <div>
            Generated on: {new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' })}
          </div>
        </div>
      </div>
    );
  }
);

PrintableBracketSheet.displayName = 'PrintableBracketSheet';
