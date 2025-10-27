declare namespace google {
  export namespace maps {
    export class Map {
      constructor(element: HTMLElement, options: any);
      panTo(latLng: any): void;
      setZoom(zoom: number): void;
    }
    export class Marker {
      constructor(options: any);
      setPosition(position: any): void;
      setMap(map: Map | null): void;
      addListener(event: string, handler: () => void): void;
    }
    export class InfoWindow {
      constructor(options: any);
      open(map: Map | null, marker?: Marker): void;
    }
    export class DirectionsRenderer {
      constructor(options: any);
      setDirections(directions: any): void;
    }
    export class Circle {
      constructor(options: any);
      setCenter(position: any): void;
      setRadius(radius: number): void;
      setMap(map: Map | null): void;
    }
    export enum SymbolPath {
      CIRCLE = 0,
    }
    export class DirectionsService {
      route(request: any, callback: (result: any, status: any) => void): void;
    }
    export enum TravelMode {
      WALKING = 'WALKING',
      BICYCLING = 'BICYCLING',
    }
    export enum DirectionsStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      NOT_FOUND = 'NOT_FOUND',
      INVALID_REQUEST = 'INVALID_REQUEST',
    }
  }
}

interface Window {
  google: typeof google;
}
