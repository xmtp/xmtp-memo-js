import assert from "assert";
import { MockSigner } from "../src/MsgSigner";
import Signature from "../src/Signature";

describe("Signatures", function () {
  it("Signature roundtrip", async function () {
    const signer = new MockSigner();

    const s1 = await signer.signString("SIWE");
    const d = s1.toBytes();
    const s2 = Signature.fromBytes(d);

    assert.deepEqual(s1, s2);
  });

  it("verify", async function () {
    const signer = new MockSigner();

    const m = new TextEncoder().encode("Hello");
    const signature = await signer.signBytes(m);

    assert.ok(signature.verify(await signer.getAddress(), m));
  });
});
