import assert from "assert";

import { PrivateKey } from "@xmtp/xmtp-js";
import { utils, Wallet } from "ethers";
import { bytesToHex, hexToBytes } from "../src/utils";
import { AuthSigner } from "./helpers";

describe("AuthSigner", function () {
  it("Signing", async function () {
    const msg = "Example `personal_sign` message";

    const pkb =
      "08f189d98dc13012220a20c24089718d4cf2567469e409bc03ca0d1b702b72a986d3664c2985ebc89f98821a4c08f189d98dc1301a430a41044ed8f03980491983eec9e42d7747f110be962438ab1c3ae1103a4168c8c6d75715ece691face0867c1c08da476935c2060a02114d8581a44f14a9c86d104ecf8";
    const key = PrivateKey.fromBytes(hexToBytes(pkb));

    if (!key.secp256k1) {
      throw new Error("invalid key");
    }
    const wallet = new Wallet(key.secp256k1.bytes);
    const signature = await wallet.signMessage(msg);

    const as = {
      sig: signature,
      derivedVia: "web3.eth.personal.sign",
      signedMessage: msg,
      address: await wallet.getAddress(),
    };

    const addr = utils.verifyMessage(msg, signature);
  });
});
