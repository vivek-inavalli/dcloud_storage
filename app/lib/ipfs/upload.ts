import { create } from "ipfs-http-client";

const client = create({
  url: "https://ipfs.infura.io:5001/api/v0",
});

export async function uploadToIPFS(file: File): Promise<string> {
  const added = await client.add(await file.arrayBuffer());
  return `https://ipfs.infura.io/ipfs/${added.path}`;
}
