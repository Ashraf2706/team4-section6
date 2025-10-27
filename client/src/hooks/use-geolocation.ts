import { useState, useEffect } from 'react';

export interface UserPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

export interface LocationError {
  code: number;
  message: string;
}

export interface UseGeolocationReturn {
  position: UserPosition | null;
  error: LocationError | null;
  loading: boolean;
  requestPermission: () => void;
  startTracking: () => void;
  stopTracking: () => void;
  isTracking: boolean;
}

export function useGeolocation(enableHighAccuracy = true): UseGeolocationReturn {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const handleSuccess = (pos: GeolocationPosition) => {
    setPosition({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      timestamp: pos.timestamp,
    });
    setError(null);
    setLoading(false);
  };

  const handleError = (err: GeolocationPositionError) => {
    setError({
      code: err.code,
      message: err.message,
    });
    setLoading(false);
  };

  const requestPermission = () => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy,
      timeout: 10000,
      maximumAge: 0,
    });
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      });
      return;
    }

    if (isTracking) {
      return;
    }

    setLoading(true);
    setIsTracking(true);

    const id = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy,
      timeout: 10000,
      maximumAge: 0,
    });

    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
    }
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    position,
    error,
    loading,
    requestPermission,
    startTracking,
    stopTracking,
    isTracking,
  };
}
