import { Signature } from "@xmtp/xmtp-js";
import { DecodedMemoV1, MemoV1 } from "./Memo";

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

export type Mapper<In, Out> = (val: In) => Promise<Out>;

// Takes an async generator returning pages of an arbitrary type and converts to an async
// generator returning pages of an arbitrary type using a mapper function
export async function* mapPaginatedStream<In, Out>(
  gen: AsyncGenerator<In[]>,
  mapper: Mapper<In, Out>
): AsyncGenerator<Out[]> {
  for await (const page of gen) {
    const results = await Promise.allSettled(page.map(mapper));
    const out: Out[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        out.push(result.value);
      } else {
        console.warn(
          "Failed to process envelope due to reason: ",
          result.reason
        );
      }
    }

    yield out;
  }
}

export async function* filterStream(
  gen: AsyncGenerator<DecodedMemoV1 | undefined>
): AsyncGenerator<DecodedMemoV1, any, unknown> {
  for await (const item of gen) {
    if (!item) {
      continue;
    }
    yield item;
  }
}

// Takes an async generator of pages/arrays and returns a flattened collection.
export async function* flattenStream<In>(gen: AsyncGenerator<In[]>) {
  for await (const page of gen) {
    for (const item of page) {
      if (!item) {
        continue;
      }
      yield item;
    }
  }
}

// Create an array of elements from an async stream.
export async function gatherStream<In>(gen: AsyncIterable<In>): Promise<In[]> {
  const out: In[] = [];
  for await (const item of gen) {
    out.push(item);
  }
  return out;
}
