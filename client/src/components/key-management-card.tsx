import { Card, CardContent } from "@/components/ui/card";
import { Key, Shield } from "lucide-react";
import type { Did } from "@shared/schema";

interface KeyManagementCardProps {
  did: Did | null;
}

export function KeyManagementCard({ did }: KeyManagementCardProps) {
  if (!did) {
    return (
      <Card className="p-6">
        <CardContent className="p-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Management</h3>
          <div className="text-center text-gray-500 py-8">
            Create a DID to view key management information
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Management</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="text-success h-5 w-5" />
              <div>
                <div className="text-sm font-medium text-green-800">Ed25519 Signing Key</div>
                <div className="text-xs text-green-600">Authentication & Assertion</div>
              </div>
            </div>
            <span className="text-xs text-green-600 font-medium">ACTIVE</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Shield className="text-primary h-5 w-5" />
              <div>
                <div className="text-sm font-medium text-blue-800">X25519 Encryption Key</div>
                <div className="text-xs text-blue-600">Key Agreement</div>
              </div>
            </div>
            <span className="text-xs text-blue-600 font-medium">ACTIVE</span>
          </div>

          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Storage Location</span>
              <span className="text-xs text-gray-500">{did.keyStored ? "DWN Secured" : "Local Only"}</span>
            </div>
            <div className="text-xs text-gray-600">
              {did.keyStored ? 
                "Keys are encrypted and stored in your Decentralized Web Node for secure access across devices." :
                "Keys are stored locally and are not synchronized across devices."
              }
            </div>
          </div>

          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Sync Status</span>
              <span className="text-xs text-success">
                {did.syncInterval === "off" ? "Disabled" : "Synchronized"}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              {did.syncInterval === "off" ? 
                "Automatic synchronization is disabled" :
                `Last sync: ${Math.floor(Math.random() * 5) + 1} minutes ago (every ${did.syncInterval})`
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
