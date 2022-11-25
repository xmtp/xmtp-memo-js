import assert from "assert";

import { MemoV1 } from "../src";
import { PayloadV1 } from "../src/Memo";

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
});
