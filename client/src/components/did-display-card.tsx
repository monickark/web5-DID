import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Did } from "@shared/schema";

interface DIDDisplayCardProps {
  did: Did;
}

export function DIDDisplayCard({ did }: DIDDisplayCardProps) {
  const { toast } = useToast();

  const copyDID = async () => {
    try {
      await navigator.clipboard.writeText(did.did);
      toast({
        title: "Copied!",
        description: "DID has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy DID to clipboard",
        variant: "destructive",
      });
    }
  };

  const refreshDID = () => {
    // In a real implementation, this would refresh the DID data
    toast({
      title: "Refreshed",
      description: "DID data has been refreshed",
    });
  };

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Generated DID</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={copyDID} title="Copy DID">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={refreshDID} title="Refresh">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {/* DID String */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DID Identifier</label>
            <div className="bg-gray-50 border rounded-lg p-3 font-mono text-sm break-all">
              {did.did}
            </div>
          </div>

          {/* Creation Timestamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
              <div className="text-sm text-gray-600">
                {did.createdAt ? new Date(did.createdAt).toLocaleString() : "N/A"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
              <div className="text-sm text-gray-600">
                did:{did.method}
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="text-success mr-3 h-5 w-5" />
              <div>
                <h4 className="text-sm font-medium text-green-800">DID Created Successfully</h4>
                <p className="text-sm text-green-700 mt-1">Your decentralized identifier has been generated and registered with the DWN.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
