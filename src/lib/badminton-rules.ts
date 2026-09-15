import { Entry, GameScore, Match, MatchScore, MatchStatus } from '@/types/tournament';

/**
 * Returns name of round based on remaining participants in this round
 */
export function getRoundName(roundNumber: number, totalRounds: number): string {
  const diff = totalRounds - roundNumber;
  switch (diff) {
    case 0:
      return 'Final';
    case 1:
      return 'Semi Final';
    case 2:
      return 'Quarter Final';
    case 3:
      return 'Round of 16';
    case 4:
      return 'Round of 32';
    case 5:
      return 'Round of 64';
    default:
      return `Round ${roundNumber}`;
  }
}

/**
 * Checks game status according to BWF 21-point rally rules:
 * - First to 21 with lead of 2 wins.
 * - At 20-20, must lead by 2.
 * - Max cap is 30 points (30-29 wins).
 * - Interval at 11 points.
 */
export function checkGameStatus(score: { p1: number; p2: number }): {
  isOver: boolean;
  winner?: 1 | 2;
  isDeuce: boolean;
  isInterval: boolean;
} {
  const { p1, p2 } = score;
  const isInterval = p1 === 11 || p2 === 11;
  const isDeuce = p1 >= 20 && p2 >= 20;

  // Max score rule: 30 points cap
  if (p1 === 30) return { isOver: true, winner: 1, isDeuce, isInterval };
  if (p2 === 30) return { isOver: true, winner: 2, isDeuce, isInterval };

  // Deuce rule: difference >= 2
  if (isDeuce) {
    if (p1 - p2 >= 2) return { isOver: true, winner: 1, isDeuce, isInterval };
    if (p2 - p1 >= 2) return { isOver: true, winner: 2, isDeuce, isInterval };
    return { isOver: false, isDeuce: true, isInterval };
  }

  // Normal rule: first to 21
  if (p1 >= 21) return { isOver: true, winner: 1, isDeuce: false, isInterval };
  if (p2 >= 21) return { isOver: true, winner: 2, isDeuce: false, isInterval };

  return { isOver: false, isDeuce: false, isInterval };
}

/**
 * Checks whether the entire best-of-3 badminton match is completed
 */
export function checkMatchStatus(games: GameScore[]): {
  isFinished: boolean;
  winner?: 1 | 2;
  setsWon: { p1: number; p2: number };
} {
  let p1Wins = 0;
  let p2Wins = 0;

  for (const game of games) {
    const status = checkGameStatus(game);
    if (status.isOver) {
      if (status.winner === 1) p1Wins++;
      if (status.winner === 2) p2Wins++;
    }
  }

  if (p1Wins === 2) return { isFinished: true, winner: 1, setsWon: { p1: p1Wins, p2: p2Wins } };
  if (p2Wins === 2) return { isFinished: true, winner: 2, setsWon: { p1: p1Wins, p2: p2Wins } };

  return { isFinished: false, setsWon: { p1: p1Wins, p2: p2Wins } };
}

/**
 * Calculates BWF standard seed slots for single elimination draw
 * Slot index is 0-indexed bracket position (0 to bracketSize - 1)
 */
export function getBwfSeedPositions(bracketSize: number): Record<number, number> {
  // Map seed number -> slot index (0-based)
  const map: Record<number, number> = {};
  if (bracketSize >= 2) {
    map[1] = 0; // Top of top half
    map[2] = bracketSize - 1; // Bottom of bottom half
  }
  if (bracketSize >= 4) {
    map[3] = Math.floor(bracketSize / 2) - 1; // Bottom of top half
    map[4] = Math.floor(bracketSize / 2); // Top of bottom half
  }
  if (bracketSize >= 8) {
    map[5] = Math.floor(bracketSize / 4);
    map[6] = Math.floor(bracketSize * 3 / 4) - 1;
    map[7] = Math.floor(bracketSize / 4) - 1;
    map[8] = Math.floor(bracketSize * 3 / 4);
  }
  return map;
}

/**
 * Generates an entire knockout bracket with BWF seeding, automatic Byes,
 * and pre-linked winner advancement.
 */
export function generateKnockoutDraw(
  eventId: string,
  entries: Entry[],
  bracketSize: 8 | 16 | 32 | 64
): Match[] {
  const totalRounds = Math.log2(bracketSize);
  const totalMatches = bracketSize - 1;
  const matches: Match[] = [];

  // 1. Separate seeded and unseeded entries
  const seededEntries = entries.filter((e) => e.seed && e.seed > 0).sort((a, b) => (a.seed || 0) - (b.seed || 0));
  const unseededEntries = [...entries.filter((e) => !e.seed || e.seed <= 0)];

  // Shuffle unseeded entries randomly for fair draw
  for (let i = unseededEntries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unseededEntries[i], unseededEntries[j]] = [unseededEntries[j], unseededEntries[i]];
  }

  // 2. Prepare bracket slots (length = bracketSize)
  const slots: (Entry | null)[] = new Array(bracketSize).fill(null);
  const seedPos = getBwfSeedPositions(bracketSize);

  // Place seeds in their standard positions
  for (const entry of seededEntries) {
    const pos = seedPos[entry.seed!];
    if (pos !== undefined && pos < bracketSize && slots[pos] === null) {
      slots[pos] = entry;
    }
  }

  // Calculate Byes needed
  const totalByes = Math.max(0, bracketSize - entries.length);

  // Remaining empty slot indices
  const emptySlots: number[] = [];
  for (let i = 0; i < bracketSize; i++) {
    if (slots[i] === null) emptySlots.push(i);
  }

  // Fill empty slots with unseeded players
  let unseededIdx = 0;
  for (const slotIdx of emptySlots) {
    if (unseededIdx < unseededEntries.length) {
      slots[slotIdx] = unseededEntries[unseededIdx++];
    }
  }

  // 3. Create matches structure across all rounds
  let matchCounter = 1;
  const roundMatchesMap: Record<number, Match[]> = {};

  for (let round = 1; round <= totalRounds; round++) {
    const matchesInRound = bracketSize / Math.pow(2, round);
    roundMatchesMap[round] = [];

    for (let pos = 0; pos < matchesInRound; pos++) {
      const matchId = `m-${eventId}-r${round}-p${pos}`;
      const match: Match = {
        id: matchId,
        eventId,
        roundNumber: round,
        roundName: getRoundName(round, totalRounds),
        matchNumber: matchCounter++,
        position: pos,
        status: 'upcoming',
        score: {
          games: [{ setNumber: 1, p1: 0, p2: 0 }],
          currentSet: 1,
        },
      };

      if (round === 1) {
        // First round takes players from initial slots
        const entry1 = slots[pos * 2];
        const entry2 = slots[pos * 2 + 1];
        match.entry1 = entry1;
        match.entry2 = entry2;

        // Check if this match is a Bye
        if (entry1 && !entry2) {
          match.status = 'finished';
          match.winnerId = entry1.id;
          match.isBye = true;
          match.score.games = [{ setNumber: 1, p1: 21, p2: 0 }, { setNumber: 2, p1: 21, p2: 0 }];
        } else if (!entry1 && entry2) {
          match.status = 'finished';
          match.winnerId = entry2.id;
          match.isBye = true;
          match.score.games = [{ setNumber: 1, p1: 0, p2: 21 }, { setNumber: 2, p1: 0, p2: 21 }];
        }
      }

      roundMatchesMap[round].push(match);
      matches.push(match);
    }
  }

  // 4. Link nextMatchId and nextMatchSlot
  for (let round = 1; round < totalRounds; round++) {
    const currentRound = roundMatchesMap[round];
    const nextRound = roundMatchesMap[round + 1];

    for (let i = 0; i < currentRound.length; i++) {
      const nextMatchIdx = Math.floor(i / 2);
      const nextMatchSlot: 1 | 2 = i % 2 === 0 ? 1 : 2;
      const match = currentRound[i];
      const nextMatch = nextRound[nextMatchIdx];

      match.nextMatchId = nextMatch.id;
      match.nextMatchSlot = nextMatchSlot;

      // If this match is already finished (e.g. Bye), advance winner immediately
      if (match.status === 'finished' && match.winnerId) {
        const winnerEntry = match.entry1?.id === match.winnerId ? match.entry1 : match.entry2;
        if (nextMatchSlot === 1) nextMatch.entry1 = winnerEntry;
        else nextMatch.entry2 = winnerEntry;
      }
    }
  }

  return matches;
}

/**
 * Advance a match winner to the next round slot
 */
export function advanceWinner(
  matches: Match[],
  matchId: string,
  winnerEntryId: string,
  score: MatchScore
): Match[] {
  return matches.map((m): Match => {
    if (m.id === matchId) {
      return {
        ...m,
        status: 'finished' as MatchStatus,
        winnerId: winnerEntryId,
        score,
      };
    }
    return m;
  }).map((m, _, allMatches): Match => {
    // Check if any match feeds into this one
    const prevMatches = allMatches.filter((p) => p.nextMatchId === m.id);
    if (prevMatches.length === 0) return m;

    let updatedEntry1 = m.entry1;
    let updatedEntry2 = m.entry2;

    for (const prev of prevMatches) {
      if (prev.winnerId && prev.status === 'finished') {
        const winner = prev.entry1?.id === prev.winnerId ? prev.entry1 : prev.entry2;
        if (prev.nextMatchSlot === 1) updatedEntry1 = winner;
        if (prev.nextMatchSlot === 2) updatedEntry2 = winner;
      }
    }

    return {
      ...m,
      entry1: updatedEntry1,
      entry2: updatedEntry2,
    };
  });
}
