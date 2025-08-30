"use client";

import { useEffect, useState } from "react";
import { useWalletAdapter } from "@/hooks/useWalletAdapter";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function Header() {
  const { connected, publicKey } = useWalletAdapter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
                Decentralized Cloud Storage
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {mounted && connected && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>
                  {publicKey?.toString().slice(0, 4)}...
                  {publicKey?.toString().slice(-4)}
                </span>
              </div>
            )}
            {mounted ? (
              <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 text-white px-4 py-2 rounded-lg shadow" />
            ) : (
              <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
