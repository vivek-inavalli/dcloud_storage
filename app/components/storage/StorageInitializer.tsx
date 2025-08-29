"use client";

interface StorageInitializerProps {
  onInitialize: () => Promise<void>;
}

export function StorageInitializer({ onInitialize }: StorageInitializerProps) {
  return (
    <div className="text-center py-20">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Initialize Your Storage
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        You need to initialize your storage account before uploading files.
      </p>
      <button onClick={onInitialize}>Initialize Storage</button>
    </div>
  );
}
