"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow-md bg-white dark:bg-gray-900">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Decentralized Cloud Storage
      </h1>
      <WalletMultiButton className="!bg-indigo-600 hover:!bg-indigo-700 text-white px-4 py-2 rounded-lg shadow" />
    </header>
  );
}
