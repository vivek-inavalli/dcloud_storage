"use client";

import { useState } from "react";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="my-6">
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition">
        <span className="text-gray-600 dark:text-gray-300 mb-2">
          {uploading ? "Uploading..." : "Click to upload a file"}
        </span>
        <button
          type="button"
          disabled={uploading}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            uploading
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {uploading ? "Uploading..." : "Select File"}
        </button>
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
