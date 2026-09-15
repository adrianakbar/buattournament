'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/tournament-store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Users } from 'lucide-react';

export function PlayersList() {
  const { tournament } = useTournament();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allEntries = tournament.events.flatMap((e) =>
    e.entries.map((entry) => ({
      ...entry,
      eventCategory: e.category,
      eventName: e.name,
    }))
  );

  const filteredEntries = allEntries.filter((entry) => {
    if (categoryFilter !== 'all' && entry.eventCategory !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const p1Name = entry.player1.name.toLowerCase();
      const p2Name = entry.player2?.name.toLowerCase() || '';
      const p1Club = entry.player1.club.toLowerCase();
      const p2Club = entry.player2?.club.toLowerCase() || '';
      if (!p1Name.includes(q) && !p2Name.includes(q) && !p1Club.includes(q) && !p2Club.includes(q)) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-card p-3 md:p-4 rounded-xl border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search athlete or club..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-8 md:h-9"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={(v: string | null) => setCategoryFilter(v || 'all')}>
            <SelectTrigger className="h-8 md:h-9 w-full sm:w-[150px] text-[11px] md:text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {tournament.events.map((evt) => (
                <SelectItem key={evt.id} value={evt.category}>
                  {evt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* MOBILE VIEW: Cards (Block on mobile) */}
      <div className="block md:hidden space-y-2">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="border shadow-2xs text-xs">
              <CardContent className="p-3 flex items-center justify-between gap-2">
                <div className="space-y-0.5 truncate">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {entry.seed && (
                      <span className="font-bold text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        Seed #{entry.seed}
                      </span>
                    )}
                    <span className="font-semibold text-foreground text-[12px] truncate">
                      {entry.player2 ? (
                        <>
                          {entry.player1.name} / {entry.player2.name}
                        </>
                      ) : (
                        entry.player1.name
                      )}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {entry.player2
                      ? `${entry.player1.club} / ${entry.player2.club}`
                      : entry.player1.club}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant="secondary" className="text-[9px] font-bold">
                    {entry.eventCategory}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[9px] py-0 h-4"
                  >
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground bg-card rounded-xl border text-xs">
            No players found.
          </div>
        )}
      </div>

      {/* DESKTOP VIEW: Data Table (Hidden on mobile) */}
      <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40 text-xs">
            <TableRow>
              <TableHead className="w-16">Seed</TableHead>
              <TableHead>Player / Pair Name</TableHead>
              <TableHead>Badminton Club (PB)</TableHead>
              <TableHead className="w-24">Gender</TableHead>
              <TableHead className="w-32">Event</TableHead>
              <TableHead className="w-24 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/30">
                  <TableCell>
                    {entry.seed ? (
                      <span className="font-bold text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        #{entry.seed}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[11px]">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {entry.player2 ? (
                      <span>
                        {entry.player1.name} <br />
                        <span className="text-muted-foreground font-normal">& {entry.player2.name}</span>
                      </span>
                    ) : (
                      entry.player1.name
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.player2 ? (
                      <span>
                        {entry.player1.club} <br />
                        <span className="text-muted-foreground/80">{entry.player2.club}</span>
                      </span>
                    ) : (
                      entry.player1.club
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {entry.player1.gender === 'M' ? 'Men' : 'Women'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      {entry.eventCategory}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[10px]">
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No players found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
