import { useState, useEffect, useCallback } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, Idl, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { uploadToIPFS } from "@/lib/ipfs/upload";
import idl from "@/lib/idl.json";

// ✅ Safer PROGRAM_ID initialization
const programIdString = process.env.NEXT_PUBLIC_PROGRAM_ID;
if (!programIdString) {
  throw new Error("❌ NEXT_PUBLIC_PROGRAM_ID is not set in environment");
}
const PROGRAM_ID = new PublicKey(programIdString);

export interface FileData {
  id: string;
  fileHash: string;
  fileName: string;
  fileSize: number;
  ipfsHash: string;
  uploadTimestamp: number;
  isPublic: boolean;
  accessCount: number;
  owner: string;
}

export interface StorageInfo {
  owner: string;
  totalFiles: number;
  totalStorageUsed: number;
}

export const useStorageProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Program | null>(null);
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    owner: "",
    totalFiles: 0,
    totalStorageUsed: 0,
  });
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize program when wallet connects
  useEffect(() => {
    if (wallet && connection) {
      const provider = new AnchorProvider(
        connection,
        wallet,
        AnchorProvider.defaultOptions()
      );
      const programInstance = new Program(idl as Idl, PROGRAM_ID, provider);
      setProgram(programInstance);
    } else {
      setProgram(null);
    }
  }, [wallet, connection]);

  // Get storage account PDA
  const getStorageAccountPDA = useCallback(async () => {
    if (!wallet?.publicKey) throw new Error("Wallet not connected");

    const [storageAccount] = await PublicKey.findProgramAddress(
      [Buffer.from("storage"), wallet.publicKey.toBuffer()],
      PROGRAM_ID
    );
    return storageAccount;
  }, [wallet?.publicKey]);

  // Get file account PDA
  const getFileAccountPDA = useCallback(
    async (fileHash: string) => {
      if (!wallet?.publicKey) throw new Error("Wallet not connected");

      const [fileAccount] = await PublicKey.findProgramAddress(
        [
          Buffer.from("file"),
          wallet.publicKey.toBuffer(),
          Buffer.from(fileHash),
        ],
        PROGRAM_ID
      );
      return fileAccount;
    },
    [wallet?.publicKey]
  );

  // Initialize storage account
  const initializeStorage = async () => {
    if (!program || !wallet) throw new Error("Program or wallet not available");

    setLoading(true);
    try {
      const storageAccount = await getStorageAccountPDA();

      const tx = await program.methods
        .initializeStorage()
        .accounts({
          user: wallet.publicKey,
          storageAccount,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Storage initialized:", tx);
      setIsInitialized(true);
      await loadStorageInfo();
    } catch (error) {
      console.error("❌ Initialize storage error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Upload file
  const uploadFile = async (file: File) => {
    if (!program || !wallet) throw new Error("Program or wallet not available");

    setLoading(true);
    try {
      const ipfsHash = await uploadToIPFS(file);
      const fileHash = Math.random().toString(36).substring(7); // TODO: replace with real hash

      const storageAccount = await getStorageAccountPDA();
      const fileAccount = await getFileAccountPDA(fileHash);

      const tx = await program.methods
        .uploadFile(
          fileHash,
          file.name,
          new BN(file.size), // ✅ fixed BN import
          ipfsHash,
          null // encryption_key
        )
        .accounts({
          user: wallet.publicKey,
          storageAccount,
          fileAccount,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("✅ File uploaded:", tx);
      await loadFiles();
      await loadStorageInfo();
    } catch (error) {
      console.error("❌ Upload file error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load storage info
  const loadStorageInfo = async () => {
    if (!program || !wallet) return;

    try {
      const storageAccount = await getStorageAccountPDA();
      const accountInfo = await program.account.storageAccount.fetch(
        storageAccount
      );

      setStorageInfo({
        owner: accountInfo.owner.toString(),
        totalFiles: accountInfo.totalFiles,
        totalStorageUsed: accountInfo.totalStorageUsed.toNumber(),
      });
    } catch (error) {
      console.error("❌ Load storage info error:", error);
    }
  };

  // Load files
  const loadFiles = async () => {
    if (!program || !wallet) return;

    try {
      const fileAccounts = await program.account.fileAccount.all([
        {
          memcmp: {
            offset: 8, // discriminator
            bytes: wallet.publicKey.toBase58(),
          },
        },
      ]);

      const filesData: FileData[] = fileAccounts.map((account) => ({
        id: account.publicKey.toString(),
        fileHash: account.account.fileHash,
        fileName: account.account.fileName,
        fileSize: account.account.fileSize.toNumber(),
        ipfsHash: account.account.ipfsHash,
        uploadTimestamp: account.account.uploadTimestamp.toNumber() * 1000,
        isPublic: account.account.isPublic,
        accessCount: account.account.accessCount.toNumber(),
        owner: account.account.owner.toString(),
      }));

      setFiles(filesData);
    } catch (error) {
      console.error("❌ Load files error:", error);
    }
  };

  // Download file
  const downloadFile = async (fileId: string) => {
    if (!program || !wallet) throw new Error("Program or wallet not available");

    try {
      const fileAccount = new PublicKey(fileId);

      const result = await program.methods
        .downloadFile("")
        .accounts({
          user: wallet.publicKey,
          fileAccount,
        })
        .view();

      console.log("✅ File info:", result);
      await loadFiles(); // refresh access count
    } catch (error) {
      console.error("❌ Download file error:", error);
      throw error;
    }
  };

  // Delete file
  const deleteFile = async (fileId: string) => {
    if (!program || !wallet) throw new Error("Program or wallet not available");

    setLoading(true);
    try {
      const storageAccount = await getStorageAccountPDA();
      const fileAccount = new PublicKey(fileId);

      const tx = await program.methods
        .deleteFile()
        .accounts({
          user: wallet.publicKey,
          storageAccount,
          fileAccount,
        })
        .rpc();

      console.log("✅ File deleted:", tx);
      await loadFiles();
      await loadStorageInfo();
    } catch (error) {
      console.error("❌ Delete file error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Share file
  const shareFile = async (fileId: string, isPublic: boolean) => {
    if (!program || !wallet) throw new Error("Program or wallet not available");

    setLoading(true);
    try {
      const fileAccount = new PublicKey(fileId);

      const tx = await program.methods
        .shareFile(isPublic)
        .accounts({
          user: wallet.publicKey,
          fileAccount,
        })
        .rpc();

      console.log("✅ File shared:", tx);
      await loadFiles();
    } catch (error) {
      console.error("❌ Share file error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if storage is initialized
  useEffect(() => {
    if (wallet && program) {
      loadStorageInfo().then(() => {
        if (storageInfo.owner) {
          setIsInitialized(true);
          loadFiles();
        }
      });
    }
  }, [wallet, program]);

  return {
    storageInfo,
    files,
    loading,
    isInitialized,
    initializeStorage,
    uploadFile,
    downloadFile,
    deleteFile,
    shareFile,
    loadFiles,
    loadStorageInfo,
  };
};
