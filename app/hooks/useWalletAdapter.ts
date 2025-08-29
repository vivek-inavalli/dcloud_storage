"use client";

import { useWallet } from "@solana/wallet-adapter-react";

export function useWalletAdapter() {
  const wallet = useWallet();
  return wallet;
}
