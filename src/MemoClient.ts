import { MemoV1 } from "./Memo";
import { MemoStorage, DemoMemoStorage } from "./MemoStorage";
import Lit, { EncryptedPackage } from "./Lit";
import Signature from "./Signature";
import { AuthSig } from "./AuthSig";
import { MsgSigner } from "./MsgSigner";

type Content = string;

export default class MemoClient {
  litClient;
  msgSigner;
  storage;
  addr;

  constructor(
    addr: string,
    authSig: AuthSig,
    msgSigner: MsgSigner,
    storage: MemoStorage
  ) {
    this.litClient = new Lit(authSig);
    this.msgSigner = msgSigner;
    this.storage = storage;
    this.addr = authSig.address;
  }

  async listMemos(): Promise<MemoV1[]> {
    const memos = await this.storage.fetchMemos(this.addr);
    return [];
  }

  async listSentMemos(): Promise<MemoV1[]> {
    return [];
  }

  async sendMemo(toAddr: string, content: Content): Promise<boolean> {
    const memo = await MemoV1.create(
      toAddr,
      this.addr,
      content,
      this.msgSigner
    );
    const bytes = await memo.toBytes();

    if (!bytes) {
      return false;
    }

    const encryptedMemo = await this.encryptWithLitForAccount(bytes, toAddr);

    // TODO: Save EncryptedMemo

    return false;
  }

  private async encryptWithLitForAccount(
    bytes: Uint8Array,
    toAddr: string
  ): Promise<EncryptedPackage> {
    const accTemplate =
      this.litClient.accessControllConditionTemplate_userAddr();

    const acc = this.litClient.renderAccTemplate(accTemplate, {
      userAddr: toAddr,
    });

    return await this.litClient.encryptBytes(bytes, acc);
  }
}
