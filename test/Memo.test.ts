import assert from "assert";

import { MemoV1 } from "../src";
import { ClientSigner } from "../src/crypto/MemoSigner";
import { DecodedMemoV1, PayloadV1 } from "../src/Memo";
import { ClientFactory } from "./helpers";

describe("Memo", function () {
  it("Memo roundtrip", async function () {
    const toClient = await ClientFactory.newClient();
    const fromClient = await ClientFactory.newClient();

    const content = `${new Date()}`;
    const payload = await fromClient.encodeContent(content);

    const toAddr = toClient.address;
    const fromAddr = fromClient.address;

    const memo = await MemoV1.create(
      toAddr,
      fromAddr,
      payload,
      await ClientSigner.create(fromClient)
    );

    const bytes = await memo.toBytes();

    const decoded = await DecodedMemoV1.fromBytes(bytes, toClient);

    assert.equal(decoded.toAddr, toAddr);
    assert.equal(decoded.fromAddr, fromAddr);
    assert.equal(decoded.timestamp, memo.payload.timestamp);
    assert.equal(decoded.content, content);
  });
});
