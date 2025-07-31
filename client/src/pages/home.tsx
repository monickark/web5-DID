import { Fingerprint, Github } from "lucide-react";
import { DIDCreationCard } from "@/components/did-creation-card";
import { DIDDisplayCard } from "@/components/did-display-card";
import { DIDDocumentViewer } from "@/components/did-document-viewer";
import { DIDResolverCard } from "@/components/did-resolver-card";
import { KeyManagementCard } from "@/components/key-management-card";
import { SystemStatusCard } from "@/components/system-status-card";
import { ConsoleLogsSection } from "@/components/console-logs-section";
import { useState } from "react";
import type { Did } from "@shared/schema";

export default function Home() {
  const [createdDid, setCreatedDid] = useState<Did | null>(null);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Fingerprint className="text-white w-4 h-4" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Web5 DID Creator</h1>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">v2025.1</span>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="https://developer.tbd.website/docs/web5/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Documentation</a>
              <a href="https://developer.tbd.website/api/web5-js/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 text-sm font-medium">API Reference</a>
              <a href="https://github.com/TBD54566975/web5-js" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <Github className="w-5 h-5" />
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Decentralized Identity Management</h2>
          <p className="text-lg text-gray-600">Create, manage, and resolve Decentralized Identifiers (DIDs) using the Web5 platform</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: DID Creation */}
          <div className="lg:col-span-2 space-y-6">
            <DIDCreationCard onDidCreated={setCreatedDid} />
            {createdDid && <DIDDisplayCard did={createdDid} />}
            {createdDid && <DIDDocumentViewer document={createdDid.document} />}
          </div>

          {/* Right Column: Tools and Information */}
          <div className="space-y-6">
            <DIDResolverCard />
            <KeyManagementCard did={createdDid} />
            <SystemStatusCard />
            
            {/* Resources Card */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Resources</h3>
              
              <div className="space-y-3">
                <a href="https://developer.tbd.website/docs/web5/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-book text-gray-500"></i>
                    <span className="text-sm font-medium text-gray-700">Web5 Documentation</span>
                  </div>
                  <i className="fas fa-external-link-alt text-gray-400 text-xs"></i>
                </a>

                <a href="https://developer.tbd.website/api/web5-js/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-code text-gray-500"></i>
                    <span className="text-sm font-medium text-gray-700">API Reference</span>
                  </div>
                  <i className="fas fa-external-link-alt text-gray-400 text-xs"></i>
                </a>

                <a href="https://github.com/TBD54566975/web5-js" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Github className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">GitHub Repository</span>
                  </div>
                  <i className="fas fa-external-link-alt text-gray-400 text-xs"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <ConsoleLogsSection />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">About Web5</h4>
              <p className="text-sm text-gray-600 mb-4">Web5 brings decentralized identity and data storage to your applications, enabling truly self-sovereign experiences.</p>
              <div className="text-xs text-gray-500">Tech Preview • TBD54566975</div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">API Endpoints</h4>
              <div className="space-y-2 text-sm text-gray-600 font-mono">
                <div>POST /api/did/create</div>
                <div>GET /api/did/:id</div>
                <div>POST /api/did/resolve</div>
                <div>GET /api/status</div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Development</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Node.js 18+ Required</div>
                <div>ES Modules Support</div>
                <div>Crypto Polyfill Included</div>
                <div>RESTful API Design</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
