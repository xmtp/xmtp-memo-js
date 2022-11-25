import { PublicKey, Signature, SignedPublicKey } from "@xmtp/xmtp-js";

type SupportedKey = PublicKey | SignedPublicKey;

export class SignerKey {
  key: SupportedKey;
  constructor(key: SupportedKey) {
    this.key = key;
  }

  async getAddress(): Promise<string> {
    return this.key.walletSignatureAddress();
  }

  verify(signature: Signature, bytes: Uint8Array): boolean {
    return this.key.verify(signature, bytes);
  }

  toBytes(): Uint8Array {
    return this.key.toBytes();
  }

  static fromBytes(bytes: Uint8Array): SignerKey {
    let k: SupportedKey;

    try {
      let k = SignedPublicKey.fromBytes(bytes);
      return new SignerKey(k);
    } catch (e) {
      if (!(e instanceof RangeError)) {
        throw e;
      }
    }

    try {
      let k = PublicKey.fromBytes(bytes);
      return new SignerKey(k);
    } catch (e) {
      if (!(e instanceof RangeError)) {
        throw e;
      }
    }

    throw new Error("Cannot created SignerKey from bytes");
  }
}
