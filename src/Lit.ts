import LitJsSdk from "@lit-protocol/sdk-browser";
import { Blob } from "buffer";
import { render } from "mustache";
import { AuthSig, requiredSiweResource } from "./crypto/AuthSig";
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

export type AccTemplate = string;

export interface LitEncryptedTuple {
  key: Uint8Array;
  contents: Uint8Array;
}

export default class Lit {
  client: any; // Types do not exist fot LitNodeClient yet
  authSig;

  static chain = "ethereum";

  // AuthSig is passed in at initialization to ensure the caller is controlling when signatures are requested from the user
  constructor(authSig?: AuthSig) {
    this.authSig = authSig;
    this.client = this.client = new LitJsSdk.LitNodeClient({ debug: false });
  }

  // Connecting on initialization is not sufficient to ensure the Lit nodes are connected.
  async ensureConnected(): Promise<void> {
    await this.client.connect();
  }

  async encryptMemo(memo: MemoV1): Promise<EncryptedMemoV1> {
    const accTemplate = Lit.accTemplate_siweAddr();
    const acc = this.renderAccTemplate(accTemplate, {
      userAddress: memo.payload.toAddr,
    });

    const { key, contents } = await this.encryptBytes(
      await memo.toBytes(),
      acc
    );

    return new EncryptedMemoV1(contents, key, accTemplate);
  }

  async decryptMemo(
    encryptedMemo: EncryptedMemoV1
  ): Promise<MemoV1 | undefined> {
    try {
      await this.ensureConnected();
      const authSig = await this.getAuthSig();
      const acc = this.renderAccTemplate(encryptedMemo.accTemplate, {
        userAddress: authSig.address,
      });

      return await MemoV1.fromBytes(
        await this.decryptBytes(
          encryptedMemo.encryptedSymmetricKey,
          encryptedMemo.encryptedString,
          acc
        )
      );
    } catch (e) {
      console.warn("During Decryption", e);
    }
  }

  // Bytes are encrypted with a symmetric key. The encryption key is then stored in the Lit network
  // so it can be retrieved by the recipient at a future date.
  async encryptBytes(bytes: Uint8Array, acc: Acc): Promise<LitEncryptedTuple> {
    await this.ensureConnected();

    // Encrypt bytes using a symmetricKey
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      LitJsSdk.uint8arrayToString(bytes, "base64")
    );

    const encryptedContentsBuffer = await (
      encryptedString as Blob
    ).arrayBuffer();

    const encryptedSymmetricKey = await this.client.saveEncryptionKey({
      accessControlConditions: acc,
      symmetricKey,
      authSig: await this.getAuthSig(),
      chain: Lit.chain,
    });

    return {
      key: encryptedSymmetricKey,
      contents: new Uint8Array(encryptedContentsBuffer),
    };
  }

  async decryptBytes(
    key: Uint8Array,
    contents: Uint8Array,
    acc: Acc
  ): Promise<Uint8Array> {
    const symmetricKey = await this.client.getEncryptionKey({
      accessControlConditions: acc,
      toDecrypt: bytesToHex(key),
      chain: Lit.chain,
      authSig: await this.getAuthSig(),
    });

    const blob = new Blob([contents], {
      type: "application/octet-stream",
    });

    return LitJsSdk.uint8arrayFromString(
      await LitJsSdk.decryptString(blob, symmetricKey),
      "base64"
    );
  }

  async getAuthSig(): Promise<AuthSig> {
    return (
      this.authSig ??
      (await LitJsSdk.checkAndSignAuthMessage({ chain: Lit.chain }))
    );
  }

  // AccessControlConditions are included in the EncryptedMemo as it is required to
  // retrieve the encryption key, and may change in the future. As this data must
  // be included in cleartext, a template is included so that the ACC contains no PII.
  static accTemplate_siweAddr(): AccTemplate {
    const acc = [
      {
        contractAddress: "",
        standardContractType: "SIWE",
        chain: Lit.chain,
        method: "",
        parameters: [":resources"],
        returnValueTest: {
          comparator: "contains",
          value: requiredSiweResource(),
        },
      },
      { operator: "and" },
      {
        contractAddress: "",
        standardContractType: "",
        chain: Lit.chain,
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

  static accTemplate_userAddr(): AccTemplate {
    const acc = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: Lit.chain,
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

  // Populate AccTemplates with actual values
  renderAccTemplate(accTemplate: string, view: AccView): Acc {
    const rendered = render(accTemplate, view);
    return JSON.parse(rendered);
  }
}
