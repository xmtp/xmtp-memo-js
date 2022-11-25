import { Client } from "@xmtp/xmtp-js";

import { AuthSig } from "./AuthSig";
import { EncryptedMemoV1 } from "./EncryptedMemo";
import Lit from "./Lit";
import { MemoV1 } from "./Memo";
import { MemoSigner } from "./MemoSigner";
import { MemoStorage } from "./MemoStorage";
import { flattenStream, gatherStream, mapPaginatedStream } from "./steamUtils";

type Content = string;

export default class MemoClient {
  litClient;
  xmtpClient;
  memoSigner;
  storage;
  addr;

  constructor(
    authSig: AuthSig,
    xmtpClient: Client,
    memoSigner: MemoSigner,
    storage: MemoStorage
  ) {
    this.litClient = new Lit(authSig);
    this.xmtpClient = xmtpClient;
    this.memoSigner = memoSigner;
    this.storage = storage;
    this.addr = authSig.address;
  }

  async listMemos(): Promise<MemoV1[]> {
    const encryptedMemoStream = await this.storage.fetchEncryptedMemos(
      this.addr
    );

    const memoPages = mapPaginatedStream(
      encryptedMemoStream,
      this.litClient.decrypt.bind(this.litClient)
    );
    const memos = await flattenStream(memoPages);
    return await gatherStream(memos);
  }

  async listSentMemos(): Promise<MemoV1[]> {
    return [];
  }

  async sendMemo(toAddr: string, content: Content): Promise<boolean> {
    const memo = await MemoV1.create(
      toAddr,
      this.addr,
      content,
      this.memoSigner
    );

    const bytes = await memo.toBytes();
    const encryptedMemo = await this.encryptWithLitForAccount(bytes, toAddr);
    return this.storage.postEncryptedMemo(toAddr, encryptedMemo);
  }

  public async encryptWithLitForAccount(
    bytes: Uint8Array,
    toAddr: string
  ): Promise<EncryptedMemoV1> {
    const accTemplate = this.litClient.accTemplate_userAddr();
    const acc = this.litClient.renderAccTemplate(accTemplate, {
      userAddress: toAddr,
    });

    return await this.litClient.encryptBytes(bytes, acc);
  }
}
