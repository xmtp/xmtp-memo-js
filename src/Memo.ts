import { MockSigner, MsgSigner } from "./MsgSigner";
import * as proto from "./proto/memo";
import Signature from "./Signature";

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
  signer?: MsgSigner;

  constructor(payload: PayloadV1, signFunc?: MsgSigner) {
    this.payload = payload;
    this.signer = signFunc;
  }

  static async create(
    toAddr: string,
    fromAddr: string,
    content: string,
    signer: MsgSigner
  ): Promise<MemoV1> {
    const payload = new PayloadV1({
      fromAddr,
      toAddr,
      encodedContent: content,
      timestamp: new Date().getTime(),
    });

    return new MemoV1(payload, signer);
  }

  async toBytes(): Promise<Uint8Array | undefined> {
    const encodedPayload = this.payload.toBytes();

    if (!this.signer) {
      return undefined;
    }

    const signature = await this.signer.signBytes(encodedPayload);
    const encodedSignature = signature.toBytes();

    return proto.MemoV1.encode({
      encodedPayload: encodedPayload,
      signature: encodedSignature,
    }).finish();
  }

  static async fromBytes(bytes: Uint8Array): Promise<MemoV1 | undefined> {
    const obj = proto.MemoV1.decode(bytes);
    const payload = PayloadV1.fromBytes(obj.encodedPayload);
    const signature = Signature.fromBytes(obj.signature);

    if (!signature.verify(payload.fromAddr, obj.encodedPayload)) {
      console.log("BAD VERIT");
      return undefined;
    }
    return new MemoV1(payload);
  }
}
