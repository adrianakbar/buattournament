export type EventCategory = 'MS' | 'WS' | 'MD' | 'WD' | 'XD';

export type MatchStatus = 'upcoming' | 'warmup' | 'live' | 'finished' | 'walkover' | 'retired';

export type TournamentStatus = 'draft' | 'ongoing' | 'completed';

export interface Player {
  id: string;
  name: string;
  club: string;
  country?: string;
  gender: 'M' | 'F';
  ranking?: number;
}

export interface Entry {
  id: string;
  eventId: string;
  player1: Player;
  player2?: Player; // for doubles
  seed?: number; // 1, 2, 3, 4, etc.
  status: 'active' | 'withdrawn';
}

export interface GameScore {
  setNumber: number;
  p1: number;
  p2: number;
}

export interface MatchScore {
  games: GameScore[];
  currentSet: number;
  currentServer?: 1 | 2; // 1 = player1/pair1, 2 = player2/pair2
  isInterval?: boolean; // 11-point interval reached
}

export interface Match {
  id: string;
  eventId: string;
  roundNumber: number; // 1 = R32/R16, 2 = QF, 3 = SF, 4 = Final
  roundName: string; // e.g. "Round of 16", "Quarter Final", "Semi Final", "Final"
  matchNumber: number; // overall match index (e.g. 101, 102...)
  position: number; // index in this round (0, 1, 2...)
  entry1?: Entry | null; // null represents TBD or Bye
  entry2?: Entry | null;
  isBye?: boolean;
  courtNumber?: number | null; // 1, 2, 3...
  scheduledTime?: string;
  status: MatchStatus;
  score: MatchScore;
  winnerId?: string | null; // entry id of winner
  nextMatchId?: string | null;
  nextMatchSlot?: 1 | 2; // whether winner goes into entry1 or entry2 of next match
}

export interface TournamentEvent {
  id: string;
  tournamentId: string;
  name: string;
  category: EventCategory;
  bracketSize: 8 | 16 | 32 | 64;
  entries: Entry[];
  matches: Match[];
}

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  organization: string;
  venue: string;
  city: string;
  startDate: string;
  endDate: string;
  courtsCount: number;
  status: TournamentStatus;
  events: TournamentEvent[];
}
