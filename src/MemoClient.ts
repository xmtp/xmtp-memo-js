import { Client, ContentTypeText, SendOptions } from "@xmtp/xmtp-js";

import { AuthSig, requiredSiweResource } from "./crypto/AuthSig";
import Lit from "./Lit";
import { DecodedMemoV1, MemoV1 } from "./Memo";
import { ClientSigner, MemoSigner } from "./crypto/MemoSigner";
import { MemoStorage } from "./storage/MemoStorage";
import {
  filterStream,
  flattenStream,
  gatherStream,
  mapPaginatedStream,
} from "./utils";
import { XmtpStorage } from "./storage/XmtpStorage";
import { EncryptedMemoV1 } from "./EncryptedMemo";

class BadAuthSig extends Error {}

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
    // TODO: add better resource validation
    if (!authSig.signedMessage.includes(requiredSiweResource())) {
      throw new BadAuthSig(
        `required resource:${requiredSiweResource()} is missing`
      );
    }
    this.litClient = new Lit(authSig);
    this.xmtpClient = xmtpClient;
    this.memoSigner = memoSigner;
    this.storage = storage;
    this.addr = authSig.address;
  }

  // to create a MemoClient a valid authSig is needed.
  static async create(authSig: AuthSig, client: Client): Promise<MemoClient> {
    const storage = await XmtpStorage.create(client);

    return new MemoClient(
      authSig,
      client,
      await ClientSigner.create(client),
      storage
    );
  }

  async listMemos(): Promise<AsyncGenerator<DecodedMemoV1>> {
    const encryptedMemoStream = await this.storage.fetchEncryptedMemos(
      this.addr
    );

    const memoPages = mapPaginatedStream(
      encryptedMemoStream,
      this.decodeMemo.bind(this)
    );
    return filterStream(flattenStream(memoPages));
  }

  async listAllMemos(): Promise<DecodedMemoV1[]> {
    return await gatherStream(await this.listMemos());
  }

  async listSentMemos(): Promise<MemoV1[]> {
    return [];
  }

  async sendMemo(
    toAddr: string,
    content: any,
    options?: SendOptions
  ): Promise<boolean> {
    const contentType = options?.contentType || ContentTypeText;
    const timestamp = options?.timestamp || new Date();
    const payload = await this.xmtpClient.encodeContent(content, options);

    const memo = await MemoV1.create(
      toAddr,
      this.addr,
      payload,
      this.memoSigner
    );

    const encryptedMemo = await this.litClient.encryptMemo(memo);
    return this.storage.postEncryptedMemo(toAddr, encryptedMemo);
  }

  // Decrypt and return a DecodedMemo
  private async decodeMemo(
    encodedMemo: EncryptedMemoV1
  ): Promise<DecodedMemoV1 | undefined> {
    const decryptedBytes = await this.litClient.decryptMemo(encodedMemo);
    if (!decryptedBytes) {
      return decryptedBytes;
    }

    return DecodedMemoV1.fromBytes(decryptedBytes, this.xmtpClient);
  }
}
