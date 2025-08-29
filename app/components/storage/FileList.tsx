"use client";

import { FileData } from "@/hooks/useStorageProgram";

interface FileListProps {
  files: FileData[];
  onDelete: (fileId: string) => Promise<void>;
  onDownload: (fileId: string) => Promise<void>;
  onShare: (fileId: string, isPublic: boolean) => Promise<void>;
}

export function FileList({
  files,
  onDelete,
  onDownload,
  onShare,
}: FileListProps) {
  if (!files.length) {
    return (
      <p className="text-center text-gray-500 mt-8">No files uploaded yet.</p>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100">
              {file.fileName}
            </p>
            <p className="text-sm text-gray-500">
              {Math.round(file.fileSize / 1024)} KB •{" "}
              {file.isPublic ? "Public" : "Private"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              onClick={() => onDownload(file.id)}
            >
              Download
            </button>
            <button
              className="px-3 py-1 text-sm border border-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onShare(file.id, !file.isPublic)}
            >
              {file.isPublic ? "Make Private" : "Share"}
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => onDelete(file.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
