import { Acc, AccTemplate } from "./Lit";
import * as proto from "./proto/memo";

export class EncryptedMemoV1 {
  encryptedString: Uint8Array;
  encryptedSymmetricKey: Uint8Array;
  accTemplate: AccTemplate;

  constructor(
    encryptedString: Uint8Array,
    encryptedSymmetricKey: Uint8Array,
    accTemplate: string
  ) {
    this.encryptedString = encryptedString;
    this.encryptedSymmetricKey = encryptedSymmetricKey;
    this.accTemplate = accTemplate;
  }

  async toBytes(): Promise<Uint8Array> {
    return proto.EncryptedMemoV1.encode({
      encryptedString: this.encryptedString,
      encryptedSymmetricKey: this.encryptedSymmetricKey,
      accessControlConditions: new TextEncoder().encode(
        JSON.stringify(this.accTemplate)
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
