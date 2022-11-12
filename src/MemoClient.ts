import { MemoV1 } from "./Memo";
import { MemoStorage } from "./MemoStorage";
import Lit from "./Lit";
import { AuthSig } from "./AuthSig";
import { MsgSigner } from "./MsgSigner";
import { EncryptedMemoV1 } from "./EncryptedMemo";
import { flattenStream, gatherStream, mapStream } from "./export";

type Content = string;

export default class MemoClient {
  litClient;
  msgSigner;
  storage;
  addr;

  constructor(authSig: AuthSig, msgSigner: MsgSigner, storage: MemoStorage) {
    this.litClient = new Lit(authSig);
    this.msgSigner = msgSigner;
    this.storage = storage;
    this.addr = authSig.address;
  }

  async listMemos(): Promise<MemoV1[]> {
    const encryptedMemoStream = await this.storage.fetchEncryptedMemos(
      this.addr
    );

    const memoPages = mapStream(
      encryptedMemoStream,
      this.litClient.decrypt.bind(this.litClient)
    );
    const memos = flattenStream(memoPages);
    return gatherStream(memos);
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
    const encryptedMemo = await this.encryptWithLitForAccount(bytes, toAddr);
    return this.storage.postEncryptedMemo(toAddr, encryptedMemo);
  }

  private async encryptWithLitForAccount(
    bytes: Uint8Array,
    toAddr: string
  ): Promise<EncryptedMemoV1> {
    const accTemplate =
      this.litClient.accessControllConditionTemplate_userAddr();

    const acc = this.litClient.renderAccTemplate(accTemplate, {
      userAddress: toAddr,
    });

    return await this.litClient.encryptBytes(bytes, acc);
  }
}
