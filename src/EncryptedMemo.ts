import * as proto from "./proto/memo";

export class InvalidVersionError extends Error {}

export type EncryptedMemo = EncryptedMemoV1;
export type EncodedEncryptedMemo = Uint8Array;

export class EncryptedMemoV1 implements proto.EncryptedMemoV1 {
  encryptedString: Uint8Array;
  encryptedSymmetricKey: Uint8Array;
  accTemplate: Uint8Array;

  constructor({
    encryptedString,
    encryptedSymmetricKey,
    accTemplate,
  }: proto.EncryptedMemoV1) {
    this.encryptedString = new Uint8Array(Buffer.from(encryptedString));
    this.encryptedSymmetricKey = new Uint8Array(
      Buffer.from(encryptedSymmetricKey)
    );
    this.accTemplate = new Uint8Array(Buffer.from(accTemplate));
  }

  static create(
    encryptedString: Uint8Array,
    encryptedSymmetricKey: Uint8Array,
    accTemplate: string
  ): EncryptedMemoV1 {
    return new EncryptedMemoV1({
      encryptedString,
      encryptedSymmetricKey,
      accTemplate: new TextEncoder().encode(JSON.stringify(accTemplate)),
    });
  }

  toBytes(): Uint8Array {
    return proto.EncryptedMemo.encode({ v1: this }).finish();
  }

  static fromBytes(bytes: Uint8Array): EncryptedMemoV1 {
    return new EncryptedMemoV1(proto.EncryptedMemoV1.decode(bytes));
  }

  getAccTemplate(): string {
    return JSON.parse(new TextDecoder().decode(this.accTemplate));
  }
}

export function decodeEncryptedMemo(bytes: Uint8Array): EncryptedMemo {
  const em = proto.EncryptedMemo.decode(bytes);
  if (em.v1) {
    return new EncryptedMemoV1(em.v1);
  }

  throw new InvalidVersionError(
    `unhandled version found when decoding EncryptedMemo. ${JSON.stringify(em)}`
  );
}
