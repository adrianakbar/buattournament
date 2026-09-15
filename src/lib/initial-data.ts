import { Tournament, TournamentEvent, Entry, Player, Match } from '@/types/tournament';
import { generateKnockoutDraw } from './badminton-rules';

// 1. Realistic Badminton Players
const msPlayers: Player[] = [
  { id: 'p-1', name: 'Anthony Sinisuka Ginting', club: 'PB SGS-PLN Bandung', gender: 'M', ranking: 3 },
  { id: 'p-2', name: 'Jonatan Christie', club: 'PB Tangkas Jakarta', gender: 'M', ranking: 4 },
  { id: 'p-3', name: 'Chico Aura Dwi Wardoyo', club: 'PB Exist Jakarta', gender: 'M', ranking: 18 },
  { id: 'p-4', name: 'Alwi Farhan', club: 'PB Mansion Exist', gender: 'M', ranking: 35 },
  { id: 'p-5', name: 'Yohanes Saut Marcellyno', club: 'PB Jaya Raya', gender: 'M', ranking: 52 },
  { id: 'p-6', name: 'Bismo Raya Oktora', club: 'PB Djarum Kudus', gender: 'M', ranking: 88 },
  { id: 'p-7', name: 'Moh. Zaki Ubaidillah', club: 'PB Djarum Kudus', gender: 'M', ranking: 95 },
  { id: 'p-8', name: 'Krishna Adi Nugraha', club: 'PB Jaya Raya', gender: 'M', ranking: 110 },
  { id: 'p-9', name: 'Ikhsan Leonardo I. Rumbay', club: 'PB Djarum Kudus', gender: 'M', ranking: 120 },
  { id: 'p-10', name: 'Christian Adinata', club: 'PB Tangkas', gender: 'M', ranking: 130 },
  { id: 'p-11', name: 'Bodhi Ratana Teja Gotama', club: 'PB Exist', gender: 'M', ranking: 145 },
  { id: 'p-12', name: 'Prahdiska Bagas Shujiwo', club: 'PB Djarum Kudus', gender: 'M', ranking: 160 },
  { id: 'p-13', name: 'Jason Christ Alexander', club: 'PB Djarum Kudus', gender: 'M', ranking: 175 },
  { id: 'p-14', name: 'Richie Duta Richardo', club: 'PB Djarum Kudus', gender: 'M', ranking: 190 },
  { id: 'p-15', name: 'Muhammad Reza Al Fajri', club: 'PB Exist Jakarta', gender: 'M', ranking: 205 },
  { id: 'p-16', name: 'Ryan Putra Widyanto', club: 'PB Jaya Raya', gender: 'M', ranking: 220 },
];

const mdPlayers: { p1: Player; p2: Player }[] = [
  {
    p1: { id: 'md-1a', name: 'Fajar Alfian', club: 'PB SGS-PLN', gender: 'M', ranking: 5 },
    p2: { id: 'md-1b', name: 'M. Rian Ardianto', club: 'PB Jaya Raya', gender: 'M', ranking: 5 },
  },
  {
    p1: { id: 'md-2a', name: 'Leo Rolly Carnando', club: 'PB Djarum', gender: 'M', ranking: 12 },
    p2: { id: 'md-2b', name: 'Bagas Maulana', club: 'PB Djarum', gender: 'M', ranking: 12 },
  },
  {
    p1: { id: 'md-3a', name: 'M. Shohibul Fikri', club: 'PB SGS-PLN', gender: 'M', ranking: 14 },
    p2: { id: 'md-3b', name: 'Daniel Marthin', club: 'PB Djarum', gender: 'M', ranking: 14 },
  },
  {
    p1: { id: 'md-4a', name: 'Sabar Karyaman Gutama', club: 'PB Exist', gender: 'M', ranking: 15 },
    p2: { id: 'md-4b', name: 'Moh. Reza Pahlevi Isfahani', club: 'PB Jaya Raya', gender: 'M', ranking: 15 },
  },
  {
    p1: { id: 'md-5a', name: 'Yeremia Erich Y. Rambitan', club: 'PB Exist', gender: 'M', ranking: 40 },
    p2: { id: 'md-5b', name: 'Rahmat Hidayat', club: 'PB Djarum', gender: 'M', ranking: 40 },
  },
  {
    p1: { id: 'md-6a', name: 'Anselmus Brehit Fredy Prasetya', club: 'PB Djarum', gender: 'M', ranking: 70 },
    p2: { id: 'md-6b', name: 'Pulung Ramadhan', club: 'PB Djarum', gender: 'M', ranking: 70 },
  },
  {
    p1: { id: 'md-7a', name: 'Patra Harapan Rindorindo', club: 'PB Jaya Raya', gender: 'M', ranking: 92 },
    p2: { id: 'md-7b', name: 'Raymond Indra', club: 'PB Djarum', gender: 'M', ranking: 92 },
  },
  {
    p1: { id: 'md-8a', name: 'Nikolaus Joaquin', club: 'PB Djarum', gender: 'M', ranking: 115 },
    p2: { id: 'md-8b', name: 'Muhammad Al Farizi', club: 'PB Djarum', gender: 'M', ranking: 115 },
  },
];

// 2. Entries
const msEntries: Entry[] = msPlayers.map((p, idx) => ({
  id: `entry-ms-${p.id}`,
  eventId: 'evt-ms',
  player1: p,
  seed: idx === 0 ? 1 : idx === 1 ? 2 : idx === 2 ? 3 : idx === 3 ? 4 : undefined,
  status: 'active',
}));

const mdEntries: Entry[] = mdPlayers.map((pair, idx) => ({
  id: `entry-md-${idx + 1}`,
  eventId: 'evt-md',
  player1: pair.p1,
  player2: pair.p2,
  seed: idx === 0 ? 1 : idx === 1 ? 2 : idx === 2 ? 3 : idx === 3 ? 4 : undefined,
  status: 'active',
}));

// 3. Generate initial brackets
const initialMsMatches = generateKnockoutDraw('evt-ms', msEntries, 16);
const initialMdMatches = generateKnockoutDraw('evt-md', mdEntries, 8);

// Enrich some MS matches with realistic live/finished scores for immediate demo:
// R16 Match 1 (Ginting vs Ryan) -> Finished
if (initialMsMatches[0]) {
  initialMsMatches[0].status = 'finished';
  initialMsMatches[0].courtNumber = 1;
  initialMsMatches[0].winnerId = msEntries[0].id; // Ginting
  initialMsMatches[0].score = {
    games: [
      { setNumber: 1, p1: 21, p2: 12 },
      { setNumber: 2, p1: 21, p2: 15 },
    ],
    currentSet: 2,
  };
}

// R16 Match 2 -> Finished
if (initialMsMatches[1]) {
  initialMsMatches[1].status = 'finished';
  initialMsMatches[1].courtNumber = 2;
  initialMsMatches[1].winnerId = initialMsMatches[1].entry1?.id || '';
  initialMsMatches[1].score = {
    games: [
      { setNumber: 1, p1: 21, p2: 18 },
      { setNumber: 2, p1: 19, p2: 21 },
      { setNumber: 3, p1: 21, p2: 16 },
    ],
    currentSet: 3,
  };
}

// Advance QF Match 1
if (initialMsMatches[8]) {
  initialMsMatches[8].entry1 = initialMsMatches[0]?.entry1;
  initialMsMatches[8].entry2 = initialMsMatches[1]?.entry1;
  initialMsMatches[8].status = 'live';
  initialMsMatches[8].courtNumber = 1;
  initialMsMatches[8].score = {
    games: [
      { setNumber: 1, p1: 21, p2: 17 },
      { setNumber: 2, p1: 18, p2: 19 },
    ],
    currentSet: 2,
    currentServer: 2,
  };
}

// Live match on Court 2: R16 Match 3
if (initialMsMatches[2]) {
  initialMsMatches[2].status = 'live';
  initialMsMatches[2].courtNumber = 2;
  initialMsMatches[2].score = {
    games: [
      { setNumber: 1, p1: 20, p2: 20 }, // Deuce excitement!
    ],
    currentSet: 1,
    currentServer: 1,
  };
}

// Upcoming on Court 3
if (initialMsMatches[3]) {
  initialMsMatches[3].status = 'upcoming';
  initialMsMatches[3].courtNumber = 3;
}

// 4. Default Tournament
export const defaultTournament: Tournament = {
  id: 'tourney-indonesia-masters-2026',
  name: 'Indonesia Badminton Masters 2026',
  slug: 'indonesia-masters-2026',
  organization: 'PBSI Official Tournament Series',
  venue: 'Istora Gelora Bung Karno',
  city: 'Jakarta, Indonesia',
  startDate: '2026-09-22',
  endDate: '2026-09-27',
  courtsCount: 4,
  status: 'ongoing',
  events: [
    {
      id: 'evt-ms',
      tournamentId: 'tourney-indonesia-masters-2026',
      name: "Men's Singles (Tunggal Putra)",
      category: 'MS',
      bracketSize: 16,
      entries: msEntries,
      matches: initialMsMatches,
    },
    {
      id: 'evt-md',
      tournamentId: 'tourney-indonesia-masters-2026',
      name: "Men's Doubles (Ganda Putra)",
      category: 'MD',
      bracketSize: 8,
      entries: mdEntries,
      matches: initialMdMatches,
    },
  ],
};
