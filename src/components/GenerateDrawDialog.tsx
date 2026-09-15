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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Shuffle, ShieldCheck } from 'lucide-react';

interface GenerateDrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateDrawDialog({ open, onOpenChange }: GenerateDrawDialogProps) {
  const { activeEvent, generateDraw } = useTournament();

  const [bracketSize, setBracketSize] = useState<string>(
    activeEvent ? String(activeEvent.bracketSize) : '16'
  );

  if (!activeEvent) return null;

  const handleGenerate = () => {
    generateDraw(activeEvent.id, Number(bracketSize) as 8 | 16 | 32 | 64);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5 text-emerald-600" />
            Generate BWF Tournament Draw
          </DialogTitle>
          <DialogDescription>
            Re-generate single elimination knockout bracket for {activeEvent.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <div className="text-sm font-semibold p-2.5 bg-muted rounded-md">
              {activeEvent.name} ({activeEvent.entries.length} Entries)
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Bracket Size (Knockout Tree)</Label>
            <Select value={bracketSize} onValueChange={(v: string | null) => setBracketSize(v || '16')}>
              <SelectTrigger className="text-xs h-9">
                <SelectValue placeholder="Select Bracket Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8-Player Draw (3 Rounds)</SelectItem>
                <SelectItem value="16">16-Player Draw (4 Rounds)</SelectItem>
                <SelectItem value="32">32-Player Draw (5 Rounds)</SelectItem>
                <SelectItem value="64">64-Player Draw (6 Rounds)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              BWF Seeding Rules Applied:
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-emerald-900">
              <li>Seed 1 placed at Line 1 (top of bracket).</li>
              <li>Seed 2 placed at Line {bracketSize} (bottom of bracket).</li>
              <li>Seed 3 & 4 drawn into separate halves.</li>
              <li>Byes automatically awarded to highest seeds first.</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end gap-2">
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
              type="button"
              size="sm"
              onClick={handleGenerate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5"
            >
              <Shuffle className="h-3.5 w-3.5" />
              Generate Draw Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
