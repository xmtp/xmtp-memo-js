import { Signature } from "@xmtp/xmtp-js";

export function bytesToHex(bytes: Uint8Array | undefined): string {
  if (!bytes) {
    return "Undefined";
  }

  return Buffer.from(bytes).toString("hex");
}

export function hexToBytes(s: string): Uint8Array {
  if (s.startsWith("0x")) {
    s = s.slice(2);
  }
  const bytes = new Uint8Array(s.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    const j = i * 2;
    bytes[i] = Number.parseInt(s.slice(j, j + 2), 16);
  }
  return bytes;
}

export function sigToStr(signature: Signature) {
  return `Signature {
    ecdsaCompact: {
      bytes: ${bytesToHex(signature.ecdsaCompact?.bytes)}
      recovery: ${signature.ecdsaCompact?.recovery}
    }
  }`;
  return signature;
}
