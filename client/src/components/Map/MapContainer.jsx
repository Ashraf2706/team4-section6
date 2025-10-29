import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { MapPin, Navigation as NavigationIcon } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 39.2551,
  lng: -76.7130
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

const MapContainer = ({ 
  locations = [], 
  selectedLocation, 
  onMarkerClick,
  userLocation,
  route,
  onMapClick 
}) => {
  const [map, setMap] = useState(null);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fit map bounds when route changes
  useEffect(() => {
    if (map && route && route.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      route.forEach(point => {
        bounds.extend(point);
      });
      map.fitBounds(bounds);
    }
  }, [map, route]);

  // Center on selected location
  useEffect(() => {
    if (map && selectedLocation) {
      map.panTo({
        lat: selectedLocation.coordinates.lat,
        lng: selectedLocation.coordinates.lng
      });
      map.setZoom(17);
    }
  }, [map, selectedLocation]);

  const getBuildingIcon = (type) => {
    const colors = {
      'Academic': '#3B82F6',
      'Dining': '#F59E0B',
      'Recreation': '#10B981',
      'Residential': '#8B5CF6',
      'Administrative': '#6B7280',
      'Parking': '#EF4444',
    };
    
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: colors[type] || '#3B82F6',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8,
    };
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        onClick={onMapClick}
      >
        {/* Building Markers */}
        {locations.map((location) => (
          <Marker
            key={location.locationID}
            position={{
              lat: location.coordinates.lat,
              lng: location.coordinates.lng
            }}
            icon={getBuildingIcon(location.type)}
            onClick={() => onMarkerClick(location)}
            title={location.name}
          />
        ))}

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
              scale: 10,
            }}
            title="Your Location"
          />
        )}

        {/* Route Polyline */}
        {route && route.length > 0 && (
          <Polyline
            path={route}
            options={{
              strokeColor: '#4285F4',
              strokeOpacity: 0.8,
              strokeWeight: 5,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;