import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { DcloudStorage } from './types/dcloud_storage';
import idl from './idl/dcloud_storage.json';

const PROGRAM_ID = new PublicKey('2DWNrUtJXqnA9qu444yyACg2VXnXmEqwBPG7Q7cgM1NM');
const NETWORK = 'https://api.devnet.solana.com';

export function getProgram(wallet: AnchorWallet) {
  const connection = new Connection(NETWORK, 'confirmed');
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  });
  
  return new Program(idl as any, PROGRAM_ID, provider) as Program<DcloudStorage>;
}

export function getStorageAccountPDA(userPublicKey: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('storage'), userPublicKey.toBuffer()],
    PROGRAM_ID
  );
}

export function getFileAccountPDA(userPublicKey: PublicKey, fileHash: string) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('file'), userPublicKey.toBuffer(), Buffer.from(fileHash)],
    PROGRAM_ID
  );
}