import { Wallet } from "ethers";
import { Client, PrivateKey } from "@xmtp/xmtp-js";
import { AuthSig } from "../src/AuthSig";
import { MemoClient } from "../src";
import { MockSigner } from "../src/MsgSigner";
import { DemoMemoStorage } from "../src/MemoStorage";

export function newWallet(): Wallet {
  const key = PrivateKey.generate();
  if (!key.secp256k1) {
    throw new Error("invalid key");
  }
  return new Wallet(key.secp256k1.bytes);
}

export function createTestClient(): Promise<Client> {
  return Client.create(newWallet(), { env: "dev" });
}

export async function createTestMemoClient(): Promise<MemoClient> {
  // Place holder for wallet signatures
  const wallet = new MockSigner();
  const msgSigner = new MockSigner();
  const storage = new DemoMemoStorage();

  const client = new MemoClient(
    await msgSigner.getAddress(),
    await msgSigner.genAuthSig(new TextEncoder().encode("AUTH")),
    msgSigner,
    storage
  );

  return client;
}

export async function signWithKey(
  bytes: Uint8Array,
  privateKey: PrivateKey
): Promise<AuthSig> {
  const wallet = new Wallet(privateKey.secp256k1.bytes);
  const signature = await wallet.signMessage(bytes);

  return {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: new TextDecoder().decode(bytes),
    address: await wallet.getAddress(),
  };
}

export async function signWithRandomKey(bytes: Uint8Array): Promise<AuthSig> {
  const key = PrivateKey.generate();
  if (!key.secp256k1) {
    throw new Error("invalid key");
  }

  return await signWithKey(bytes, key);
}

export class AuthSigner {
  static async create(): Promise<AuthSigner> {
    return new AuthSigner();
  }
}
