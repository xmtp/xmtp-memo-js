import { Signer, Wallet } from "ethers";
import { Client, PrivateKey } from "@xmtp/xmtp-js";

import { AuthSig } from "../src/crypto/AuthSig";
import { MemoClient } from "../src";
import { ClientSigner } from "../src/crypto/MemoSigner";
import { XmtpStorage } from "../src/storage/XmtpStorage";

export function newWallet(): Wallet {
  const key = PrivateKey.generate();
  return new Wallet(key.secp256k1.bytes);
}

export function createTestClient(): Promise<Client> {
  return Client.create(newWallet(), { env: "dev" });
}

export async function genAuthSig(
  signer: Signer,
  bytes: Uint8Array
): Promise<AuthSig> {
  const signature = await signer.signMessage(bytes);

  return {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: new TextDecoder().decode(bytes),
    address: await signer.getAddress(),
  };
}

export async function createTestMemoClient(
  overrideWallet?: Wallet
): Promise<MemoClient> {
  const wallet = overrideWallet ?? newWallet();

  const c = await Client.create(wallet, { env: "local" });
  const storage = await XmtpStorage.create(c);

  const client = new MemoClient(
    await genAuthSig(wallet, new TextEncoder().encode("AUTH")),
    c,
    await ClientSigner.create(c),
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
  return await signWithKey(bytes, key);
}

export class AuthSigner {
  static async create(): Promise<AuthSigner> {
    return new AuthSigner();
  }
}
