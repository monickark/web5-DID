import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DIDDocumentViewerProps {
  document: any;
}

export function DIDDocumentViewer({ document }: DIDDocumentViewerProps) {
  const [isFormatted, setIsFormatted] = useState(true);
  const { toast } = useToast();

  const copyDocument = async () => {
    try {
      const docString = JSON.stringify(document, null, isFormatted ? 2 : 0);
      await navigator.clipboard.writeText(docString);
      toast({
        title: "Copied!",
        description: "DID document has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy DID document to clipboard",
        variant: "destructive",
      });
    }
  };

  const toggleFormat = () => {
    setIsFormatted(!isFormatted);
  };

  return (
    <Card className="p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">DID Document</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={copyDocument} title="Copy Document">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFormat} title="Toggle Format">
              <Code className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-100">
            <code>{JSON.stringify(document, null, isFormatted ? 2 : 0)}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
