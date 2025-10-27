import type { RouteResponse, RouteStep } from "@shared/schema";
import type { UserPosition } from "@/hooks/use-geolocation";

export interface DirectionsRequest {
  origin: { lat: number; lng: number } | UserPosition;
  destination: { lat: number; lng: number };
  travelMode: 'walking' | 'bicycling';
}

function convertToLatLng(position: { lat: number; lng: number } | UserPosition): { lat: number; lng: number } {
  if ('latitude' in position) {
    return { lat: position.latitude, lng: position.longitude };
  }
  return position;
}

export interface RouteResult {
  route: RouteResponse;
  googleDirectionsResult: any;
}

export async function calculateRoute(request: DirectionsRequest): Promise<RouteResult> {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    
    const origin = convertToLatLng(request.origin);
    const destination = convertToLatLng(request.destination);

    const googleTravelMode = request.travelMode === 'walking' 
      ? google.maps.TravelMode.WALKING 
      : google.maps.TravelMode.BICYCLING;

    directionsService.route(
      {
        origin,
        destination,
        travelMode: googleTravelMode,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0];
          const leg = route.legs[0];

          const steps: RouteStep[] = leg.steps.map((step: any) => ({
            instruction: step.instructions,
            distance: step.distance.text,
            duration: step.duration.text,
            maneuver: step.maneuver || undefined,
            startLocation: {
              lat: step.start_location.lat(),
              lng: step.start_location.lng(),
            },
            endLocation: {
              lat: step.end_location.lat(),
              lng: step.end_location.lng(),
            },
          }));

          const routeResponse: RouteResponse = {
            distance: leg.distance.text,
            duration: leg.duration.text,
            steps,
            overview_polyline: route.overview_polyline,
          };

          resolve({
            route: routeResponse,
            googleDirectionsResult: result,
          });
        } else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
          reject(new Error('No route found between these locations'));
        } else if (status === google.maps.DirectionsStatus.NOT_FOUND) {
          reject(new Error('One or both locations could not be found'));
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      }
    );
  });
}

export function renderDirectionsOnMap(
  map: google.maps.Map,
  renderer: google.maps.DirectionsRenderer,
  result: any
): void {
  if (renderer && result) {
    renderer.setDirections(result);
  }
}
