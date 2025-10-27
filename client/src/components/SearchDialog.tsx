import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import type { Location } from "@shared/schema";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locations: Location[];
  onSelectLocation: (location: Location) => void;
}

export function SearchDialog({
  open,
  onOpenChange,
  locations,
  onSelectLocation,
}: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = locations.filter((location) => {
    const query = searchQuery.toLowerCase();
    return (
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query) ||
      location.buildingCode?.toLowerCase().includes(query) ||
      location.type.toLowerCase().includes(query)
    );
  });

  const groupedLocations = filteredLocations.reduce((acc, location) => {
    const category = location.type.charAt(0).toUpperCase() + location.type.slice(1) + 's';
    if (!acc[category]) acc[category] = [];
    acc[category].push(location);
    return acc;
  }, {} as Record<string, Location[]>);

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

  const handleSelectLocation = (location: Location) => {
    onSelectLocation(location);
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">Search Locations</DialogTitle>
        </DialogHeader>

        <div className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search buildings, departments, or amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
              data-testid="input-search-locations"
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
          {searchQuery.trim() === "" ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <span className="material-icons text-4xl mb-2 block text-muted">search</span>
              Start typing to search for locations
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              <span className="material-icons text-4xl mb-2 block text-muted">search_off</span>
              No locations found matching "{searchQuery}"
            </div>
          ) : (
            <div className="space-y-4 p-6 pt-4">
              {Object.entries(groupedLocations).map(([category, locs]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {locs.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleSelectLocation(location)}
                        className="w-full flex items-center gap-3 p-3 hover-elevate rounded-lg text-left transition-all"
                        data-testid={`search-result-${location.id}`}
                      >
                        <span className="material-icons text-primary">
                          {getLocationIcon(location.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{location.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {location.buildingCode && `${location.buildingCode} • `}
                            {location.address}
                          </p>
                        </div>
                        {location.isAccessible && (
                          <span className="material-icons text-sm text-muted-foreground">
                            accessible
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
