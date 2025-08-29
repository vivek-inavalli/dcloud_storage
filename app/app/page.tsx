'use client';

import { useState } from 'react';
import { Cloud, Shield, Zap } from 'lucide-react';
import WalletButton from '@/components/WalletButton';
import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';
import StorageStats from '@/components/StorageStats';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DCloud Storage</h1>
                <p className="text-xs text-gray-600">Decentralized File Storage</p>
              </div>
            </div>
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Secure, Decentralized File Storage
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Store your files on the blockchain with IPFS integration. 
            Enjoy true ownership, encryption, and global accessibility.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your files are encrypted and stored securely on the blockchain</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Cloud className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Decentralized</h3>
              <p className="text-gray-600">No single point of failure with distributed IPFS storage</p>
            </div>
            
            <div className="text-center">
              <div className="p-4 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Access</h3>
              <p className="text-gray-600">Quick file retrieval with global CDN distribution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="space-y-8">
          {/* Storage Stats */}
          <StorageStats refreshTrigger={refreshTrigger} />

          {/* File Upload */}
          <FileUpload onUploadSuccess={handleUploadSuccess} />

          {/* File List */}
          <FileList refreshTrigger={refreshTrigger} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">DCloud Storage</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Built on Solana blockchain with IPFS integration
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span>Powered by Anchor Framework</span>
              <span>•</span>
              <span>Deployed on Devnet</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}