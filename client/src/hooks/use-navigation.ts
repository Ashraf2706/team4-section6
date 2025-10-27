import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserPosition } from './use-geolocation';
import type { RouteResponse } from '@shared/schema';

interface NavigationState {
  currentStepIndex: number;
  distanceToNextStep: number | null;
  isOffRoute: boolean;
}

const DISTANCE_THRESHOLD_METERS = 50;
const OFF_ROUTE_THRESHOLD_METERS = 100;

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function useNavigation(
  userPosition: UserPosition | null,
  route: RouteResponse | null,
  isNavigating: boolean,
  onStepChange?: (stepIndex: number) => void,
  onOffRoute?: () => void,
  onDestinationReached?: () => void
): NavigationState {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [distanceToNextStep, setDistanceToNextStep] = useState<number | null>(null);
  const [isOffRoute, setIsOffRoute] = useState(false);
  const previousStepIndexRef = useRef(0);

  const updateNavigationState = useCallback(() => {
    if (!userPosition || !route || !isNavigating || route.steps.length === 0) {
      return;
    }

    const currentStep = route.steps[currentStepIndex];
    
    if (!currentStep?.endLocation) {
      return;
    }

    const distanceToEnd = calculateDistance(
      userPosition.latitude,
      userPosition.longitude,
      currentStep.endLocation.lat,
      currentStep.endLocation.lng
    );

    setDistanceToNextStep(distanceToEnd);

    if (distanceToEnd < DISTANCE_THRESHOLD_METERS) {
      if (currentStepIndex < route.steps.length - 1) {
        const nextStepIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextStepIndex);
        
        if (previousStepIndexRef.current !== nextStepIndex && onStepChange) {
          onStepChange(nextStepIndex);
        }
        previousStepIndexRef.current = nextStepIndex;
      } else {
        if (distanceToEnd < 10 && onDestinationReached) {
          onDestinationReached();
        }
      }
    }

    if (currentStep.startLocation) {
      const distanceToStepStart = calculateDistance(
        userPosition.latitude,
        userPosition.longitude,
        currentStep.startLocation.lat,
        currentStep.startLocation.lng
      );

      const isCurrentlyOffRoute = 
        distanceToStepStart > OFF_ROUTE_THRESHOLD_METERS && 
        distanceToEnd > OFF_ROUTE_THRESHOLD_METERS;

      if (isCurrentlyOffRoute && !isOffRoute) {
        setIsOffRoute(true);
        if (onOffRoute) {
          onOffRoute();
        }
      } else if (!isCurrentlyOffRoute && isOffRoute) {
        setIsOffRoute(false);
      }
    }
  }, [userPosition, route, isNavigating, currentStepIndex, isOffRoute, onStepChange, onOffRoute, onDestinationReached]);

  useEffect(() => {
    if (isNavigating && userPosition && route) {
      updateNavigationState();
    }
  }, [isNavigating, userPosition, route, updateNavigationState]);

  useEffect(() => {
    if (!isNavigating) {
      setCurrentStepIndex(0);
      setDistanceToNextStep(null);
      setIsOffRoute(false);
      previousStepIndexRef.current = 0;
    }
  }, [isNavigating]);

  return {
    currentStepIndex,
    distanceToNextStep,
    isOffRoute,
  };
}
