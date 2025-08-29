"use client";

import { Header } from "@/components/layout/Header";
import { StorageStats } from "@/components/storage/StorageStats";
import { FileUpload } from "@/components/storage/FileUpload";
import { FileList } from "@/components/storage/FileList";
import { StorageInitializer } from "@/components/storage/StorageInitializer";
import { useWalletAdapter } from "@/hooks/useWalletAdapter";
import { useStorageProgram } from "@/hooks/useStorageProgram";
import { useToast } from "@/hooks/useToast";

export default function HomePage() {
  const wallet = useWalletAdapter();
  const storage = useStorageProgram();
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      await storage.uploadFile(file);
      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      toast.error("Failed to upload file");
    }
  };

  const handleFileDelete = async (fileId: string) => {
    try {
      await storage.deleteFile(fileId);
      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete file");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {!wallet.connected ? (
          <div className="text-center py-20">{/* Wallet connection UI */}</div>
        ) : !storage.isInitialized ? (
          <StorageInitializer onInitialize={storage.initializeStorage} />
        ) : (
          <>
            <StorageStats data={storage.storageInfo} />
            <FileUpload onUpload={handleFileUpload} />
            <FileList
              files={storage.files}
              onDelete={handleFileDelete}
              onDownload={storage.downloadFile}
              onShare={storage.shareFile}
            />
          </>
        )}
      </main>
    </div>
  );
}
