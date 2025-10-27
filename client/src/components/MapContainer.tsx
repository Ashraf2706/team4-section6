import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { loadGoogleMapsScript } from "@/lib/googleMaps";
import { useGeolocation, type UserPosition } from "@/hooks/use-geolocation";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "lucide-react";
import type { Location, Obstacle, RouteResponse } from "@shared/schema";

interface MapContainerProps {
  locations: Location[];
  obstacles: Obstacle[];
  selectedRoute: RouteResponse | null;
  directionsResult?: any;
  travelMode: 'walking' | 'bicycling';
  onTravelModeChange: (mode: 'walking' | 'bicycling') => void;
  onUserLocationChange?: (position: UserPosition | null) => void;
  center?: { lat: number; lng: number };
}

const UMBC_CENTER = { lat: 39.2544, lng: -76.7112 };

export function MapContainer({
  locations,
  obstacles,
  selectedRoute,
  directionsResult,
  travelMode,
  onTravelModeChange,
  onUserLocationChange,
  center = UMBC_CENTER,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const accuracyCircleRef = useRef<google.maps.Circle | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { toast } = useToast();

  const { position, error, loading, startTracking, stopTracking, isTracking } = useGeolocation();

  useEffect(() => {
    if (onUserLocationChange) {
      onUserLocationChange(position);
    }
  }, [position, onUserLocationChange]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Location Error",
        description: error.message || "Unable to access your location. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setIsMapLoaded(true))
      .catch((error) => {
        console.error('Failed to load Google Maps:', error);
      });
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || mapInstanceRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: false,
      zoomControl: true,
    });

    mapInstanceRef.current = map;
    directionsRendererRef.current = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#FFC20E',
        strokeWeight: 5,
      },
    });
  }, [isMapLoaded, center]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded || !position) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition({
        lat: position.latitude,
        lng: position.longitude,
      });
    } else {
      userMarkerRef.current = new google.maps.Marker({
        position: { lat: position.latitude, lng: position.longitude },
        map: mapInstanceRef.current,
        title: "Your Location",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
        zIndex: 1000,
      });
    }

    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setCenter({
        lat: position.latitude,
        lng: position.longitude,
      });
      accuracyCircleRef.current.setRadius(position.accuracy);
    } else {
      accuracyCircleRef.current = new google.maps.Circle({
        map: mapInstanceRef.current,
        center: { lat: position.latitude, lng: position.longitude },
        radius: position.accuracy,
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        strokeColor: '#4285F4',
        strokeOpacity: 0.3,
        strokeWeight: 1,
      });
    }
  }, [position, isMapLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    locations.forEach((location) => {
      const marker = new google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: mapInstanceRef.current,
        title: location.name,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="font-weight: 600; margin-bottom: 4px;">${location.name}</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 4px;">${location.address}</p>
            ${location.buildingCode ? `<p style="font-size: 12px; color: #999;">Code: ${location.buildingCode}</p>` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    obstacles.forEach((obstacle) => {
      if (!obstacle.isActive) return;

      const marker = new google.maps.Marker({
        position: { lat: obstacle.latitude, lng: obstacle.longitude },
        map: mapInstanceRef.current,
        title: obstacle.title,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="font-weight: 600; margin-bottom: 4px;">${obstacle.title}</h3>
            <p style="font-size: 14px; color: #666; margin-bottom: 4px;">${obstacle.description}</p>
            <p style="font-size: 12px; color: #999;">Severity: ${obstacle.severity}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [locations, obstacles, isMapLoaded]);

  useEffect(() => {
    if (!directionsRendererRef.current) return;

    if (directionsResult) {
      directionsRendererRef.current.setDirections(directionsResult);
    } else {
      directionsRendererRef.current.setDirections(null);
    }
  }, [directionsResult]);

  const handleCenterOnUser = () => {
    if (!position || !mapInstanceRef.current) {
      if (!isTracking) {
        startTracking();
        toast({
          title: "Requesting Location",
          description: "Please allow location access to see your position on the map.",
        });
      } else {
        toast({
          title: "Location Unavailable",
          description: "Waiting for your location...",
        });
      }
      return;
    }

    mapInstanceRef.current.panTo({
      lat: position.latitude,
      lng: position.longitude,
    });
    mapInstanceRef.current.setZoom(17);
  };

  useEffect(() => {
    startTracking();
    
    return () => {
      stopTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMapLoaded) {
    return (
      <div className="w-full h-[65vh] bg-muted rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[65vh] rounded-xl overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" data-testid="map-container" />
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <div className="bg-card rounded-lg shadow-lg p-2 flex gap-2">
          <Button
            variant={travelMode === 'walking' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTravelModeChange('walking')}
            data-testid="button-mode-walking"
            className="gap-2"
          >
            <span className="material-icons text-base">directions_walk</span>
            <span className="hidden sm:inline">Walk</span>
          </Button>
          <Button
            variant={travelMode === 'bicycling' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onTravelModeChange('bicycling')}
            data-testid="button-mode-bicycling"
            className="gap-2"
          >
            <span className="material-icons text-base">directions_bike</span>
            <span className="hidden sm:inline">Bike</span>
          </Button>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={handleCenterOnUser}
          disabled={loading}
          data-testid="button-center-location"
          className="bg-card shadow-lg gap-2"
        >
          <Navigation className="w-4 h-4" />
          <span className="hidden sm:inline">My Location</span>
        </Button>
        
        {obstacles.filter(o => o.isActive).length > 0 && (
          <Badge variant="destructive" className="shadow-lg">
            <span className="material-icons text-xs mr-1">warning</span>
            {obstacles.filter(o => o.isActive).length} Active Obstacles
          </Badge>
        )}

        {position && (
          <Badge variant="secondary" className="shadow-lg gap-1">
            <span className="material-icons text-xs">gps_fixed</span>
            {position.accuracy < 50 ? 'High' : position.accuracy < 100 ? 'Medium' : 'Low'} Accuracy
          </Badge>
        )}
      </div>
    </div>
  );
}
