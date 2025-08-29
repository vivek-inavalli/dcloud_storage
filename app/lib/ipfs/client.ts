export class IPFSClient {
  private apiKey: string;
  private secretKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY!;
    this.secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!;
  }

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
      },
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload to IPFS");
    }

    const result = await response.json();
    return result.IpfsHash;
  }

  getFileUrl(ipfsHash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  }
}
