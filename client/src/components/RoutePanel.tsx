import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import type { RouteResponse } from "@shared/schema";

interface RoutePanelProps {
  route: RouteResponse | null;
  mode: 'walking' | 'bicycling';
  onClose: () => void;
  onStartNavigation?: () => void;
  isNavigating?: boolean;
  currentStepIndex?: number;
}

export function RoutePanel({ 
  route, 
  mode, 
  onClose, 
  onStartNavigation, 
  isNavigating = false,
  currentStepIndex = 0 
}: RoutePanelProps) {
  if (!route) return null;

  const getModeIcon = () => mode === 'walking' ? 'directions_walk' : 'directions_bike';
  const getModeLabel = () => mode === 'walking' ? 'Walking' : 'Biking';
  
  const currentStep = route.steps[currentStepIndex];

  const getManeuverIcon = (maneuver?: string) => {
    if (!maneuver) return 'navigation';
    if (maneuver.includes('left')) return 'turn_left';
    if (maneuver.includes('right')) return 'turn_right';
    if (maneuver.includes('straight')) return 'straight';
    return 'navigation';
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 md:static md:w-96 md:max-h-[calc(100vh-10rem)] z-40 rounded-t-2xl md:rounded-xl shadow-2xl">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="material-icons text-primary">{getModeIcon()}</span>
          <div>
            <h3 className="font-semibold text-base">Route Details</h3>
            <p className="text-xs text-muted-foreground">{getModeLabel()} directions</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-route"
          aria-label="Close route"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {isNavigating && currentStep && (
        <div className="p-4 bg-primary text-primary-foreground">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <span className="material-icons text-2xl">
                {getManeuverIcon(currentStep.maneuver)}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-xs opacity-80 mb-1">Next Step ({currentStepIndex + 1}/{route.steps.length})</p>
              <p 
                className="text-base font-semibold leading-relaxed"
                dangerouslySetInnerHTML={{ __html: currentStep.instruction }}
              />
              <div className="flex items-center gap-3 text-xs opacity-90 mt-2">
                <span>{currentStep.distance}</span>
                <span>•</span>
                <span>{currentStep.duration}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-muted/30 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-icons text-sm text-muted-foreground">schedule</span>
            <span className="font-mono text-sm font-semibold">{route.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons text-sm text-muted-foreground">straighten</span>
            <span className="font-mono text-sm font-semibold">{route.distance}</span>
          </div>
          <Badge variant="outline" className="gap-1">
            <span className="material-icons text-xs">{getModeIcon()}</span>
            {getModeLabel()}
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[50vh] md:h-[calc(100vh-24rem)]">
        <div className="p-4 space-y-4">
          {route.steps.map((step, index) => {
            const isCurrentStep = isNavigating && index === currentStepIndex;
            const isPastStep = isNavigating && index < currentStepIndex;
            
            return (
              <div
                key={index}
                className={`flex gap-3 pb-4 border-b border-border last:border-0 transition-opacity ${
                  isPastStep ? 'opacity-40' : ''
                } ${isCurrentStep ? 'bg-primary/5 -mx-4 px-4 py-3 rounded-lg' : ''}`}
                data-testid={`route-step-${index}`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrentStep ? 'bg-primary text-primary-foreground' : 'bg-primary/10'
                  }`}>
                    <span className={`material-icons text-sm ${isCurrentStep ? '' : 'text-primary'}`}>
                      {isPastStep ? 'check' : getManeuverIcon(step.maneuver)}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-relaxed mb-1 ${isCurrentStep ? 'font-semibold' : ''}`}
                    dangerouslySetInnerHTML={{ __html: step.instruction }}
                  />
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                    <span>{step.distance}</span>
                    <span>•</span>
                    <span>{step.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <Button 
          className="w-full" 
          data-testid="button-start-navigation"
          onClick={onStartNavigation}
          variant={isNavigating ? "secondary" : "default"}
        >
          <span className="material-icons text-base mr-2">
            {isNavigating ? 'pause' : 'navigation'}
          </span>
          {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
        </Button>
      </div>
    </Card>
  );
}
