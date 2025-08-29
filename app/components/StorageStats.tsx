'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { HardDrive, Files, Activity, Globe } from 'lucide-react';
import { getProgram, getStorageAccountPDA } from '@/lib/anchor-setup';

interface StorageStatsProps {
  refreshTrigger: number;
}

export default function StorageStats({ refreshTrigger }: StorageStatsProps) {
  const { publicKey, wallet } = useWallet();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalStorageUsed: 0,
    publicFiles: 0,
    totalAccess: 0,
  });
  const [loading, setLoading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const loadStats = async () => {
    if (!publicKey || !wallet) return;

    setLoading(true);
    try {
      const program = getProgram(wallet.adapter as any);
      const [storageAccountPDA] = getStorageAccountPDA(publicKey);

      const storageInfo = await program.methods
        .getStorageInfo()
        .accounts({
          user: publicKey,
          storageAccount: storageAccountPDA,
        })
        .view();

      setStats({
        totalFiles: storageInfo.totalFiles,
        totalStorageUsed: Number(storageInfo.totalStorageUsed),
        publicFiles: 0, // Would need to query individual files
        totalAccess: 0, // Would need to aggregate from individual files
      });
    } catch (error) {
      console.log('Storage account not initialized yet');
      setStats({
        totalFiles: 0,
        totalStorageUsed: 0,
        publicFiles: 0,
        totalAccess: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [publicKey, wallet, refreshTrigger]);

  if (!publicKey) {
    return null;
  }

  const statCards = [
    {
      icon: Files,
      label: 'Total Files',
      value: stats.totalFiles.toString(),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: HardDrive,
      label: 'Storage Used',
      value: formatFileSize(stats.totalStorageUsed),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Globe,
      label: 'Public Files',
      value: stats.publicFiles.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Activity,
      label: 'Total Access',
      value: stats.totalAccess.toString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stat.value}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}