import assert from "assert";
import { MemoClient, MemoV1 } from "../src";
import { createTestMemoClient, newWallet } from "./helpers";

async function createRawMemo(
  mc: MemoClient,
  toAddr: string,
  fromAddr: string,
  contents: any
): Promise<MemoV1> {
  const memo = await MemoV1.create(
    toAddr,
    fromAddr,
    await mc.xmtpClient.encodeContent(contents),
    mc.memoSigner
  );
  return memo;
}

async function sendRawMemo(mc: MemoClient, toAddr: string, memo: MemoV1) {
  mc.storage.postEncryptedMemo(toAddr, await mc.litClient.encryptMemo(memo));
}

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

    const toAddr = mc.addr;

    // send BadMemo
    await (async () => {
      const memo = await createRawMemo(mc, "0x0", toAddr, contents);
      await sendRawMemo(mc, toAddr, memo);
    })();
    let m = await mc.listAllMemos();
    assert.equal(m.length, 0);

    // send GoodMemo
    await (async () => {
      const memo = await createRawMemo(mc, toAddr, toAddr, contents);
      await sendRawMemo(mc, toAddr, memo);
    })();

    await new Promise((resolve) => setTimeout(resolve, 1000));
    m = await mc.listAllMemos();
    assert.equal(m.length, 1);
  });
});
