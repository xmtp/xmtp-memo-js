import { utils } from "ethers";
import * as proto from "./proto/memo";

export enum SignatureType {
  ECDSACompact = 1,
  MOCK = 2,
}

export default class Signature implements proto.Signature {
  signature: Uint8Array;
  signatureType: SignatureType;

  constructor({ signature, signatureType }: proto.Signature) {
    this.signature = signature;
    this.signatureType = signatureType;
  }

  verify(addr: string, bytes: Uint8Array): boolean {
    const recovered_addr = utils.verifyMessage(bytes, this.signature);
    return addr === recovered_addr;
  }

  toBytes(): Uint8Array {
    return proto.Signature.encode(this).finish();
  }

  static fromBytes(bytes: Uint8Array): Signature {
    return new Signature(proto.Signature.decode(bytes));
  }
}
