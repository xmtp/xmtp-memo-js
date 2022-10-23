import { EncryptedPackage } from "./Lit";
import { MemoV1 } from "./Memo";

const STORAGE_HOSTNAME = process.env.STORAGE_HOSTNAME ?? ""; // TODO: Replace once final domain name is created

export abstract class MemoStorage {
  abstract fetchMemos(addr: string): Promise<MemoV1[]>;

  abstract postMemo(
    addr: string,
    encryptedPackage: EncryptedPackage
  ): Promise<boolean>;
}

export class DemoMemoStorage implements MemoStorage {
  hostname;
  constructor(hostname?: string) {
    this.hostname = hostname ?? STORAGE_HOSTNAME;
  }

  async fetchMemos(recvAddr: string): Promise<MemoV1[]> {
    console.log("HOST:", `${this.hostname}/inbox/${recvAddr}`);
    const res = await fetch(`${this.hostname}/inbox/${recvAddr}`);
    return [];
  }

  async postMemo(
    addr: string,
    encryptedPackage: EncryptedPackage | Uint8Array
  ): Promise<boolean> {
    try {
      const resp = await fetch(`${this.hostname}/inbox/${addr}`, {
        method: "POST",
        body: JSON.stringify(encryptedPackage),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err);
      return false;
    }

    return true;
  }
}
