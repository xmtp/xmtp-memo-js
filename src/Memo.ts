import { MemoSigner } from "./MemoSigner";
import * as proto from "./proto/memo";
import SignatureObj from "./MemoSignature";

class AddressMismatchError extends Error {}
class NoSignerError extends Error {}
class SignatureMismatchError extends Error {}

export class PayloadV1 implements proto.PayloadV1 {
  fromAddr: string;
  toAddr: string;
  encodedContent: string;
  timestamp: number;

  constructor({
    fromAddr,
    toAddr,
    encodedContent,
    timestamp,
  }: proto.PayloadV1) {
    this.fromAddr = fromAddr;
    this.toAddr = toAddr;
    this.encodedContent = encodedContent;
    this.timestamp = timestamp;
  }

  toBytes(): Uint8Array {
    return proto.PayloadV1.encode(this).finish();
  }

  static fromBytes(bytes: Uint8Array): PayloadV1 {
    return new PayloadV1(proto.PayloadV1.decode(bytes));
  }
}

export class MemoV1 {
  payload: PayloadV1;
  signer?: MemoSigner;

  constructor(payload: PayloadV1, signFunc?: MemoSigner) {
    this.payload = payload;
    this.signer = signFunc;
  }

  static async create(
    toAddr: string,
    fromAddr: string,
    content: string,
    signer: MemoSigner
  ): Promise<MemoV1> {
    const payload = new PayloadV1({
      fromAddr,
      toAddr,
      encodedContent: content,
      timestamp: new Date().getTime(),
    });

    return new MemoV1(payload, signer);
  }

  async toBytes(): Promise<Uint8Array> {
    const encodedPayload = this.payload.toBytes();

    if (!this.signer) {
      throw new NoSignerError();
    }

    const sigObj = await this.signer.signBytes(encodedPayload);
    const encodedSignature = sigObj.toBytes();

    return proto.MemoV1.encode({
      encodedPayload: encodedPayload,
      signature: encodedSignature,
    }).finish();
  }

  static async fromBytes(bytes: Uint8Array): Promise<MemoV1> {
    const obj = proto.MemoV1.decode(bytes);
    const payload = PayloadV1.fromBytes(obj.encodedPayload);
    const memoSignature = SignatureObj.fromBytes(obj.signature);

    // Ensure Memo is valid prior to instantiating it
    if (!memoSignature.verify(obj.encodedPayload)) {
      throw new SignatureMismatchError();
    }

    // Ensure addesses are correct
    const signingAddress = await memoSignature.signingKey.getAddress();
    if (signingAddress !== payload.fromAddr) {
      throw new AddressMismatchError(
        `Sign:${signingAddress} Stated:${payload.fromAddr}`
      );
    }

    return new MemoV1(payload);
  }
}
