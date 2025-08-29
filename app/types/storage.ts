import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

export interface StorageAccount {
  owner: PublicKey;
  totalFiles: number;
  totalStorageUsed: BN;
  bump: number;
}

export interface FileAccount {
  owner: PublicKey;
  fileHash: string;
  fileName: string;
  fileSize: BN;
  ipfsHash: string;
  encryptionKey?: string;
  uploadTimestamp: BN;
  isPublic: boolean;
  accessCount: BN;
  bump: number;
}

export interface FileInfo {
  owner: PublicKey;
  fileHash: string;
  fileName: string;
  fileSize: BN;
  ipfsHash: string;
  uploadTimestamp: BN;
  isPublic: boolean;
  accessCount: BN;
}

export interface StorageInfo {
  owner: PublicKey;
  totalFiles: number;
  totalStorageUsed: BN;
}
