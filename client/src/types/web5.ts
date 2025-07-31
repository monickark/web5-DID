export interface DidCreationOptions {
  method: "auto" | "custom" | "community";
  didMethod: "dht" | "jwk" | "ion";
  syncInterval: "30s" | "2m" | "5m" | "off";
  keyStored: boolean;
  dwnEndpoints?: string[];
}

export interface DidDocument {
  "@context": string[];
  id: string;
  verificationMethod: VerificationMethod[];
  authentication: string[];
  assertionMethod: string[];
  keyAgreement: string[];
  capabilityInvocation: string[];
  capabilityDelegation: string[];
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk: {
    kty: string;
    crv: string;
    x: string;
  };
}

export interface SystemStatus {
  web5Connected: boolean;
  dwnOnline: boolean;
  syncActive: boolean;
  nodeVersion: string;
  web5Version: string;
  totalDids: number;
  lastSync: string;
}

export interface SystemLog {
  id: string;
  level: "INFO" | "DEBUG" | "SUCCESS" | "ERROR";
  message: string;
  timestamp: Date;
  data?: any;
}
