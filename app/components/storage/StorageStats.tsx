"use client";

interface StorageStatsProps {
  data: {
    owner: string;
    totalFiles: number;
    totalStorageUsed: number;
  };
}

export function StorageStats({ data }: StorageStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
      {/* Owner */}
      <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 text-sm mb-2">Owner</p>
        <p className="font-mono break-all text-gray-900 dark:text-gray-100 text-sm">
          {data.owner || "Not initialized"}
        </p>
      </div>

      {/* Total Files */}
      <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-500 text-sm mb-2">Total Files</p>
        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {data.totalFiles}
        </p>
      </div>

      {/* Storage Used */}
      <div className="p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-500 text-sm mb-2">Storage Used</p>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
          {(data.totalStorageUsed / 1024).toFixed(2)} KB
        </p>
      </div>
    </div>
  );
}
