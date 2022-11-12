import { Acc } from "./Lit";
import * as proto from "./proto/memo";

export class EncryptedMemoV1 {
  encryptedString: Uint8Array;
  encryptedSymmetricKey: Uint8Array;
  accessControlConditions: Acc;

  constructor(
    encryptedString: Uint8Array,
    encryptedSymmetricKey: Uint8Array,
    accessControlConditions: Acc
  ) {
    this.encryptedString = encryptedString;
    this.encryptedSymmetricKey = encryptedSymmetricKey;
    this.accessControlConditions = accessControlConditions;
  }

  async toBytes(): Promise<Uint8Array> {
    return proto.EncryptedMemoV1.encode({
      encryptedString: this.encryptedString,
      encryptedSymmetricKey: this.encryptedSymmetricKey,
      accessControlConditions: new TextEncoder().encode(
        JSON.stringify(this.accessControlConditions)
      ),
    }).finish();
  }

  static async fromBytes(bytes: Uint8Array): Promise<EncryptedMemoV1> {
    const obj = proto.EncryptedMemoV1.decode(bytes);

    return new EncryptedMemoV1(
      obj.encryptedString,
      obj.encryptedSymmetricKey,
      JSON.parse(new TextDecoder().decode(obj.accessControlConditions))
    );
  }
}
