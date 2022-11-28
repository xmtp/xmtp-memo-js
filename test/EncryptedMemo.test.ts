import assert from "assert";
import { EncryptedMemoV1 } from "../src/EncryptedMemo";
import { bytesToHex } from "../src/utils";
import Lit from "../src/Lit";

describe("Encrypted Memo", function () {
  it("round trip", async function () {
    const s = new TextEncoder().encode("message");
    const k = new TextEncoder().encode("keys");

    const em = new EncryptedMemoV1(s, k, Lit.accTemplate_siweAddr());
    const bytes = await em.toBytes();
    const em1 = await EncryptedMemoV1.fromBytes(bytes);

    assert.deepEqual(em1, em);
  });
});
