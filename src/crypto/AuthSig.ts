import { utils } from "ethers";

export type AuthSig = {
  sig: string;
  derivedVia: string;
  signedMessage: string;
  address: string;
};

export function isAuthSigValid(authSig: AuthSig): boolean {
  const addr = utils.verifyMessage(authSig.signedMessage, authSig.sig);
  if (addr === authSig.address) {
    return true;
  }

  return false;
}
