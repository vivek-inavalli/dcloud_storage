'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { File, Download, Trash2, Share2, Eye, Clock, HardDrive } from 'lucide-react';
import { getProgram, getStorageAccountPDA, getFileAccountPDA } from '@/lib/anchor-setup';

interface FileData {
  hash: string;
  name: string;
  size: number;
  ipfsHash: string;
  uploadTimestamp: number;
  isPublic: boolean;
  accessCount: number;
}

interface FileListProps {
  refreshTrigger: number;
}

export default function FileList({ refreshTrigger }: FileListProps) {
  const { publicKey, wallet } = useWallet();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState<{
    totalFiles: number;
    totalStorageUsed: number;
  } | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const loadFiles = async () => {
    if (!publicKey || !wallet) return;

    setLoading(true);
    try {
      const program = getProgram(wallet.adapter as any);
      const [storageAccountPDA] = getStorageAccountPDA(publicKey);

      // Get storage info
      try {
        const storageInfo = await program.methods
          .getStorageInfo()
          .accounts({
            user: publicKey,
            storageAccount: storageAccountPDA,
          })
          .view();
        
        setStorageInfo({
          totalFiles: storageInfo.totalFiles,
          totalStorageUsed: Number(storageInfo.totalStorageUsed),
        });
      } catch (error) {
        console.log('Storage account not initialized yet');
      }

      // For demo purposes, we'll simulate some files since we can't easily query all file accounts
      // In a real implementation, you'd need to maintain an index or use getProgramAccounts
      setFiles([]);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileHash: string) => {
    if (!publicKey || !wallet) return;

    try {
      const program = getProgram(wallet.adapter as any);
      const [storageAccountPDA] = getStorageAccountPDA(publicKey);
      const [fileAccountPDA] = getFileAccountPDA(publicKey, fileHash);

      await program.methods
        .deleteFile()
        .accounts({
          user: publicKey,
          storageAccount: storageAccountPDA,
          fileAccount: fileAccountPDA,
        })
        .rpc();

      loadFiles();
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleShareFile = async (fileHash: string, isPublic: boolean) => {
    if (!publicKey || !wallet) return;

    try {
      const program = getProgram(wallet.adapter as any);
      const [fileAccountPDA] = getFileAccountPDA(publicKey, fileHash);

      await program.methods
        .shareFile(isPublic)
        .accounts({
          user: publicKey,
          fileAccount: fileAccountPDA,
        })
        .rpc();

      loadFiles();
    } catch (error) {
      console.error('Failed to update file sharing:', error);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [publicKey, wallet, refreshTrigger]);

  if (!publicKey) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <HardDrive className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Connect your wallet to view your files</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HardDrive className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Your Files</h2>
          </div>
          {storageInfo && (
            <div className="text-sm text-gray-600">
              {storageInfo.totalFiles} files • {formatFileSize(storageInfo.totalStorageUsed)} used
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No files uploaded yet</p>
            <p className="text-sm text-gray-500">Upload your first file to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.hash}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <File className="w-5 h-5 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(file.uploadTimestamp)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {file.accessCount} views
                      </div>
                      {file.isPublic && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShareFile(file.hash, !file.isPublic)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={file.isPublic ? 'Make private' : 'Make public'}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open(`https://ipfs.io/ipfs/${file.ipfsHash}`, '_blank')}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download from IPFS"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(file.hash)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}