'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/tournament-store';
import { MatchStatus } from '@/types/tournament';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Flame, Search, Tv } from 'lucide-react';

interface MatchListProps {
  onOpenUmpire: (matchId: string) => void;
}

export function MatchList({ onOpenUmpire }: MatchListProps) {
  const { tournament } = useTournament();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [courtFilter, setCourtFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allMatches = tournament.events.flatMap((e) =>
    e.matches.map((m) => ({ ...m, category: e.category, eventName: e.name }))
  );

  const filteredMatches = allMatches.filter((m) => {
    if (categoryFilter !== 'all' && m.category !== categoryFilter) return false;
    if (courtFilter !== 'all' && String(m.courtNumber || 'none') !== courtFilter) return false;
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const p1Name = m.entry1?.player1.name.toLowerCase() || '';
      const p2Name = m.entry2?.player1.name.toLowerCase() || '';
      const p1Club = m.entry1?.player1.club.toLowerCase() || '';
      const p2Club = m.entry2?.player1.club.toLowerCase() || '';
      if (
        !p1Name.includes(q) &&
        !p2Name.includes(q) &&
        !p1Club.includes(q) &&
        !p2Club.includes(q) &&
        !String(m.matchNumber).includes(q)
      ) {
        return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status: MatchStatus) => {
    switch (status) {
      case 'live':
        return (
          <Badge variant="destructive" className="animate-pulse text-[10px] font-bold">
            LIVE
          </Badge>
        );
      case 'finished':
        return (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-[10px]">
            FINISHED
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge variant="outline" className="text-[10px]">
            UPCOMING
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search player, club, or match #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={(v: string | null) => setCategoryFilter(v || 'all')}>
            <SelectTrigger className="h-9 w-[120px] text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="MS">Men's Singles</SelectItem>
              <SelectItem value="MD">Men's Doubles</SelectItem>
              <SelectItem value="WS">Women's Singles</SelectItem>
              <SelectItem value="WD">Women's Doubles</SelectItem>
              <SelectItem value="XD">Mixed Doubles</SelectItem>
            </SelectContent>
          </Select>

          {/* Court Filter */}
          <Select value={courtFilter} onValueChange={(v: string | null) => setCourtFilter(v || 'all')}>
            <SelectTrigger className="h-9 w-[120px] text-xs">
              <SelectValue placeholder="Court" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courts</SelectItem>
              {Array.from({ length: tournament.courtsCount }, (_, i) => i + 1).map((c) => (
                <SelectItem key={c} value={String(c)}>
                  Court {c}
                </SelectItem>
              ))}
              <SelectItem value="none">Unassigned</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={(v: string | null) => setStatusFilter(v || 'all')}>
            <SelectTrigger className="h-9 w-[120px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live Only</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40 text-xs">
            <TableRow>
              <TableHead className="w-16">Match</TableHead>
              <TableHead className="w-20">Event</TableHead>
              <TableHead className="w-28">Round</TableHead>
              <TableHead className="w-24">Court</TableHead>
              <TableHead>Player 1</TableHead>
              <TableHead className="w-8 text-center text-muted-foreground">vs</TableHead>
              <TableHead>Player 2</TableHead>
              <TableHead className="w-32 text-center">Score (Games)</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
              <TableHead className="w-24 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((m) => {
                const p1 = m.entry1?.player2
                  ? `${m.entry1.player1.name} / ${m.entry1.player2.name}`
                  : m.entry1?.player1.name || 'TBD';

                const p2 = m.entry2?.player2
                  ? `${m.entry2.player1.name} / ${m.entry2.player2.name}`
                  : m.entry2?.player1.name || 'TBD';

                const p1Won = m.status === 'finished' && m.winnerId === m.entry1?.id;
                const p2Won = m.status === 'finished' && m.winnerId === m.entry2?.id;

                return (
                  <TableRow key={m.id} className="hover:bg-muted/30">
                    <TableCell className="font-semibold text-foreground">
                      #{m.matchNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {m.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.roundName}</TableCell>
                    <TableCell>
                      {m.courtNumber ? (
                        <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Court {m.courtNumber}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`${p1Won ? 'font-bold text-emerald-700' : ''}`}>
                        {p1}
                      </span>
                      {m.entry1?.player1.club && (
                        <span className="block text-[10px] text-muted-foreground">
                          {m.entry1.player1.club}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground font-semibold">
                      vs
                    </TableCell>
                    <TableCell>
                      <span className={`${p2Won ? 'font-bold text-emerald-700' : ''}`}>
                        {p2}
                      </span>
                      {m.entry2?.player1.club && (
                        <span className="block text-[10px] text-muted-foreground">
                          {m.entry2.player1.club}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {m.score.games.length > 0 && m.score.games.some((g) => g.p1 > 0 || g.p2 > 0) ? (
                        <span className="font-semibold text-foreground">
                          {m.score.games.map((g) => `${g.p1}-${g.p2}`).join(', ')}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{getStatusBadge(m.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenUmpire(m.id)}
                        className="h-7 px-2 text-xs gap-1 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                      >
                        <Flame className="h-3 w-3 text-amber-500" />
                        Score
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No matches match your filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
