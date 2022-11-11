import { EncryptedMemoV1 } from "./EncryptedMemo";

export abstract class MemoStorage {
  abstract fetchEncryptedMemos(
    addr: string
  ): Promise<AsyncGenerator<EncryptedMemoV1[], any>>;

  abstract postEncryptedMemo(
    addr: string,
    encryptedPackage: EncryptedMemoV1
  ): Promise<boolean>;
}
