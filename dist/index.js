// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  locations;
  obstacles;
  constructor() {
    this.locations = /* @__PURE__ */ new Map();
    this.obstacles = /* @__PURE__ */ new Map();
    this.seedData();
  }
  seedData() {
    const umbcLocations = [
      {
        name: "The Commons",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2548,
        longitude: -76.7115,
        buildingCode: "COM",
        description: "Student center with dining, meeting spaces, and student services",
        isAccessible: true
      },
      {
        name: "Library (Albin O. Kuhn)",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2542,
        longitude: -76.7108,
        buildingCode: "LIB",
        description: "Main campus library with study spaces and resources",
        isAccessible: true
      },
      {
        name: "Engineering Building",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2556,
        longitude: -76.7122,
        buildingCode: "ENG",
        description: "Home to Computer Science and Engineering departments",
        isAccessible: true
      },
      {
        name: "RAC (Retriever Activities Center)",
        type: "amenity",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2534,
        longitude: -76.7098,
        buildingCode: "RAC",
        description: "Recreation and fitness center",
        isAccessible: true
      },
      {
        name: "Sherman Hall",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2552,
        longitude: -76.7132,
        buildingCode: "SH",
        description: "Academic building housing various departments",
        isAccessible: true
      },
      {
        name: "Performing Arts & Humanities",
        type: "building",
        address: "1000 Hilltop Circle, Baltimore, MD 21250",
        latitude: 39.2546,
        longitude: -76.7128,
        buildingCode: "PAH",
        description: "Theater, music, and arts programs",
        isAccessible: true
      }
    ];
    umbcLocations.forEach((loc) => {
      const id = randomUUID();
      this.locations.set(id, { ...loc, id });
    });
    const sampleObstacles = [
      {
        locationId: Array.from(this.locations.values())[0].id,
        title: "Pathway Construction",
        description: "Main walkway under renovation. Please use alternate route.",
        severity: "medium",
        type: "construction",
        latitude: 39.2545,
        longitude: -76.711,
        isActive: true
      }
    ];
    sampleObstacles.forEach((obs) => {
      const id = randomUUID();
      this.obstacles.set(id, { ...obs, id, reportedAt: /* @__PURE__ */ new Date() });
    });
  }
  async getAllLocations() {
    return Array.from(this.locations.values());
  }
  async getLocation(id) {
    return this.locations.get(id);
  }
  async createLocation(insertLocation) {
    const id = randomUUID();
    const location = { ...insertLocation, id };
    this.locations.set(id, location);
    return location;
  }
  async getAllObstacles() {
    return Array.from(this.obstacles.values());
  }
  async getObstacle(id) {
    return this.obstacles.get(id);
  }
  async createObstacle(insertObstacle) {
    const id = randomUUID();
    const obstacle = {
      ...insertObstacle,
      id,
      reportedAt: /* @__PURE__ */ new Date()
    };
    this.obstacles.set(id, obstacle);
    return obstacle;
  }
  async updateObstacle(id, updates) {
    const obstacle = this.obstacles.get(id);
    if (!obstacle) return void 0;
    const updated = { ...obstacle, ...updates };
    this.obstacles.set(id, updated);
    return updated;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, varchar, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var locations = pgTable("locations", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  type: varchar("type").notNull(),
  // building, department, amenity, parking
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  buildingCode: text("building_code"),
  description: text("description"),
  isAccessible: boolean("is_accessible").default(true)
});
var insertLocationSchema = createInsertSchema(locations).omit({ id: true });
var obstacles = pgTable("obstacles", {
  id: varchar("id").primaryKey(),
  locationId: varchar("location_id").references(() => locations.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: varchar("severity").notNull(),
  // low, medium, high
  type: varchar("type").notNull(),
  // construction, closure, weather, accessibility
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  reportedAt: timestamp("reported_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull()
});
var insertObstacleSchema = createInsertSchema(obstacles).omit({
  id: true,
  reportedAt: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/locations", async (req, res) => {
    try {
      const locations2 = await storage.getAllLocations();
      res.json(locations2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });
  app2.get("/api/locations/:id", async (req, res) => {
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
  app2.post("/api/locations", async (req, res) => {
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
  app2.get("/api/obstacles", async (req, res) => {
    try {
      const obstacles2 = await storage.getAllObstacles();
      res.json(obstacles2);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch obstacles" });
    }
  });
  app2.get("/api/obstacles/:id", async (req, res) => {
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
  app2.post("/api/obstacles", async (req, res) => {
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
  app2.patch("/api/obstacles/:id", async (req, res) => {
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
  app2.post("/api/routes", async (req, res) => {
    try {
      const { origin, destination, mode } = req.body;
      if (!origin || !destination || !mode) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      const mockRoute = {
        distance: mode === "walking" ? "1.2 km" : "1.2 km",
        duration: mode === "walking" ? "15 min" : "8 min",
        steps: [
          {
            instruction: "Head <b>north</b> on Campus Drive",
            distance: "200 m",
            duration: "2 min",
            maneuver: "straight"
          },
          {
            instruction: "Turn <b>right</b> onto Academic Way",
            distance: "450 m",
            duration: "5 min",
            maneuver: "turn-right"
          },
          {
            instruction: "Turn <b>left</b> at the library",
            distance: "300 m",
            duration: "4 min",
            maneuver: "turn-left"
          },
          {
            instruction: "Destination will be on your <b>right</b>",
            distance: "250 m",
            duration: "3 min"
          }
        ],
        overview_polyline: ""
      };
      res.json(mockRoute);
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate route" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
