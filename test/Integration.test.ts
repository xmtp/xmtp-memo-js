import * as dotenv from "dotenv";
dotenv.config();

import assert from "assert";
import { MemoClient, MemoV1 } from "../src";

import { signWithRandomKey } from "./helpers";
import { DemoMemoStorage } from "../src/MemoStorage";
import { MockSigner } from "../src/MsgSigner";

describe("Integration Tests", function () {
  it("nominal start", async function () {});

  it("storage", async function () {
    const hostname = process.env.STORAGE_HOSTNAME;

    if (!hostname) {
      throw Error("Hostname not set via ENV var");
    }
    const store = new DemoMemoStorage(hostname);
    const signer = new MockSigner();

    const memo = await MemoV1.create(
      "0x0000A",
      await signer.getAddress(),
      "TestMSG",
      signer
    );
    const bytes = await memo.toBytes();

    if (!bytes) {
      throw Error("BadBytes");
    }

    await store.postMemo("0x0000A", bytes);
  });
});
