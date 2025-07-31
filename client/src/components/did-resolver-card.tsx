import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { web5Client } from "@/lib/web5-client";

export function DIDResolverCard() {
  const [resolveDid, setResolveDid] = useState("");
  const [resolutionResult, setResolutionResult] = useState<any>(null);
  const [resolutionStatus, setResolutionStatus] = useState("Enter a DID above to resolve its document");

  const { toast } = useToast();

  const resolveDidMutation = useMutation({
    mutationFn: async (did: string) => {
      return web5Client.resolveDid(did);
    },
    onSuccess: (response) => {
      if (response.success) {
        setResolutionResult(response.data.document);
        setResolutionStatus("DID resolved successfully");
        toast({
          title: "DID Resolved",
          description: `Successfully resolved DID: ${resolveDid}`,
        });
      } else {
        setResolutionResult(null);
        setResolutionStatus(`Resolution failed: ${response.error}`);
        toast({
          title: "Resolution Failed",
          description: response.error || "Failed to resolve DID",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      setResolutionResult(null);
      setResolutionStatus(`Resolution failed: ${error.message}`);
      toast({
        title: "Resolution Failed",
        description: error.message || "Failed to resolve DID",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveDid.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid DID",
        variant: "destructive",
      });
      return;
    }
    setResolutionStatus("Resolving DID...");
    resolveDidMutation.mutate(resolveDid.trim());
  };

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">DID Resolver</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="resolve-did" className="block text-sm font-medium text-gray-700 mb-2">DID to Resolve</Label>
            <div className="flex space-x-2">
              <Input
                type="text"
                id="resolve-did"
                value={resolveDid}
                onChange={(e) => setResolveDid(e.target.value)}
                className="flex-1"
                placeholder="did:dht:123..."
              />
              <Button 
                type="submit"
                size="sm"
                disabled={resolveDidMutation.isPending}
              >
                {resolveDidMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Resolve"
                )}
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            <div className="mb-2 font-medium">Examples:</div>
            <div className="space-y-1 font-mono">
              <div>did:dht:example123</div>
              <div>did:jwk:example456</div>
              <div>did:ion:example789</div>
            </div>
          </div>
        </form>

        {/* Resolution Results */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 text-center">
            {resolutionStatus}
          </div>
          {resolutionResult && (
            <div className="mt-4 bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-gray-100">
                <code>{JSON.stringify(resolutionResult, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
