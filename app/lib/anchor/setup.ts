import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "@/lib/idl.json";

const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);

export function getProgram(connection: Connection, wallet: AnchorWallet) {
  if (!wallet) {
    throw new Error("Wallet not connected");
  }

  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  return new Program(idl as Idl, PROGRAM_ID, provider);
}

export function getStorageAccountPDA(userPublicKey: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("storage"), userPublicKey.toBuffer()],
    PROGRAM_ID
  );
}

export function getFileAccountPDA(userPublicKey: PublicKey, fileHash: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("file"), userPublicKey.toBuffer(), Buffer.from(fileHash)],
    PROGRAM_ID
  );
}
