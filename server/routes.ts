import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mappingDataSchema } from "@shared/schema";
import { z } from "zod";

// Sample data for development
const sampleMappingData = {
  "PID-5": "(0010,0010)",
  "PID-3": "(0010,0020)",
  "PID-7": "(0010,0030)",
  "PID-8": "(0010,0040)",
  "OBR-3": "(0008,0050)",
  "ORC-12": "(0032,1032)",
  "OBR-4.1": "(0040,0100)>(0008,0060)",
  "OBR-7 (Date)": "(0040,0100)>(0040,0002)",
  "OBR-7 (Time)": "(0040,0100)>(0040,0003)",
  "OBR-34": "(0040,0100)>(0040,0006)",
  "OBR-4.2": "(0040,0100)>(0032,1070)"
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API route to get the mapping data
  app.get("/api/mapping-data", (req, res) => {
    try {
      return res.json(sampleMappingData);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch mapping data" });
    }
  });

  // API route to update the mapping data
  app.post("/api/mapping-data", (req, res) => {
    try {
      const result = mappingDataSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid mapping data format",
          errors: result.error.errors 
        });
      }
      
      // In a real app, we would store this in the database
      // For this example, we'll just return the validated data
      return res.json(result.data);
    } catch (error) {
      return res.status(500).json({ message: "Failed to update mapping data" });
    }
  });

  // API route to save visualization settings
  app.post("/api/visualization-settings", (req, res) => {
    try {
      const schema = z.object({
        animationSpeed: z.number().min(1).max(10),
        flowPathComplexity: z.enum(["Simple", "Standard", "Complex"]),
        autoMapping: z.boolean(),
        validateFields: z.boolean(),
        showDescriptions: z.boolean(),
        refreshInterval: z.number().min(5),
        errorHandling: z.enum(["Log Only", "Notify & Log", "Auto-retry & Notify"])
      });

      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid settings format",
          errors: result.error.errors 
        });
      }
      
      // In a real app, we would store the settings in the database
      // For this example, we'll just return success
      return res.json({ message: "Settings saved successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to save settings" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
