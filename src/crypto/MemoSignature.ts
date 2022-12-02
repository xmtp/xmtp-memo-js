import { Signature } from "@xmtp/xmtp-js";

import * as proto from "../proto/memo";
import { SignerKey } from "./SignerKey";

export enum SignatureType {
  ECDSACompact = 1,
}

export class MemoSignature {
  signature: Signature;
  signatureType: SignatureType;
  signingKey: SignerKey;

  constructor(
    signature: Signature,
    signatureType: SignatureType,
    signingKey: SignerKey
  ) {
    this.signature = signature;
    this.signatureType = signatureType;
    this.signingKey = signingKey;
  }

  verify(bytes: Uint8Array): boolean {
    const isVerified = this.signingKey.verify(this.signature, bytes);
    return isVerified;
  }

  toBytes(): Uint8Array {
    return proto.MemoSignature.encode({
      signature: this.signature.toBytes(),
      signatureType: this.signatureType,
      signingKey: this.signingKey.toBytes(),
    }).finish();
  }

  static fromBytes(bytes: Uint8Array): MemoSignature {
    const c = proto.MemoSignature.decode(bytes);
    const signature = Signature.fromBytes(c.signature);
    const signerKey = SignerKey.fromBytes(c.signingKey);

    return new MemoSignature(signature, c.signatureType, signerKey);
  }
}
