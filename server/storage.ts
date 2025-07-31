import { type Did, type InsertDid, type DidResolution, type InsertDidResolution, type SystemLog, type InsertSystemLog, dids, didResolutions, systemLogs } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // DID operations
  createDid(did: InsertDid & { did: string; document: any }): Promise<Did>;
  getDid(id: string): Promise<Did | undefined>;
  getDidByIdentifier(did: string): Promise<Did | undefined>;
  getAllDids(): Promise<Did[]>;

  // DID resolution operations
  createDidResolution(resolution: InsertDidResolution & { document?: any; success: boolean; error?: string }): Promise<DidResolution>;
  getDidResolution(did: string): Promise<DidResolution | undefined>;
  getAllDidResolutions(): Promise<DidResolution[]>;

  // System log operations
  createSystemLog(log: InsertSystemLog): Promise<SystemLog>;
  getSystemLogs(limit?: number): Promise<SystemLog[]>;
  clearSystemLogs(): Promise<void>;
}

export class MemStorage implements IStorage {
  private dids: Map<string, Did>;
  private didResolutions: Map<string, DidResolution>;
  private systemLogs: SystemLog[];

  constructor() {
    this.dids = new Map();
    this.didResolutions = new Map();
    this.systemLogs = [];
  }

  async createDid(insertDid: InsertDid & { did: string; document: any }): Promise<Did> {
    const id = randomUUID();
    const did: Did = {
      ...insertDid,
      id,
      createdAt: new Date(),
      syncInterval: insertDid.syncInterval || null,
      keyStored: insertDid.keyStored || null,
      dwnEndpoints: insertDid.dwnEndpoints || null,
    };
    this.dids.set(id, did);
    
    // Log the creation
    await this.createSystemLog({
      level: "SUCCESS",
      message: `DID created: ${insertDid.did}`,
      data: { didId: id, method: insertDid.method }
    });
    
    return did;
  }

  async getDid(id: string): Promise<Did | undefined> {
    return this.dids.get(id);
  }

  async getDidByIdentifier(did: string): Promise<Did | undefined> {
    return Array.from(this.dids.values()).find(d => d.did === did);
  }

  async getAllDids(): Promise<Did[]> {
    return Array.from(this.dids.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createDidResolution(insertResolution: InsertDidResolution & { document?: any; success: boolean; error?: string }): Promise<DidResolution> {
    const id = randomUUID();
    const resolution: DidResolution = {
      ...insertResolution,
      id,
      resolvedAt: new Date(),
      document: insertResolution.document || null,
      success: insertResolution.success || null,
      error: insertResolution.error || null,
    };
    this.didResolutions.set(id, resolution);
    
    // Log the resolution
    await this.createSystemLog({
      level: resolution.success ? "SUCCESS" : "ERROR",
      message: resolution.success 
        ? `DID resolved: ${insertResolution.did}` 
        : `DID resolution failed: ${insertResolution.did}`,
      data: { resolutionId: id, error: insertResolution.error }
    });
    
    return resolution;
  }

  async getDidResolution(did: string): Promise<DidResolution | undefined> {
    return Array.from(this.didResolutions.values())
      .find(r => r.did === did);
  }

  async getAllDidResolutions(): Promise<DidResolution[]> {
    return Array.from(this.didResolutions.values()).sort((a, b) => 
      new Date(b.resolvedAt!).getTime() - new Date(a.resolvedAt!).getTime()
    );
  }

  async createSystemLog(insertLog: InsertSystemLog): Promise<SystemLog> {
    const id = randomUUID();
    const log: SystemLog = {
      ...insertLog,
      id,
      timestamp: new Date(),
      data: insertLog.data || null,
    };
    this.systemLogs.push(log);
    
    // Keep only last 1000 logs
    if (this.systemLogs.length > 1000) {
      this.systemLogs = this.systemLogs.slice(-1000);
    }
    
    return log;
  }

  async getSystemLogs(limit: number = 100): Promise<SystemLog[]> {
    return this.systemLogs
      .sort((a, b) => new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime())
      .slice(0, limit);
  }

  async clearSystemLogs(): Promise<void> {
    this.systemLogs = [];
  }
}

export const storage = new MemStorage();
