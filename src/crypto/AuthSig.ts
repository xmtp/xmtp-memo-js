import { Signer } from "ethers";

export type AuthSig = {
  sig: string;
  derivedVia: string;
  signedMessage: string;
  address: string;
};

// Authentication with Lit requires that the AuthSignature contains the resource for the
// memo service.
export function requiredSiweResource() {
  return "xmtp-memos://xmtp.org";
}

export async function genAuthSig(
  signer: Signer,
  text: string
): Promise<AuthSig> {
  const bytes = new TextEncoder().encode(text);
  const signature = await signer.signMessage(bytes);

  return {
    sig: signature,
    derivedVia: "web3.eth.personal.sign",
    signedMessage: text,
    address: await signer.getAddress(),
  };
}
