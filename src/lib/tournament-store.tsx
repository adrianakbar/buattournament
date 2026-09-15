'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Tournament, Match, MatchStatus, MatchScore, TournamentEvent, Entry, Player } from '@/types/tournament';
import { defaultTournament } from './initial-data';
import { advanceWinner, checkMatchStatus, generateKnockoutDraw } from './badminton-rules';

interface TournamentContextType {
  tournament: Tournament;
  selectedEventId: string;
  setSelectedEventId: (id: string) => void;
  activeEvent: TournamentEvent | undefined;
  umpireMatchId: string | null;
  setUmpireMatchId: (id: string | null) => void;
  umpireMatch: Match | undefined;
  // Actions
  addPoint: (matchId: string, player: 1 | 2) => void;
  undoPoint: (matchId: string) => void;
  setMatchServer: (matchId: string, server: 1 | 2) => void;
  assignCourt: (matchId: string, courtNumber: number | null) => void;
  setMatchStatus: (matchId: string, status: MatchStatus) => void;
  finishMatchManually: (matchId: string, winnerEntryId: string) => void;
  generateDraw: (eventId: string, bracketSize: 8 | 16 | 32 | 64) => void;
  createNewTournament: (name: string, venue: string, city: string, courtsCount: number) => void;
  resetDefaultData: () => void;
}

const TournamentContext = createContext<TournamentContextType | null>(null);

const STORAGE_KEY = 'buattournament_state_v1';

export function TournamentProvider({ children }: { children: React.ReactNode }) {
  const [tournament, setTournament] = useState<Tournament>(defaultTournament);
  const [selectedEventId, setSelectedEventId] = useState<string>('evt-ms');
  const [umpireMatchId, setUmpireMatchId] = useState<string | null>(null);
  const [historyStack, setHistoryStack] = useState<Record<string, MatchScore[]>>({});

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.events) {
          setTournament(parsed);
          if (parsed.events.length > 0) {
            setSelectedEventId(parsed.events[0].id);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage on changes
  const saveTournament = (updated: Tournament) => {
    setTournament(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const activeEvent = tournament.events.find((e) => e.id === selectedEventId) || tournament.events[0];

  const allMatches = tournament.events.flatMap((e) => e.matches);
  const umpireMatch = allMatches.find((m) => m.id === umpireMatchId);

  // Helper to update a match within tournament
  const updateMatch = (matchId: string, updater: (match: Match) => Match) => {
    const updatedEvents = tournament.events.map((evt) => {
      const matchExists = evt.matches.some((m) => m.id === matchId);
      if (!matchExists) return evt;

      let newMatches = evt.matches.map((m) => (m.id === matchId ? updater(m) : m));

      // If match was marked finished, automatically advance winner
      const targetMatch = newMatches.find((m) => m.id === matchId);
      if (targetMatch && targetMatch.status === 'finished' && targetMatch.winnerId) {
        newMatches = advanceWinner(newMatches, matchId, targetMatch.winnerId, targetMatch.score);
      }

      return {
        ...evt,
        matches: newMatches,
      };
    });

    saveTournament({ ...tournament, events: updatedEvents });
  };

  // Add Point in Umpire Console
  const addPoint = (matchId: string, player: 1 | 2) => {
    updateMatch(matchId, (match) => {
      const score = { ...match.score };
      const games = [...score.games];
      const currentSetIdx = (score.currentSet || 1) - 1;

      if (!games[currentSetIdx]) {
        games[currentSetIdx] = { setNumber: currentSetIdx + 1, p1: 0, p2: 0 };
      }

      // Save to undo history stack
      setHistoryStack((prev) => ({
        ...prev,
        [matchId]: [...(prev[matchId] || []), JSON.parse(JSON.stringify(score))],
      }));

      const currentGame = { ...games[currentSetIdx] };
      if (player === 1) currentGame.p1 += 1;
      else currentGame.p2 += 1;

      // Update server to current point winner (BWF rally point rule)
      score.currentServer = player;
      games[currentSetIdx] = currentGame;
      score.games = games;

      // Check if current game is won
      const p1 = currentGame.p1;
      const p2 = currentGame.p2;
      const isDeuce = p1 >= 20 && p2 >= 20;
      let gameWonBy: 1 | 2 | null = null;

      if (p1 === 30) gameWonBy = 1;
      else if (p2 === 30) gameWonBy = 2;
      else if (isDeuce) {
        if (p1 - p2 >= 2) gameWonBy = 1;
        if (p2 - p1 >= 2) gameWonBy = 2;
      } else {
        if (p1 >= 21) gameWonBy = 1;
        if (p2 >= 21) gameWonBy = 2;
      }

      // Check entire match status
      const matchResult = checkMatchStatus(games);

      if (matchResult.isFinished && matchResult.winner) {
        const winnerEntryId = matchResult.winner === 1 ? match.entry1?.id : match.entry2?.id;
        return {
          ...match,
          status: 'finished',
          winnerId: winnerEntryId || null,
          score,
        };
      }

      // If game is won but match isn't finished yet, prepare next game
      if (gameWonBy && score.currentSet < 3) {
        score.currentSet += 1;
        if (!games[score.currentSet - 1]) {
          games.push({ setNumber: score.currentSet, p1: 0, p2: 0 });
        }
        score.games = games;
      }

      return {
        ...match,
        status: match.status === 'upcoming' || match.status === 'warmup' ? 'live' : match.status,
        score,
      };
    });
  };

  // Undo point
  const undoPoint = (matchId: string) => {
    const history = historyStack[matchId];
    if (!history || history.length === 0) return;

    const previousScore = history[history.length - 1];
    setHistoryStack((prev) => ({
      ...prev,
      [matchId]: prev[matchId].slice(0, -1),
    }));

    updateMatch(matchId, (match) => ({
      ...match,
      score: previousScore,
      status: match.status === 'finished' ? 'live' : match.status,
      winnerId: null,
    }));
  };

  const setMatchServer = (matchId: string, server: 1 | 2) => {
    updateMatch(matchId, (m) => ({
      ...m,
      score: { ...m.score, currentServer: server },
    }));
  };

  const assignCourt = (matchId: string, courtNumber: number | null) => {
    updateMatch(matchId, (m) => ({
      ...m,
      courtNumber,
    }));
  };

  const setMatchStatus = (matchId: string, status: MatchStatus) => {
    updateMatch(matchId, (m) => ({
      ...m,
      status,
    }));
  };

  const finishMatchManually = (matchId: string, winnerEntryId: string) => {
    updateMatch(matchId, (m) => ({
      ...m,
      status: 'finished',
      winnerId: winnerEntryId,
    }));
  };

  const generateDraw = (eventId: string, bracketSize: 8 | 16 | 32 | 64) => {
    const targetEvent = tournament.events.find((e) => e.id === eventId);
    if (!targetEvent) return;

    const newMatches = generateKnockoutDraw(eventId, targetEvent.entries, bracketSize);
    const updatedEvents = tournament.events.map((e) =>
      e.id === eventId ? { ...e, bracketSize, matches: newMatches } : e
    );

    saveTournament({ ...tournament, events: updatedEvents });
  };

  const createNewTournament = (name: string, venue: string, city: string, courtsCount: number) => {
    const newT: Tournament = {
      id: `tourney-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      organization: 'Badminton Association',
      venue,
      city,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      courtsCount: courtsCount || 4,
      status: 'ongoing',
      events: [
        {
          id: `evt-ms-${Date.now()}`,
          tournamentId: `tourney-${Date.now()}`,
          name: "Men's Singles (Tunggal Putra)",
          category: 'MS',
          bracketSize: 16,
          entries: defaultTournament.events[0].entries,
          matches: generateKnockoutDraw(`evt-ms-${Date.now()}`, defaultTournament.events[0].entries, 16),
        },
      ],
    };

    saveTournament(newT);
    setSelectedEventId(newT.events[0].id);
  };

  const resetDefaultData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTournament(defaultTournament);
    setSelectedEventId(defaultTournament.events[0].id);
    setUmpireMatchId(null);
  };

  return (
    <TournamentContext.Provider
      value={{
        tournament,
        selectedEventId,
        setSelectedEventId,
        activeEvent,
        umpireMatchId,
        setUmpireMatchId,
        umpireMatch,
        addPoint,
        undoPoint,
        setMatchServer,
        assignCourt,
        setMatchStatus,
        finishMatchManually,
        generateDraw,
        createNewTournament,
        resetDefaultData,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const ctx = useContext(TournamentContext);
  if (!ctx) throw new Error('useTournament must be used within TournamentProvider');
  return ctx;
}
