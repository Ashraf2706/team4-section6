import React from 'react';
import { X, MapPin, Building2, Navigation, Bike } from 'lucide-react';
import Button from '../UI/Button';

const BuildingDetailsPanel = ({ building, onClose, onGetDirections }) => {
  if (!building) return null;

  const getBuildingIcon = (type) => {
    const icons = {
      'Academic': '🏫',
      'Dining': '🍽️',
      'Recreation': '🏃',
      'Residential': '🏠',
      'Administrative': '🏢',
      'Parking': '🅿️',
    };
    return icons[type] || '📍';
  };

  return (
    <div className="absolute top-4 left-4 w-96 bg-white rounded-lg shadow-2xl overflow-hidden z-30 max-h-[calc(100vh-2rem)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{getBuildingIcon(building.type)}</div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {building.name}
        </h2>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-umbc-gold text-black text-sm font-medium rounded-full">
            {building.shortName}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
            {building.type}
          </span>
        </div>

        <div className="flex items-start gap-2 text-gray-600 text-sm">
          <MapPin size={16} className="mt-0.5 flex-shrink-0" />
          <p>{building.address}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Departments */}
        {building.departments && building.departments.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Building2 size={16} />
              Departments & Offices
            </h3>
            <ul className="space-y-2">
              {building.departments.map((dept, index) => (
                <li key={index} className="text-sm text-gray-600 pl-6">
                  • {dept}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bike Features */}
        {building.bikeFeatures && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Bike size={16} />
              Bike Facilities
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Bike Racks Available</span>
                <span className={`font-medium ${building.bikeFeatures.bikeRackAvailable ? 'text-green-600' : 'text-red-600'}`}>
                  {building.bikeFeatures.bikeRackAvailable ? '✓ Yes' : '✗ No'}
                </span>
              </div>
              
              {building.bikeFeatures.bikeRackAvailable && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium text-gray-900">
                      {building.bikeFeatures.bikeRackCapacity} bikes
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Covered Parking</span>
                    <span className={`font-medium ${building.bikeFeatures.coveredBikeParking ? 'text-green-600' : 'text-gray-400'}`}>
                      {building.bikeFeatures.coveredBikeParking ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Repair Station</span>
                    <span className={`font-medium ${building.bikeFeatures.bikeRepairStation ? 'text-green-600' : 'text-gray-400'}`}>
                      {building.bikeFeatures.bikeRepairStation ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-6 border-t border-gray-200">
        <Button
          variant="primary"
          size="lg"
          onClick={() => onGetDirections(building)}
          className="w-full"
          icon={Navigation}
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
};

export default BuildingDetailsPanel;