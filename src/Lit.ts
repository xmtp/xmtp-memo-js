import LitJsSdk from "@lit-protocol/sdk-browser";
import { Blob } from "buffer";
import { render } from "mustache";
import { AuthSig } from "./AuthSig";
import { EncryptedMemoV1 } from "./EncryptedMemo";
import { MemoV1 } from "./Memo";
import { bytesToHex } from "./utils";

export type AccView = {
  userAddress: string;
};

export interface Acc {
  contractAddress: string;
  standardContractType: string;
  chain: number;
  method: string;
  parameters: Array<string>;
  returnValueTest: any;
}

export default class Lit {
  client: any; // Types do not exist fot LitNodeClient yet
  authSig;

  chain = "ethereum";

  constructor(authSig?: AuthSig) {
    this.authSig = authSig; // AuthSig is passed in at initialization to ensure the caller is controlling when signatures are requested from the user
    this.client = this.client = new LitJsSdk.LitNodeClient({ debug: false });
  }

  // Connecting on initialization is not sufficient to ensure the Lit nodes are connected.
  async ensureConnected(): Promise<void> {
    await this.client.connect();
  }

  async encryptBytes(
    bytes: Uint8Array,
    accessControlConditions: Acc
  ): Promise<EncryptedMemoV1> {
    await this.ensureConnected();

    const chain = this.chain;
    const authSig = await this.getAuthSig();

    const stringEncodedData = LitJsSdk.uint8arrayToString(bytes, "base64");
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      stringEncodedData
    );

    const encryptedContentsBuffer = await (
      encryptedString as Blob
    ).arrayBuffer();

    const encryptedSymmetricKey = await this.client.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return new EncryptedMemoV1(
      new Uint8Array(encryptedContentsBuffer),
      encryptedSymmetricKey,
      accessControlConditions
    );
  }

  async decrypt(encryptedMemo: EncryptedMemoV1): Promise<MemoV1> {
    await this.ensureConnected();

    const chain = this.chain;

    var authSig = await this.getAuthSig();
    const symmetricKey = await this.client.getEncryptionKey({
      accessControlConditions: encryptedMemo.accessControlConditions,
      toDecrypt: bytesToHex(encryptedMemo.encryptedSymmetricKey),
      chain,
      authSig,
    });

    const blob = new Blob([encryptedMemo.encryptedString], {
      type: "application/octet-stream",
    });

    const decryptedString = await LitJsSdk.decryptString(blob, symmetricKey);
    const decryptedBytes = LitJsSdk.uint8arrayFromString(
      decryptedString,
      "base64"
    );

    const memo = await MemoV1.fromBytes(decryptedBytes);
    return memo;
  }

  async getAuthSig(): Promise<AuthSig> {
    return (
      this.authSig ??
      (await LitJsSdk.checkAndSignAuthMessage({ chain: this.chain }))
    );
  }

  renderAccTemplate(accTemplate: string, view: AccView): Acc {
    const rendered = render(accTemplate, view);
    return JSON.parse(rendered);
  }

  accTemplate_userAddr(): string {
    const acc = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: this.chain,
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: "{{userAddress}}",
        },
      },
    ];

    return JSON.stringify(acc);
  }
}
