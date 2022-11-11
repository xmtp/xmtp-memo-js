import assert from "assert";
import { EncryptedMemoV1 } from "../src/EncryptedMemo";
import { bytesToHex } from "../src/utils";
import Lit from "../src/Lit";

describe("Encrypted Memo", function () {
  it("round trip", async function () {
    const s = new TextEncoder().encode("message");
    const k = new TextEncoder().encode("keys");
    const a = {
      contractAddress: "0x3110c39b428221012934A7F617913b095BC1078C",
      standardContractType: "ERC1155",
      chain: 1,
      method: "balanceOf",
      parameters: [":userAddress", "9541"],
      returnValueTest: {
        comparator: ">",
        value: "0",
      },
    };

    const em = new EncryptedMemoV1(s, k, a);
    const bytes = await em.toBytes();
    const em1 = await EncryptedMemoV1.fromBytes(bytes);

    assert.deepEqual(em1, em);
  });
});
