import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { didCreationRequestSchema, insertDidResolutionSchema } from "@shared/schema";
import { Web5 } from '@web5/api';
import { webcrypto } from "node:crypto";

// Polyfill for Node.js crypto
if (!globalThis.crypto) {
  (globalThis as any).crypto = webcrypto;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize system logs
  await storage.createSystemLog({
    level: "INFO",
    message: "Web5 DID Creator API initialized",
    data: { nodeVersion: process.version, timestamp: new Date().toISOString() }
  });

  // Create DID endpoint
  app.post("/api/did/create", async (req, res) => {
    try {
      const validatedData = didCreationRequestSchema.parse(req.body);
      
      await storage.createSystemLog({
        level: "DEBUG",
        message: "DID creation request received",
        data: validatedData
      });

      let web5Options: any = {};
      
      // Configure based on connection method
      switch (validatedData.method) {
        case "custom":
          if (validatedData.dwnEndpoints && validatedData.dwnEndpoints.length > 0) {
            web5Options.techPreview = {
              dwnEndpoints: validatedData.dwnEndpoints
            };
          }
          break;
        case "community":
          web5Options.didCreateOptions = {
            dwnEndpoints: ['https://dwn.gcda.xyz']
          };
          break;
        case "auto":
        default:
          // Use default Web5.connect() behavior
          break;
      }

      // Add sync configuration
      if (validatedData.syncInterval !== "off") {
        web5Options.sync = validatedData.syncInterval;
      } else {
        web5Options.sync = "off";
      }

      await storage.createSystemLog({
        level: "DEBUG",
        message: "Connecting to Web5...",
        data: { options: web5Options }
      });

      // Connect to Web5 and create DID
      const { web5, did: userDid } = await Web5.connect(web5Options);

      await storage.createSystemLog({
        level: "INFO",
        message: "Web5 connection established",
        data: { did: userDid }
      });

      // Resolve the DID document
      const didDocument = await web5.did.resolve(userDid);

      // Store the DID in our storage
      const createdDid = await storage.createDid({
        did: userDid,
        method: validatedData.didMethod,
        document: didDocument,
        keyStored: validatedData.keyStored,
        syncInterval: validatedData.syncInterval,
        dwnEndpoints: validatedData.dwnEndpoints || null,
      });

      await storage.createSystemLog({
        level: "SUCCESS",
        message: "DID document generated and stored",
        data: { didId: createdDid.id }
      });

      res.json({
        success: true,
        data: {
          did: createdDid,
          document: didDocument,
          web5Connected: true
        }
      });

    } catch (error: any) {
      await storage.createSystemLog({
        level: "ERROR",
        message: "DID creation failed",
        data: { error: error.message, stack: error.stack }
      });

      res.status(500).json({
        success: false,
        error: error.message || "Failed to create DID"
      });
    }
  });

  // Resolve DID endpoint
  app.post("/api/did/resolve", async (req, res) => {
    try {
      const { did } = insertDidResolutionSchema.parse(req.body);

      await storage.createSystemLog({
        level: "DEBUG",
        message: `DID resolution requested: ${did}`,
        data: { did }
      });

      // Initialize Web5 for resolution
      const { web5 } = await Web5.connect();
      
      // Resolve the DID
      const didDocument = await web5.did.resolve(did);

      // Store the resolution
      const resolution = await storage.createDidResolution({
        did,
        document: didDocument,
        success: true
      });

      res.json({
        success: true,
        data: {
          resolution,
          document: didDocument
        }
      });

    } catch (error: any) {
      await storage.createDidResolution({
        did: req.body.did || "unknown",
        success: false,
        error: error.message
      });

      res.status(500).json({
        success: false,
        error: error.message || "Failed to resolve DID"
      });
    }
  });

  // Get all DIDs
  app.get("/api/dids", async (req, res) => {
    try {
      const dids = await storage.getAllDids();
      res.json({
        success: true,
        data: dids
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to retrieve DIDs"
      });
    }
  });

  // Get DID by ID
  app.get("/api/did/:id", async (req, res) => {
    try {
      const did = await storage.getDid(req.params.id);
      if (!did) {
        return res.status(404).json({
          success: false,
          error: "DID not found"
        });
      }
      res.json({
        success: true,
        data: did
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to retrieve DID"
      });
    }
  });

  // Get system status
  app.get("/api/status", async (req, res) => {
    try {
      const recentLogs = await storage.getSystemLogs(10);
      const allDids = await storage.getAllDids();
      
      res.json({
        success: true,
        data: {
          web5Connected: true,
          dwnOnline: true,
          syncActive: true,
          nodeVersion: process.version,
          web5Version: "0.10.0", // This would come from package.json in real implementation
          totalDids: allDids.length,
          recentLogs,
          lastSync: new Date().toISOString()
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to get system status"
      });
    }
  });

  // Get system logs
  app.get("/api/logs", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const logs = await storage.getSystemLogs(limit);
      res.json({
        success: true,
        data: logs
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to retrieve logs"
      });
    }
  });

  // Clear system logs
  app.delete("/api/logs", async (req, res) => {
    try {
      await storage.clearSystemLogs();
      res.json({
        success: true,
        message: "Logs cleared successfully"
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || "Failed to clear logs"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
