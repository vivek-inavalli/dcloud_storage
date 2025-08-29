'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SystemProgram } from '@solana/web3.js';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getProgram, getStorageAccountPDA, getFileAccountPDA } from '@/lib/anchor-setup';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const { publicKey, wallet } = useWallet();
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const generateFileHash = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        resolve(hashHex);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const simulateIPFSUpload = async (file: File): Promise<string> => {
    // Simulate IPFS upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Return a mock IPFS hash
    return `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !publicKey || !wallet) return;

    setUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const program = getProgram(wallet.adapter as any);
      
      // Generate file hash
      const fileHash = await generateFileHash(file);
      
      // Simulate IPFS upload
      const ipfsHash = await simulateIPFSUpload(file);
      
      // Get PDAs
      const [storageAccountPDA] = getStorageAccountPDA(publicKey);
      const [fileAccountPDA] = getFileAccountPDA(publicKey, fileHash);

      // Try to initialize storage account first (in case it doesn't exist)
      try {
        await program.methods
          .initializeStorage()
          .accounts({
            user: publicKey,
            storageAccount: storageAccountPDA,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } catch (error) {
        // Storage account might already exist, continue
      }

      // Upload file
      await program.methods
        .uploadFile(
          fileHash,
          file.name,
          file.size,
          ipfsHash,
          null // No encryption for now
        )
        .accounts({
          user: publicKey,
          storageAccount: storageAccountPDA,
          fileAccount: fileAccountPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setUploadStatus('success');
      onUploadSuccess();
      
      // Reset form
      event.target.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Connect your wallet to upload files</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Upload File</h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {uploading && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Uploading to blockchain...</span>
          </div>
        )}

        {uploadStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">File uploaded successfully!</span>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Upload failed: {errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}