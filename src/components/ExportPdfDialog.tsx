'use client';

import React, { useRef, useState } from 'react';
import { useTournament } from '@/lib/tournament-store';
import { PrintableBracketSheet } from './PrintableBracketSheet';
import { exportElementToPdf } from '@/lib/pdf-export';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ExportPdfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportPdfDialog({ open, onOpenChange }: ExportPdfDialogProps) {
  const { tournament, activeEvent } = useTournament();
  const printSheetRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!activeEvent) return null;

  const handleDownloadPdf = async () => {
    if (!printSheetRef.current) return;
    try {
      setIsExporting(true);
      const filename = `${tournament.slug}_${activeEvent.category}_Draw.pdf`;
      await exportElementToPdf(printSheetRef.current, filename, 'landscape');
      toast.success(`Draw sheet PDF saved as ${filename}!`);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-5xl max-h-[92vh] flex flex-col p-4 sm:p-6 overflow-hidden">
        <DialogHeader className="pb-2 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6">
            <div>
              <DialogTitle className="flex items-center gap-2 text-base md:text-lg font-bold">
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 shrink-0" />
                Export Official BWF Draw Sheet
              </DialogTitle>
              <DialogDescription className="text-xs">
                {tournament.name} • {activeEvent.name} ({activeEvent.bracketSize} Draw)
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs h-8 gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" />
                Print
              </Button>
              <Button
                size="sm"
                disabled={isExporting}
                onClick={handleDownloadPdf}
                className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 font-semibold"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Saving PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Preview Area */}
        <div className="flex-grow overflow-auto p-2 sm:p-4 bg-muted/40 rounded-lg border my-2 flex flex-col items-center">
          <p className="text-[10px] text-muted-foreground mb-2 sm:hidden text-center">
            Pinch or scroll horizontally to inspect the full A4 landscape bracket sheet.
          </p>
          <div className="overflow-x-auto w-full flex justify-center no-scrollbar">
            <div className="shadow-lg rounded-md overflow-hidden bg-white scale-[0.65] xs:scale-[0.75] md:scale-[0.85] origin-top my-1">
              <PrintableBracketSheet
                ref={printSheetRef}
                tournament={tournament}
                event={activeEvent}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
