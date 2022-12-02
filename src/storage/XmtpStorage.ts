import { Client } from "@xmtp/xmtp-js";
import { MemoStorage } from "./MemoStorage";
import { fetcher, messageApi } from "@xmtp/proto";
import { decodeEncryptedMemo, EncryptedMemo } from "../EncryptedMemo";
import { mapPaginatedStream } from "../utils";
import { keccak256 } from "js-sha3";

export class XmtpStorage implements MemoStorage {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  static async create(client: Client) {
    return new XmtpStorage(client);
  }

  async postEncryptedMemo(
    addr: string,
    encryptedMemo: EncryptedMemo
  ): Promise<boolean> {
    const topic = this.buildTopic(addr);
    const bytes = await encryptedMemo.toBytes();
    const resp = await this.client.apiClient.publish([
      {
        contentTopic: topic,
        message: bytes,
      },
    ]);

    return true;
  }

  async fetchEncryptedMemos(
    addr: string
  ): Promise<AsyncGenerator<EncryptedMemo[], any>> {
    const memoStream = mapPaginatedStream(
      this.client.apiClient.queryIteratePages(
        { contentTopics: [this.buildTopic(addr)] },
        {
          direction: messageApi.SortDirection.SORT_DIRECTION_ASCENDING,
          pageSize: 100,
        }
      ),
      this.asyncWrap(this.decode)
    );

    return memoStream;
  }

  private asyncWrap<K, T>(func: (k: K) => T): (k: K) => Promise<T> {
    return (k: K): Promise<T> => {
      return Promise.resolve(func(k));
    };
  }

  decode({ message }: messageApi.Envelope): EncryptedMemo {
    const bytes = fetcher.b64Decode(message as unknown as string);
    return decodeEncryptedMemo(bytes);
  }

  buildTopic(addr: string): string {
    // Obscure the storage topic, to maintain recipient privacy.
    const obscuredTopic = keccak256(`xmtp:memo:${addr}`);
    return `/xmtp-memo/0/memo-${obscuredTopic}`;
  }
}
