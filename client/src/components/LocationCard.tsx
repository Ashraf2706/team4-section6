import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Location } from "@shared/schema";

interface LocationCardProps {
  location: Location;
  onGetDirections: (location: Location) => void;
}

export function LocationCard({ location, onGetDirections }: LocationCardProps) {
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'building':
        return 'business';
      case 'department':
        return 'school';
      case 'amenity':
        return 'local_cafe';
      case 'parking':
        return 'local_parking';
      default:
        return 'place';
    }
  };

  return (
    <Card className="p-6 hover-elevate transition-all duration-200" data-testid={`card-location-${location.id}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <span className="material-icons text-primary text-2xl flex-shrink-0">
            {getLocationIcon(location.type)}
          </span>
          {location.isAccessible && (
            <Badge variant="secondary" className="gap-1">
              <span className="material-icons text-xs">accessible</span>
              Accessible
            </Badge>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-1">{location.name}</h3>
          {location.buildingCode && (
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {location.buildingCode}
            </p>
          )}
          <p className="text-sm text-muted-foreground">{location.address}</p>
        </div>

        {location.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {location.description}
          </p>
        )}

        <Button
          onClick={() => onGetDirections(location)}
          className="w-full"
          data-testid={`button-directions-${location.id}`}
        >
          <span className="material-icons text-base mr-2">navigation</span>
          Get Directions
        </Button>
      </div>
    </Card>
  );
}
