import { type Location, type InsertLocation, type Obstacle, type InsertObstacle } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  getAllObstacles(): Promise<Obstacle[]>;
  getObstacle(id: string): Promise<Obstacle | undefined>;
  createObstacle(obstacle: InsertObstacle): Promise<Obstacle>;
  updateObstacle(id: string, updates: Partial<Obstacle>): Promise<Obstacle | undefined>;
}

export class MemStorage implements IStorage {
  private locations: Map<string, Location>;
  private obstacles: Map<string, Obstacle>;

  constructor() {
    this.locations = new Map();
    this.obstacles = new Map();
    this.seedData();
  }

  private seedData() {
    const umbcLocations: InsertLocation[] = [
      {
        name: "The Commons",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2548,
        longitude: -76.7115,
        buildingCode: "COM",
        description: "Student center with dining, meeting spaces, and student services",
        isAccessible: true,
      },
      {
        name: "Library (Albin O. Kuhn)",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2542,
        longitude: -76.7108,
        buildingCode: "LIB",
        description: "Main campus library with study spaces and resources",
        isAccessible: true,
      },
      {
        name: "Engineering Building",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2556,
        longitude: -76.7122,
        buildingCode: "ENG",
        description: "Home to Computer Science and Engineering departments",
        isAccessible: true,
      },
      {
        name: "RAC (Retriever Activities Center)",
        type: "amenity",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2534,
        longitude: -76.7098,
        buildingCode: "RAC",
        description: "Recreation and fitness center",
        isAccessible: true,
      },
      {
        name: "Sherman Hall",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2552,
        longitude: -76.7132,
        buildingCode: "SH",
        description: "Academic building housing various departments",
        isAccessible: true,
      },
      {
        name: "Performing Arts & Humanities",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2546,
        longitude: -76.7128,
        buildingCode: "PAH",
        description: "Theater, music, and arts programs",
        isAccessible: true,
      },
    ];

    umbcLocations.forEach(loc => {
      const id = randomUUID();
      this.locations.set(id, { ...loc, id });
    });

    const sampleObstacles: InsertObstacle[] = [
      {
        locationId: Array.from(this.locations.values())[0].id,
        title: "Pathway Construction",
        description: "Main walkway under renovation. Please use alternate route.",
        severity: "medium",
        type: "construction",
        latitude: 39.2545,
        longitude: -76.7110,
        isActive: true,
      },
    ];

    sampleObstacles.forEach(obs => {
      const id = randomUUID();
      this.obstacles.set(id, { ...obs, id, reportedAt: new Date() });
    });
  }

  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = { ...insertLocation, id };
    this.locations.set(id, location);
    return location;
  }

  async getAllObstacles(): Promise<Obstacle[]> {
    return Array.from(this.obstacles.values());
  }

  async getObstacle(id: string): Promise<Obstacle | undefined> {
    return this.obstacles.get(id);
  }

  async createObstacle(insertObstacle: InsertObstacle): Promise<Obstacle> {
    const id = randomUUID();
    const obstacle: Obstacle = { 
      ...insertObstacle, 
      id, 
      reportedAt: new Date(),
    };
    this.obstacles.set(id, obstacle);
    return obstacle;
  }

  async updateObstacle(id: string, updates: Partial<Obstacle>): Promise<Obstacle | undefined> {
    const obstacle = this.obstacles.get(id);
    if (!obstacle) return undefined;
    
    const updated = { ...obstacle, ...updates };
    this.obstacles.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
