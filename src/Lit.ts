import LitJsSdk from "@lit-protocol/sdk-browser";
import { Blob } from "buffer";
import { render } from "mustache";
import { AuthSig } from "./AuthSig";

export type Acc = any;

export type AccView = {
  userAddr: string;
};

export type EncryptedPackage = {
  encryptedString: Blob;
  encryptedSymmetricKey: string;
  accessControlConditions: Acc;
};

export default class Lit {
  client: any; // Types do not exist fot LitNodeClient yet
  authSig;

  chain = "ethereum";

  constructor(authSig?: AuthSig) {
    this.authSig = authSig; // AuthSig is passed in at initialization to ensure the caller is controlling when signatures are requested from the user
  }

  async connect() {
    this.client = new LitJsSdk.LitNodeClient({ debug: false });
    await this.client.connect();
  }

  async encryptBytes(bytes: Uint8Array, accessControlConditions: Acc) {
    if (!this.client) {
      await this.connect();
    }

    const chain = this.chain;
    const authSig = await this.getAuthSig();

    // TODO: EncryptString requires a string which is decoded into an Uint8Array
    // Can this be streamlined?
    const stringEncodedData = LitJsSdk.uint8arrayToString(bytes);
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      stringEncodedData
    );

    const encryptedSymmetricKey = await this.client.saveEncryptionKey({
      accessControlConditions: accessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        "base64"
      ),
      accessControlConditions,
    };
  }

  async decryptBytes(
    encryptedBytes: Uint8Array,
    encryptedSymmetricKey: Uint8Array,
    accessControlConditions: Acc
  ) {
    if (!this.client) {
      await this.connect();
    }

    const chain = this.chain;

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.client.getEncryptionKey({
      accessControlConditions: accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });

    const decryptedString = await LitJsSdk.decryptFile(
      encryptedBytes,
      symmetricKey
    );
    return decryptedString;
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

  accessControllConditionTemplate_userAddr(): string {
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
