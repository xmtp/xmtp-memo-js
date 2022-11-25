import { Client, ClientOptions } from "@xmtp/xmtp-js";
import { MemoStorage } from "../MemoStorage";
import { newWallet } from "../../test/helpers";
import { fetcher, messageApi } from "@xmtp/proto";
import { EncryptedMemoV1 } from "../EncryptedMemo";
import { mapPaginatedStream } from "../steamUtils";

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
    encryptedMemo: EncryptedMemoV1
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
  ): Promise<AsyncGenerator<EncryptedMemoV1[], any>> {
    const memoStream = mapPaginatedStream(
      this.client.apiClient.queryIteratePages(
        { contentTopics: [this.buildTopic(addr)] },
        {
          direction: messageApi.SortDirection.SORT_DIRECTION_ASCENDING,
          pageSize: 100,
        }
      ),
      this.decode
    );

    return memoStream;
  }

  async decode({ message }: messageApi.Envelope): Promise<EncryptedMemoV1> {
    const bytes = fetcher.b64Decode(message as unknown as string);
    return await EncryptedMemoV1.fromBytes(bytes);
  }

  buildTopic(addr: string): string {
    return `/xmtp-memo/0/${addr}`;
  }
}
