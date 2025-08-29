import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);
export const STORAGE_SEED = "storage";
export const FILE_SEED = "file";

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FILE_NAME_LENGTH = 100;
export const MAX_FILE_HASH_LENGTH = 64;
export const MAX_IPFS_HASH_LENGTH = 100;

export const SUPPORTED_FILE_TYPES = [
  "image/*",
  "application/pdf",
  "text/*",
  "application/json",
  "application/zip",
];

export const RPC_ENDPOINTS = {
  mainnet: "https://api.mainnet-beta.solana.com",
  devnet: "https://api.devnet.solana.com",
  testnet: "https://api.testnet.solana.com",
  localhost: "http://localhost:8899",
};
