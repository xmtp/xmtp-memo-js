import { PrivateKey } from "@xmtp/xmtp-js";
import { utils, Wallet } from "ethers";
import { AuthSig } from "./AuthSig";
import Signature, { SignatureType } from "./Signature";
import { hexToBytes } from "./utils";

export abstract class MsgSigner {
  abstract signBytes(bytes: Uint8Array): Promise<Signature>;
}

export class MockSigner implements MsgSigner {
  key: PrivateKey;
  constructor() {
    this.key = PrivateKey.generate();
  }

  async genAuthSig(bytes: Uint8Array): Promise<AuthSig> {
    const wallet = new Wallet(this.key.secp256k1.bytes);
    const signature = await wallet.signMessage(bytes);

    return {
      sig: signature,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: new TextDecoder().decode(bytes),
      address: await wallet.getAddress(),
    };
  }

  async signBytes(bytes: Uint8Array): Promise<Signature> {
    if (!this.key.secp256k1) {
      throw new Error("invalid key");
    }

    const authSign = await this.genAuthSig(bytes);

    return new Signature({
      signature: hexToBytes(authSign.sig),
      signatureType: SignatureType.ECDSACompact,
    });
  }

  async signString(msg: string): Promise<Signature> {
    return await this.signBytes(new TextEncoder().encode(msg));
  }

  async getAddress(): Promise<string> {
    return await new Wallet(this.key.secp256k1.bytes).getAddress();
  }
}
