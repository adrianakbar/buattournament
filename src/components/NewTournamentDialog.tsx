'use client';

import React, { useState } from 'react';
import { useTournament } from '@/lib/tournament-store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';

interface NewTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewTournamentDialog({ open, onOpenChange }: NewTournamentDialogProps) {
  const { createNewTournament } = useTournament();

  const [name, setName] = useState('Sirnas Badminton Championship 2026');
  const [venue, setVenue] = useState('GOR Sudirman');
  const [city, setCity] = useState('Surabaya, Indonesia');
  const [courts, setCourts] = useState('4');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createNewTournament(name, venue, city, Number(courts) || 4);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-emerald-600" />
            Create New Tournament
          </DialogTitle>
          <DialogDescription>
            Configure tournament venue, courts, and initial categories.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="t-name" className="text-xs">Tournament Name</Label>
            <Input
              id="t-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs h-9"
              placeholder="e.g. Kejurkab Badminton 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="t-venue" className="text-xs">Venue / Hall</Label>
              <Input
                id="t-venue"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="text-xs h-9"
                placeholder="e.g. Istora Senayan"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-city" className="text-xs">City</Label>
              <Input
                id="t-city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="text-xs h-9"
                placeholder="e.g. Jakarta"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="t-courts" className="text-xs">Number of Badminton Courts</Label>
            <Input
              id="t-courts"
              type="number"
              min="1"
              max="16"
              required
              value={courts}
              onChange={(e) => setCourts(e.target.value)}
              className="text-xs h-9"
            />
            <p className="text-[11px] text-muted-foreground">
              Courts will be available for Order of Play and Umpire assigning.
            </p>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            >
              Create Tournament
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
