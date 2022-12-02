import { Client } from "@xmtp/xmtp-js";

import { MemoSignature, SignatureType } from "./MemoSignature";
import { SignerKey } from "./SignerKey";

export abstract class MemoSigner {
  abstract signBytes(bytes: Uint8Array): Promise<MemoSignature>;
}

export class ClientSigner implements MemoSigner {
  client: Client;
  signerKey: SignerKey;

  constructor(client: Client, signerKey: SignerKey) {
    this.client = client;
    this.signerKey = signerKey;
  }

  static async create(client: Client) {
    const bundle = client.keys.getPublicKeyBundle();
    if (!bundle) {
      throw new Error("no contact for signer");
    }

    return new ClientSigner(client, new SignerKey(bundle.identityKey));
  }

  async signBytes(bytes: Uint8Array): Promise<MemoSignature> {
    const signature = await this.client.signBytes(bytes);

    return new MemoSignature(
      signature,
      SignatureType.ECDSACompact,
      this.signerKey
    );
  }
}
