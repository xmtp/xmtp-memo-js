import assert from "assert";

import { MemoV1 } from "../src";
import { PayloadV1 } from "../src/Memo";
import { MockSigner } from "../src/MsgSigner";

describe("Memo", function () {
  it("payload roundtrip", async function () {
    const p = new PayloadV1({
      toAddr: "0x001",
      fromAddr: "0x002",
      encodedContent: "hello",
      timestamp: new Date().getTime(),
    });

    const d = p.toBytes();
    const q = PayloadV1.fromBytes(d);

    assert.deepEqual(p, q);
  });

  it("memo roundtrip", async function () {
    const signer = new MockSigner();
    const m1 = await MemoV1.create(
      "0x001",
      await signer.getAddress(),
      "Hello",
      signer
    );

    const d = await m1.toBytes();

    if (!d) {
      throw new Error("Bad Encode");
    }
    const m2 = await MemoV1.fromBytes(d);
    assert.deepEqual(m2?.payload, m1.payload);
  });
});
