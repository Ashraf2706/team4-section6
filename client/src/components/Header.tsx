import { Button } from "@/components/ui/button";
import { Menu, Search, AlertTriangle, MessageSquare } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onFindLocation: () => void;
  onReportObstacle: () => void;
  onFeedback: () => void;
}

export function Header({ onFindLocation, onReportObstacle, onFeedback }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="h-16 md:h-16 px-4 md:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-icons text-primary text-3xl">school</span>
          <div className="flex flex-col">
            <span className="font-bold text-base md:text-lg leading-tight">UMBC</span>
            <span className="text-xs text-muted-foreground leading-tight hidden sm:block">Campus Navigator</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <Button
            variant="ghost"
            size="default"
            onClick={onFindLocation}
            data-testid="button-find-location"
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Find Location</span>
          </Button>
          <Button
            variant="ghost"
            size="default"
            onClick={onReportObstacle}
            data-testid="button-report-obstacle"
            className="gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Report Obstacle</span>
          </Button>
          <Button
            variant="ghost"
            size="default"
            onClick={onFeedback}
            data-testid="button-feedback"
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-2">
            <Button
              variant="ghost"
              onClick={() => { onFindLocation(); setMobileMenuOpen(false); }}
              data-testid="button-mobile-find-location"
              className="justify-start gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find Location</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => { onReportObstacle(); setMobileMenuOpen(false); }}
              data-testid="button-mobile-report-obstacle"
              className="justify-start gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Obstacle</span>
            </Button>
            <Button
              variant="ghost"
              onClick={() => { onFeedback(); setMobileMenuOpen(false); }}
              data-testid="button-mobile-feedback"
              className="justify-start gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feedback</span>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
