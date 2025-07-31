import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { web5Client } from "@/lib/web5-client";

export function SystemStatusCard() {
  const { data: systemStatus, isLoading } = useQuery({
    queryKey: ["/api/status"],
    queryFn: () => web5Client.getSystemStatus(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <CardContent className="p-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status</h3>
          <div className="text-center text-gray-500 py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const status = systemStatus?.data;

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Web5 SDK</span>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${status?.web5Connected ? "bg-success" : "bg-error"}`}></span>
              <span className="text-sm text-gray-900">{status?.web5Connected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">DWN Node</span>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${status?.dwnOnline ? "bg-success" : "bg-error"}`}></span>
              <span className="text-sm text-gray-900">{status?.dwnOnline ? "Online" : "Offline"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sync Service</span>
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${status?.syncActive ? "bg-success" : "bg-warning"}`}></span>
              <span className="text-sm text-gray-900">{status?.syncActive ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total DIDs</span>
            <span className="text-sm text-gray-900">{status?.totalDids || 0}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Node.js Version</span>
            <span className="text-sm text-gray-900">{status?.nodeVersion || "Unknown"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">@web5/api Version</span>
            <span className="text-sm text-gray-900">{status?.web5Version || "Unknown"}</span>
          </div>

          {status?.lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Sync</span>
              <span className="text-sm text-gray-900">
                {new Date(status.lastSync).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
