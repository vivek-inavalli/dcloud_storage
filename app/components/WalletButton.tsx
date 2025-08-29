'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function WalletButton() {
  return (
    <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !rounded-lg !font-medium !transition-colors" />
  );
}