import assert from "assert";
import { MemoV1 } from "../src";
import { MockSigner } from "../src/MsgSigner";

describe("XmtpStorage", function () {
  it("payload roundtrip", async function () {
    // const store = await XmtpStorage.create({ env: "dev" });
    // const msgSigner = new MockSigner();
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
    const m2 = await MemoV1.fromBytes(d);
    assert.deepEqual(m2?.payload, m1.payload);
  });
});
