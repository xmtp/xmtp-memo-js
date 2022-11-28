import assert from "assert";
import { MemoV1 } from "../src";
import { createTestMemoClient, newWallet } from "./helpers";

describe("MemoClient", function () {
  it("e2e", async function () {
    const destinationWallet = newWallet();
    const sender = await createTestMemoClient();
    const outboundContents: string[] = [];

    for (let i = 0; i < 5; i++) {
      const contents = `test: ${new Date()}`;
      outboundContents.push(contents);
    }
    for (const contents of outboundContents) {
      await sender.sendMemo(destinationWallet.address, contents);
    }
    // Lit Needs some time before the Keys can be fetched
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Reciever registers after the messages have been sent
    const receiver = await createTestMemoClient(destinationWallet);
    const memos = await receiver.listAllMemos();
    assert.equal(
      memos.length,
      outboundContents.length,
      "incorrect number of memos detected"
    );
    const retrievedContents = memos.map((memo) => {
      return memo.payload.encodedContent;
    });

    console.log("R", retrievedContents);
    assert.deepEqual(retrievedContents, outboundContents);
  });

  it("ignore fake memo", async function () {
    const contents = `test: ${new Date()}`;
    const mc = await createTestMemoClient();

    // send BadMemo
    await (async () => {
      const toAddr = mc.addr;
      const memo = await MemoV1.create(
        mc.addr,
        "0x0", // BadAddress
        contents,
        mc.memoSigner
      );
      mc.storage.postEncryptedMemo(
        toAddr,
        await mc.litClient.encryptMemo(memo)
      );
    })();
    let m = await mc.listAllMemos();
    assert.equal(m.length, 0);

    // send GoodMemo
    await (async () => {
      const toAddr = mc.addr;
      const memo = await MemoV1.create(
        mc.addr,
        toAddr,
        contents,
        mc.memoSigner
      );
      mc.storage.postEncryptedMemo(
        toAddr,
        await mc.litClient.encryptMemo(memo)
      );
    })();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    m = await mc.listAllMemos();
    assert.equal(m.length, 1);
  });
});
