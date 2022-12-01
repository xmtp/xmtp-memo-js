import {
  EncryptedMemoV1,
  decodeEncryptedMemo,
  EncryptedMemoV2,
} from "../src/EncryptedMemo";
import Lit from "../src/Lit";

describe("Encrypted Memo", function () {
  it("round trip", async function () {
    const encryptedString = new TextEncoder().encode("message");
    const encryptedSymmetricKey = new TextEncoder().encode("keys");
    const acc = Lit.accTemplate_siweAddr();

    const bytes = await EncryptedMemoV1.create(
      encryptedString,
      encryptedSymmetricKey,
      acc
    ).toBytes();

    const em = decodeEncryptedMemo(bytes);

    expect(em.encryptedString).toEqual(encryptedString);
    expect(em.encryptedSymmetricKey).toEqual(encryptedSymmetricKey);
    expect(em.getAccTemplate()).toEqual(acc);
  });

  it("versioning2", async function () {
    const encryptedString = new TextEncoder().encode("message");
    const encryptedSymmetricKey = new TextEncoder().encode("keys");
    const acc = Lit.accTemplate_siweAddr();

    const bytes = await EncryptedMemoV2.create(
      "v2",
      encryptedString,
      encryptedSymmetricKey,
      acc
    ).toBytes();

    const em = decodeEncryptedMemo(bytes);

    expect(em.encryptedString).toEqual(encryptedString);
    expect(em.encryptedSymmetricKey).toEqual(encryptedSymmetricKey);
    expect(em.getAccTemplate()).toEqual(acc);
  });
});
