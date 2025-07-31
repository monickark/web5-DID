import { apiRequest } from "./queryClient";
import type { DidCreationOptions, DidDocument, SystemStatus, SystemLog } from "../types/web5";

export const web5Client = {
  async createDid(options: DidCreationOptions) {
    const response = await apiRequest("POST", "/api/did/create", options);
    return response.json();
  },

  async resolveDid(did: string) {
    const response = await apiRequest("POST", "/api/did/resolve", { did });
    return response.json();
  },

  async getDids() {
    const response = await apiRequest("GET", "/api/dids");
    return response.json();
  },

  async getDid(id: string) {
    const response = await apiRequest("GET", `/api/did/${id}`);
    return response.json();
  },

  async getSystemStatus(): Promise<{ success: boolean; data: SystemStatus }> {
    const response = await apiRequest("GET", "/api/status");
    return response.json();
  },

  async getSystemLogs(limit?: number): Promise<{ success: boolean; data: SystemLog[] }> {
    const url = limit ? `/api/logs?limit=${limit}` : "/api/logs";
    const response = await apiRequest("GET", url);
    return response.json();
  },

  async clearSystemLogs() {
    const response = await apiRequest("DELETE", "/api/logs");
    return response.json();
  }
};
