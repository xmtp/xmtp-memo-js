import { MemoSigner } from "./crypto/MemoSigner";
import * as proto from "./proto/memo";
import { MemoSignature } from "./crypto/MemoSignature";
import { Client, ContentTypeId, ContentTypeText } from "@xmtp/xmtp-js";
import { decodeContent } from "@xmtp/xmtp-js";

class AddressMismatchError extends Error {}
class NoSignerError extends Error {}
class SignatureMismatchError extends Error {}

export type ContentData = {
  content: any;
  contentType: ContentTypeId;
  error: Error | undefined;
};

// A Payload represents the portion of a memo which is protected by digital signature
export class PayloadV1 implements proto.PayloadV1 {
  fromAddr: string;
  toAddr: string;
  encodedContent: Uint8Array;
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
    encodedContent: Uint8Array,
    signer: MemoSigner
  ): Promise<MemoV1> {
    const payload = new PayloadV1({
      fromAddr,
      toAddr,
      encodedContent: encodedContent,
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
}

export class DecodedMemoV1 {
  fromAddr: string;
  toAddr: string;
  timestamp: number;

  content: any;
  contentType: ContentTypeId;
  error: Error | undefined;

  constructor(payload: PayloadV1, content: ContentData) {
    this.fromAddr = payload.fromAddr;
    this.toAddr = payload.toAddr;
    this.timestamp = payload.timestamp;

    this.content = content.content;
    this.contentType = content.contentType;
    this.error = content.error;
  }

  static async fromBytes(
    bytes: Uint8Array,
    xmtpClient: Client
  ): Promise<DecodedMemoV1> {
    const obj = proto.MemoV1.decode(bytes);
    const payload = PayloadV1.fromBytes(obj.encodedPayload);
    const memoSignature = MemoSignature.fromBytes(obj.signature);

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

    const content = decodeContent(payload.encodedContent, xmtpClient);
    return new DecodedMemoV1(payload, content);
  }
}
