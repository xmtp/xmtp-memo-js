import { Client } from "@xmtp/xmtp-js";

import { AuthSig } from "./crypto/AuthSig";
import { EncryptedMemoV1 } from "./EncryptedMemo";
import Lit from "./Lit";
import { MemoV1 } from "./Memo";
import { MemoSigner } from "./crypto/MemoSigner";
import { MemoStorage } from "./storage/MemoStorage";
import { flattenStream, gatherStream, mapPaginatedStream } from "./utils";

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

  async listMemos(): Promise<AsyncGenerator<MemoV1>> {
    const encryptedMemoStream = await this.storage.fetchEncryptedMemos(
      this.addr
    );

    const memoPages = mapPaginatedStream(
      encryptedMemoStream,
      this.litClient.decryptMemo.bind(this.litClient)
    );
    return flattenStream(memoPages);
  }

  async listAllMemos(): Promise<MemoV1[]> {
    return await gatherStream(await this.listMemos());
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

    const encryptedMemo = await this.litClient.encryptMemo(memo);
    return this.storage.postEncryptedMemo(toAddr, encryptedMemo);
  }
}
