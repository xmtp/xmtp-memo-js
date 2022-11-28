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
