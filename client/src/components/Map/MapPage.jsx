import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, Navigation, Bike } from 'lucide-react';
import MapContainer from './MapContainer';
import BuildingDetailsPanel from '../Building/BuildingDetailsPanel';
import RouteInfoPanel from './RouteInfoPanel';
import Button from '../UI/Button';
import { getAllLocations } from '../../services/locationService';
import { calculateRoute } from '../../services/routeService';

const MapPage = () => {
  const location = useLocation();
  const [locations, setLocations] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [travelMode, setTravelMode] = useState('walking');
  const [loading, setLoading] = useState(true);
  const [activeObstacles, setActiveObstacles] = useState(1); // Mock data

  useEffect(() => {
    fetchLocations();
    getUserLocation();
    
    // Check if we have a selected location from navigation
    if (location.state?.selectedLocation) {
      setSelectedBuilding(location.state.selectedLocation);
    }
  }, [location.state]);

  const fetchLocations = async () => {
    try {
      const response = await getAllLocations();
      if (response.success) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use UMBC center as fallback
          setUserLocation({ lat: 39.2551, lng: -76.7130 });
        }
      );
    }
  };

  const handleGetDirections = async (building) => {
    if (!userLocation) {
      alert('Unable to get your current location. Please enable location services.');
      return;
    }

    try {
      const response = await calculateRoute(
        userLocation.lat,
        userLocation.lng,
        building.coordinates.lat,
        building.coordinates.lng,
        travelMode === 'bicycling'
      );

      if (response.success) {
        setRouteInfo(response.route);
        
        // Decode polyline to get route path
        const decodedPath = decodePolyline(response.route.polyline);
        setRoutePath(decodedPath);
        
        setSelectedBuilding(null);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Failed to calculate route. Please try again.');
    }
  };

  const decodePolyline = (encoded) => {
    const poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return poly;
  };

  const handleToggleTravelMode = async (mode) => {
    setTravelMode(mode);
    
    if (routeInfo && userLocation && selectedBuilding) {
      // Recalculate route with new mode
      await handleGetDirections(selectedBuilding);
    }
  };

  const handleStartNavigation = () => {
    alert('Navigation mode would start here. This would show turn-by-turn directions in real-time.');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-umbc-gold border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      {/* Map Controls - Top Right */}
      <div className="absolute top-4 right-4 z-30 space-y-2">
        {/* Travel Mode Toggle */}
        <div className="bg-white rounded-lg shadow-lg p-2 flex gap-2">
          <button
            onClick={() => handleToggleTravelMode('walking')}
            className={`p-2 rounded-lg transition-colors ${
              travelMode === 'walking'
                ? 'bg-umbc-gold text-black'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Walking"
          >
            <Navigation size={20} />
          </button>
          <button
            onClick={() => handleToggleTravelMode('bicycling')}
            className={`p-2 rounded-lg transition-colors ${
              travelMode === 'bicycling'
                ? 'bg-umbc-gold text-black'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Biking"
          >
            <Bike size={20} />
          </button>
        </div>

        {/* Active Obstacles Alert */}
        {activeObstacles > 0 && (
          <div className="bg-red-500 text-white rounded-lg shadow-lg p-3 flex items-center gap-2">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">
              {activeObstacles} Active Obstacle{activeObstacles !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Map */}
      <MapContainer
        locations={locations}
        selectedLocation={selectedBuilding}
        onMarkerClick={setSelectedBuilding}
        userLocation={userLocation}
        route={routePath}
      />

      {/* Building Details Panel */}
      {selectedBuilding && !routeInfo && (
        <BuildingDetailsPanel
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
          onGetDirections={handleGetDirections}
        />
      )}

      {/* Route Info Panel */}
      {routeInfo && (
        <RouteInfoPanel
          routeInfo={routeInfo}
          onClose={() => {
            setRouteInfo(null);
            setRoutePath([]);
          }}
          onStartNavigation={handleStartNavigation}
          travelMode={travelMode}
          onToggleMode={handleToggleTravelMode}
        />
      )}
    </div>
  );
};

export default MapPage;