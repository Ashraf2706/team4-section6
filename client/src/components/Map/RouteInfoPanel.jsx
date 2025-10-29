import React from 'react';
import { X, Navigation, Clock, TrendingUp, Footprints, Bike } from 'lucide-react';
import Button from '../UI/Button';

const RouteInfoPanel = ({ 
  routeInfo, 
  onClose, 
  onStartNavigation,
  travelMode,
  onToggleMode 
}) => {
  if (!routeInfo) return null;

  const formatDuration = (seconds) => {
    const mins = Math.round(seconds / 60);
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  const formatDistance = (meters) => {
    const miles = (meters * 0.000621371).toFixed(1);
    return `${miles} mi`;
  };

  return (
    <div className="absolute top-4 left-4 w-96 bg-white rounded-lg shadow-2xl overflow-hidden z-30">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Route Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Duration and Distance */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Clock size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(routeInfo.duration)}
              </p>
              <p className="text-xs text-gray-500">Duration</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatDistance(routeInfo.distance)}
              </p>
              <p className="text-xs text-gray-500">Distance</p>
            </div>
          </div>
        </div>

        {/* Travel Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => onToggleMode('walking')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              travelMode === 'walking'
                ? 'bg-umbc-gold text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Footprints size={18} />
            Walk
          </button>
          <button
            onClick={() => onToggleMode('bicycling')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
              travelMode === 'bicycling'
                ? 'bg-umbc-gold text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Bike size={18} />
            Bike
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="max-h-96 overflow-y-auto p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Directions</h3>
        <div className="space-y-4">
          {routeInfo.steps && routeInfo.steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 mb-1">{step.instruction}</p>
                <p className="text-xs text-gray-500">{step.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6 border-t border-gray-200">
        <Button
          variant="primary"
          size="lg"
          onClick={onStartNavigation}
          className="w-full"
          icon={Navigation}
        >
          Start Navigation
        </Button>
      </div>
    </div>
  );
};

export default RouteInfoPanel;