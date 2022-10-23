import assert from "assert";
import { createTestMemoClient } from "./helpers";

describe("MemoClient", function () {
  it("message fetch", async () => {
    const amal = await createTestMemoClient();
    const bola = await createTestMemoClient();

    await amal.sendMemo(bola.addr, "Test");

    for (const memo of await bola.listMemos()) {
      console.log("M:", memo);
    }
  });
});
