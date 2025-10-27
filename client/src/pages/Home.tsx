import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { MapContainer } from "@/components/MapContainer";
import { LocationCard } from "@/components/LocationCard";
import { RoutePanel } from "@/components/RoutePanel";
import { ObstacleReportDialog } from "@/components/ObstacleReportDialog";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { SearchDialog } from "@/components/SearchDialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { calculateRoute } from "@/lib/directions";
import { useNavigation } from "@/hooks/use-navigation";
import type { UserPosition } from "@/hooks/use-geolocation";
import type { Location, Obstacle, InsertObstacle, RouteResponse } from "@shared/schema";

const UMBC_CENTER = { lat: 39.2544, lng: -76.7112 };

export default function Home() {
  const [travelMode, setTravelMode] = useState<'walking' | 'bicycling'>('walking');
  const [selectedRoute, setSelectedRoute] = useState<RouteResponse | null>(null);
  const [directionsResult, setDirectionsResult] = useState<any>(null);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [obstacleDialogOpen, setObstacleDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: locations = [], isLoading: locationsLoading } = useQuery<Location[]>({
    queryKey: ['/api/locations'],
  });

  const { data: obstacles = [] } = useQuery<Obstacle[]>({
    queryKey: ['/api/obstacles'],
  });

  const { currentStepIndex, distanceToNextStep, isOffRoute } = useNavigation(
    userPosition,
    selectedRoute,
    isNavigating,
    (stepIndex) => {
      if (selectedRoute && stepIndex < selectedRoute.steps.length) {
        const step = selectedRoute.steps[stepIndex];
        toast({
          title: `Next: Step ${stepIndex + 1}/${selectedRoute.steps.length}`,
          description: step.instruction.replace(/<[^>]*>/g, ''),
        });
      }
    },
    () => {
      toast({
        title: "Off Route",
        description: "You may have deviated from the planned route. Recalculating...",
        variant: "destructive",
      });
    },
    () => {
      toast({
        title: "Destination Reached!",
        description: "You have arrived at your destination.",
      });
      setIsNavigating(false);
    }
  );

  const reportObstacleMutation = useMutation({
    mutationFn: async (obstacle: InsertObstacle) => {
      return await apiRequest('POST', '/api/obstacles', obstacle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/obstacles'] });
      toast({
        title: "Obstacle reported",
        description: "Thank you for helping keep campus navigation up to date.",
      });
      setObstacleDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit obstacle report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGetDirections = async (location: Location) => {
    const origin = userPosition || UMBC_CENTER;
    
    if (!userPosition) {
      toast({
        title: "Using campus center",
        description: "Enable location access to get directions from your current position",
      });
    }

    toast({
      title: "Calculating route...",
      description: `Finding ${travelMode} directions to ${location.name}`,
    });

    try {
      const result = await calculateRoute({
        origin,
        destination: { lat: location.latitude, lng: location.longitude },
        travelMode,
      });
      
      setSelectedRoute(result.route);
      setDirectionsResult(result.googleDirectionsResult);
      
      toast({
        title: "Route found!",
        description: `${result.route.duration} (${result.route.distance})`,
      });
    } catch (error) {
      console.error('Failed to calculate route:', error);
      toast({
        title: "Route calculation failed",
        description: error instanceof Error ? error.message : "Please try again or check your internet connection",
        variant: "destructive",
      });
    }
  };

  const handleStartNavigation = () => {
    if (!userPosition) {
      toast({
        title: "Location Required",
        description: "Please enable location access to use turn-by-turn navigation.",
        variant: "destructive",
      });
      return;
    }

    if (isNavigating) {
      setIsNavigating(false);
      toast({
        title: "Navigation Stopped",
        description: "You can restart navigation at any time.",
      });
    } else {
      setIsNavigating(true);
      toast({
        title: "Navigation Started",
        description: "Follow the directions as you move. Your route will update automatically.",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchDialogOpen(true);
  };

  if (locationsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading campus data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onFindLocation={() => setSearchDialogOpen(true)}
        onReportObstacle={() => setObstacleDialogOpen(true)}
        onFeedback={() => setFeedbackDialogOpen(true)}
      />

      <main className="pt-16">
        <HeroSection onSearch={handleSearch} />
        
        <FeatureShowcase />

        <section className="py-12 px-4 md:px-6 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Interactive Campus Map</h2>
              <p className="text-muted-foreground">
                Explore UMBC campus locations and get directions
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <MapContainer
                  locations={locations}
                  obstacles={obstacles}
                  selectedRoute={selectedRoute}
                  directionsResult={directionsResult}
                  travelMode={travelMode}
                  onTravelModeChange={setTravelMode}
                  onUserLocationChange={setUserPosition}
                />
              </div>

              {selectedRoute && (
                <RoutePanel
                  route={selectedRoute}
                  mode={travelMode}
                  onClose={() => {
                    setSelectedRoute(null);
                    setDirectionsResult(null);
                    setIsNavigating(false);
                  }}
                  onStartNavigation={handleStartNavigation}
                  isNavigating={isNavigating}
                  currentStepIndex={currentStepIndex}
                />
              )}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Popular Locations</h2>
              <p className="text-muted-foreground">
                Quick access to frequently visited campus destinations
              </p>
            </div>

            {locations.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-icons text-6xl text-muted mb-4 block">location_off</span>
                <p className="text-muted-foreground">No locations available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locations.slice(0, 6).map((location) => (
                  <LocationCard
                    key={location.id}
                    location={location}
                    onGetDirections={handleGetDirections}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border py-8 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 UMBC Campus Navigator. All rights reserved.</p>
          <p className="mt-2">Navigate the University of Maryland, Baltimore County with confidence.</p>
        </div>
      </footer>

      <ObstacleReportDialog
        open={obstacleDialogOpen}
        onOpenChange={setObstacleDialogOpen}
        onSubmit={(obstacle) => reportObstacleMutation.mutate(obstacle)}
        isSubmitting={reportObstacleMutation.isPending}
      />

      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
      />

      <SearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        locations={locations}
        onSelectLocation={handleGetDirections}
      />
    </div>
  );
}
