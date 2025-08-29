// lib/ipfs/upload.ts

// Polyfill fetch for environments that don't have it (Node.js SSR)
import "isomorphic-fetch";
import { create } from "ipfs-http-client";

// ✅ Configure IPFS client (Infura endpoint)
const client = create({
  url: "https://ipfs.infura.io:5001/api/v0",
});

// ✅ Utility to upload a file to IPFS
export async function uploadToIPFS(file: File): Promise<string> {
  try {
    // Convert file to Buffer for IPFS
    const added = await client.add(await file.arrayBuffer());

    // Return Infura gateway link
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  } catch (err) {
    console.error("Error uploading file to IPFS:", err);
    throw err;
  }
}
