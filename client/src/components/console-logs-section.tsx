import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { web5Client } from "@/lib/web5-client";
import type { SystemLog } from "@/types/web5";

export function ConsoleLogsSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: logsResponse, isLoading } = useQuery({
    queryKey: ["/api/logs"],
    queryFn: () => web5Client.getSystemLogs(50),
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const clearLogsMutation = useMutation({
    mutationFn: () => web5Client.clearSystemLogs(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/logs"] });
      toast({
        title: "Logs Cleared",
        description: "All system logs have been cleared",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Clear Failed",
        description: error.message || "Failed to clear logs",
        variant: "destructive",
      });
    },
  });

  const downloadLogs = () => {
    if (!logsResponse?.data) return;

    const logsText = logsResponse.data
      .map((log: SystemLog) => 
        `[${new Date(log.timestamp).toISOString()}] ${log.level}: ${log.message}${log.data ? ` :: ${JSON.stringify(log.data)}` : ''}`
      )
      .join('\n');

    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `web5-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Logs have been downloaded successfully",
    });
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return 'text-green-400';
      case 'ERROR':
        return 'text-red-400';
      case 'DEBUG':
        return 'text-blue-400';
      case 'INFO':
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="mt-8 p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Console Logs</h3>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => clearLogsMutation.mutate()}
              disabled={clearLogsMutation.isPending}
              title="Clear Logs"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={downloadLogs} 
              title="Download Logs"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
          {isLoading ? (
            <div className="text-gray-400">Loading logs...</div>
          ) : !logsResponse?.data?.length ? (
            <div className="text-gray-400">No logs available</div>
          ) : (
            <div className="space-y-1">
              {logsResponse.data.map((log: SystemLog) => (
                <div key={log.id} className={getLogColor(log.level)}>
                  [{new Date(log.timestamp).toLocaleString()}] {log.level}: {log.message}
                  {log.data && (
                    <div className="text-gray-500 text-xs ml-4">
                      {JSON.stringify(log.data)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
