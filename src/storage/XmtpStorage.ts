import { Client, ClientOptions } from "@xmtp/xmtp-js";
import { MemoStorage } from "../MemoStorage";
import { newWallet } from "../../test/helpers";
import { fetcher, messageApi } from "@xmtp/proto";
import { EncryptedMemoV1 } from "../EncryptedMemo";
import { mapPaginatedStream } from "../export";

class BadDecodeError extends Error {}
class BadEncodeError extends Error {}

export class XmtpStorage implements MemoStorage {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  static async create(opts: Partial<ClientOptions>) {
    const client = await Client.create(newWallet(), opts);
    return new XmtpStorage(client);
  }

  async postEncryptedMemo(
    addr: string,
    encryptedMemo: EncryptedMemoV1
  ): Promise<boolean> {
    const topic = this.buildTopic(addr);

    const bytes = await encryptedMemo.toBytes();
    if (!bytes) {
      throw new BadEncodeError();
    }

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
          direction: messageApi.SortDirection.SORT_DIRECTION_DESCENDING,
          pageSize: 100,
        }
      ),
      this.decode
    );

    return memoStream;
  }

  async decode({
    message,
    contentTopic,
  }: messageApi.Envelope): Promise<EncryptedMemoV1> {
    const bytes = fetcher.b64Decode(message as unknown as string);
    const em = await EncryptedMemoV1.fromBytes(bytes);

    if (!em) {
      throw new BadDecodeError();
    }
    return em;
  }

  buildTopic(addr: string): string {
    return `/xmtp-memo/0/${addr}`;
  }
}