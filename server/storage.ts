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

export class DatabaseStorage implements IStorage {
  async createDid(insertDid: InsertDid & { did: string; document: any }): Promise<Did> {
    const [result] = await db
      .insert(dids)
      .values({
        did: insertDid.did,
        method: insertDid.method,
        document: insertDid.document,
        keyStored: insertDid.keyStored || true,
        syncInterval: insertDid.syncInterval || null,
        dwnEndpoints: insertDid.dwnEndpoints || null,
      })
      .returning();

    // Log the creation
    await this.createSystemLog({
      level: "SUCCESS",
      message: `DID created: ${insertDid.did}`,
      data: { didId: result.id, method: insertDid.method }
    });

    return result;
  }

  async getDid(id: string): Promise<Did | undefined> {
    const [result] = await db.select().from(dids).where(eq(dids.id, id));
    return result || undefined;
  }

  async getDidByIdentifier(did: string): Promise<Did | undefined> {
    const [result] = await db.select().from(dids).where(eq(dids.did, did));
    return result || undefined;
  }

  async getAllDids(): Promise<Did[]> {
    return await db.select().from(dids).orderBy(desc(dids.createdAt));
  }

  async createDidResolution(insertResolution: InsertDidResolution & { document?: any; success: boolean; error?: string }): Promise<DidResolution> {
    const [result] = await db
      .insert(didResolutions)
      .values({
        did: insertResolution.did,
        document: insertResolution.document || null,
        success: insertResolution.success,
        error: insertResolution.error || null,
      })
      .returning();

    // Log the resolution
    await this.createSystemLog({
      level: result.success ? "SUCCESS" : "ERROR",
      message: result.success 
        ? `DID resolved: ${insertResolution.did}` 
        : `DID resolution failed: ${insertResolution.did}`,
      data: { resolutionId: result.id, error: insertResolution.error }
    });

    return result;
  }

  async getDidResolution(did: string): Promise<DidResolution | undefined> {
    const [result] = await db.select().from(didResolutions).where(eq(didResolutions.did, did));
    return result || undefined;
  }

  async getAllDidResolutions(): Promise<DidResolution[]> {
    return await db.select().from(didResolutions).orderBy(desc(didResolutions.resolvedAt));
  }

  async createSystemLog(insertLog: InsertSystemLog): Promise<SystemLog> {
    const [result] = await db
      .insert(systemLogs)
      .values({
        level: insertLog.level,
        message: insertLog.message,
        data: insertLog.data || null,
      })
      .returning();

    return result;
  }

  async getSystemLogs(limit: number = 100): Promise<SystemLog[]> {
    return await db.select().from(systemLogs).orderBy(desc(systemLogs.timestamp)).limit(limit);
  }

  async clearSystemLogs(): Promise<void> {
    await db.delete(systemLogs);
  }
}

export const storage = new DatabaseStorage();
