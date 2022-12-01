import { EncryptedMemo } from "../EncryptedMemo";

export abstract class MemoStorage {
  abstract fetchEncryptedMemos(
    addr: string
  ): Promise<AsyncGenerator<EncryptedMemo[], any>>;

  abstract postEncryptedMemo(
    addr: string,
    encryptedPackage: EncryptedMemo
  ): Promise<boolean>;
}
