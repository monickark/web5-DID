import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, RotateCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { web5Client } from "@/lib/web5-client";
import type { DidCreationOptions } from "@/types/web5";
import type { Did } from "@shared/schema";

interface DIDCreationCardProps {
  onDidCreated: (did: Did) => void;
}

export function DIDCreationCard({ onDidCreated }: DIDCreationCardProps) {
  const [connectionMethod, setConnectionMethod] = useState<"auto" | "custom" | "community">("auto");
  const [didMethod, setDidMethod] = useState<"dht" | "jwk" | "ion">("dht");
  const [syncInterval, setSyncInterval] = useState<"30s" | "2m" | "5m" | "off">("2m");
  const [keyStored, setKeyStored] = useState(true);
  const [dwnEndpoints, setDwnEndpoints] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("Web5 Connected");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDidMutation = useMutation({
    mutationFn: async (options: DidCreationOptions) => {
      return web5Client.createDid(options);
    },
    onSuccess: (response) => {
      if (response.success) {
        onDidCreated(response.data.did);
        setConnectionStatus("Web5 Connected");
        toast({
          title: "DID Created Successfully",
          description: `Your decentralized identifier has been generated: ${response.data.did.did}`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/logs"] });
      } else {
        toast({
          title: "DID Creation Failed",
          description: response.error || "An error occurred while creating the DID",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "DID Creation Failed",
        description: error.message || "An error occurred while creating the DID",
        variant: "destructive",
      });
      setConnectionStatus("Connection Error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const options: DidCreationOptions = {
      method: connectionMethod,
      didMethod,
      syncInterval,
      keyStored,
    };

    if (connectionMethod === "custom" && dwnEndpoints.trim()) {
      const endpoints = dwnEndpoints
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);
      options.dwnEndpoints = endpoints;
    }

    createDidMutation.mutate(options);
  };

  const resetForm = () => {
    setConnectionMethod("auto");
    setDidMethod("dht");
    setSyncInterval("2m");
    setKeyStored(true);
    setDwnEndpoints("");
  };

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New DID</h3>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${connectionStatus === "Web5 Connected" ? "bg-success" : "bg-error"}`}></span>
            <span className="text-sm text-gray-600">{connectionStatus}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-3">Connection Method</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="relative">
                <input 
                  type="radio" 
                  name="method" 
                  value="auto" 
                  checked={connectionMethod === "auto"}
                  onChange={(e) => setConnectionMethod(e.target.value as "auto")}
                  className="sr-only peer"
                />
                <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer peer-checked:border-primary peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                  <div className="text-sm font-medium text-gray-900">Web5.connect()</div>
                  <div className="text-xs text-gray-500 mt-1">Automatic setup</div>
                </div>
              </label>
              <label className="relative">
                <input 
                  type="radio" 
                  name="method" 
                  value="custom" 
                  checked={connectionMethod === "custom"}
                  onChange={(e) => setConnectionMethod(e.target.value as "custom")}
                  className="sr-only peer"
                />
                <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer peer-checked:border-primary peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                  <div className="text-sm font-medium text-gray-900">Custom DWN</div>
                  <div className="text-xs text-gray-500 mt-1">Specify endpoints</div>
                </div>
              </label>
              <label className="relative">
                <input 
                  type="radio" 
                  name="method" 
                  value="community" 
                  checked={connectionMethod === "community"}
                  onChange={(e) => setConnectionMethod(e.target.value as "community")}
                  className="sr-only peer"
                />
                <div className="border-2 border-gray-200 rounded-lg p-4 cursor-pointer peer-checked:border-primary peer-checked:bg-blue-50 hover:border-gray-300 transition-colors">
                  <div className="text-sm font-medium text-gray-900">Community DWN</div>
                  <div className="text-xs text-gray-500 mt-1">gcda.xyz instance</div>
                </div>
              </label>
            </div>
          </div>

          {connectionMethod === "custom" && (
            <div>
              <Label htmlFor="dwn-endpoints" className="block text-sm font-medium text-gray-700 mb-2">DWN Endpoints</Label>
              <Textarea
                id="dwn-endpoints"
                rows={3}
                value={dwnEndpoints}
                onChange={(e) => setDwnEndpoints(e.target.value)}
                className="w-full"
                placeholder="https://dwn.your-domain.org/&#10;https://backup-dwn.your-domain.org/"
              />
              <p className="text-xs text-gray-500 mt-1">Enter one endpoint per line</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="did-method" className="block text-sm font-medium text-gray-700 mb-2">DID Method</Label>
              <Select value={didMethod} onValueChange={(value: "dht" | "jwk" | "ion") => setDidMethod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dht">did:dht (Recommended)</SelectItem>
                  <SelectItem value="jwk">did:jwk</SelectItem>
                  <SelectItem value="ion">did:ion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sync-interval" className="block text-sm font-medium text-gray-700 mb-2">Sync Interval</Label>
              <Select value={syncInterval} onValueChange={(value: "30s" | "2m" | "5m" | "off") => setSyncInterval(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2m">2 minutes (default)</SelectItem>
                  <SelectItem value="30s">30 seconds</SelectItem>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="off">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Checkbox 
              id="store-keys" 
              checked={keyStored}
              onCheckedChange={(checked) => setKeyStored(checked as boolean)}
            />
            <Label htmlFor="store-keys" className="text-sm text-gray-700">Store cryptographic keys in DWeb Node</Label>
          </div>

          <div className="flex space-x-3">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={createDidMutation.isPending}
            >
              {createDidMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="mr-2 h-4 w-4" />
              )}
              {createDidMutation.isPending ? "Creating DID..." : "Create DID"}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={resetForm}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
