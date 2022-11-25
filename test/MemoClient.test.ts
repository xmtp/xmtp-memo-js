import assert from "assert";
import { createTestMemoClient } from "./helpers";

describe("MemoClient", function () {
  it("message fetch", async () => {
    const amal = await createTestMemoClient();
    const bola = await createTestMemoClient();

    const content = "Test";
    await amal.sendMemo(bola.addr, content);

    for (const memo of await bola.listAllMemos()) {
      assert.equal(memo.payload.encodedContent, content);
    }
  });
});
