import "./globals.css";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DeCloud Storage - Decentralized File Storage",
  description:
    "Store your files securely on the Solana blockchain with IPFS integration",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <WalletProvider>
          {/* Toast container (raw element instead of ToastProvider) */}
          <div
            id="toast-root"
            className="fixed top-4 right-4 z-50 space-y-2"
          ></div>

          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
