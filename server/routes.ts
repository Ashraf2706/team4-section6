import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLocationSchema, insertObstacleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getAllLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  app.get("/api/locations/:id", async (req, res) => {
    try {
      const location = await storage.getLocation(req.params.id);
      if (!location) {
        return res.status(404).json({ error: "Location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch location" });
    }
  });

  app.post("/api/locations", async (req, res) => {
    try {
      const validatedData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(validatedData);
      res.status(201).json(location);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid location data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create location" });
    }
  });

  app.get("/api/obstacles", async (req, res) => {
    try {
      const obstacles = await storage.getAllObstacles();
      res.json(obstacles);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch obstacles" });
    }
  });

  app.get("/api/obstacles/:id", async (req, res) => {
    try {
      const obstacle = await storage.getObstacle(req.params.id);
      if (!obstacle) {
        return res.status(404).json({ error: "Obstacle not found" });
      }
      res.json(obstacle);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch obstacle" });
    }
  });

  app.post("/api/obstacles", async (req, res) => {
    try {
      const validatedData = insertObstacleSchema.parse(req.body);
      const obstacle = await storage.createObstacle(validatedData);
      res.status(201).json(obstacle);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid obstacle data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create obstacle" });
    }
  });

  app.patch("/api/obstacles/:id", async (req, res) => {
    try {
      const updates = req.body;
      const obstacle = await storage.updateObstacle(req.params.id, updates);
      if (!obstacle) {
        return res.status(404).json({ error: "Obstacle not found" });
      }
      res.json(obstacle);
    } catch (error) {
      res.status(500).json({ error: "Failed to update obstacle" });
    }
  });

  app.post("/api/routes", async (req, res) => {
    try {
      const { origin, destination, mode } = req.body;

      if (!origin || !destination || !mode) {
        return res.status(400).json({ error: "Missing required parameters" });
      }

      const mockRoute = {
        distance: mode === 'walking' ? "1.2 km" : "1.2 km",
        duration: mode === 'walking' ? "15 min" : "8 min",
        steps: [
          {
            instruction: "Head <b>north</b> on Campus Drive",
            distance: "200 m",
            duration: "2 min",
            maneuver: "straight",
          },
          {
            instruction: "Turn <b>right</b> onto Academic Way",
            distance: "450 m",
            duration: "5 min",
            maneuver: "turn-right",
          },
          {
            instruction: "Turn <b>left</b> at the library",
            distance: "300 m",
            duration: "4 min",
            maneuver: "turn-left",
          },
          {
            instruction: "Destination will be on your <b>right</b>",
            distance: "250 m",
            duration: "3 min",
          },
        ],
        overview_polyline: "",
      };

      res.json(mockRoute);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate route" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
