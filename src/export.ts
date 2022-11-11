import { messageApi } from "@xmtp/proto";
import { Client } from "@xmtp/xmtp-js";
import { ListMessagesPaginatedOptions } from "@xmtp/xmtp-js/dist/types/src/Client";

export type EnvelopeMapper<Out> = (env: messageApi.Envelope) => Promise<Out>;
export type Mapper<In, Out> = (val: In) => Promise<Out>;

export async function* mapStream<In, Out>(
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

export async function* flattenStream<In>(gen: AsyncGenerator<In[]>) {
  for await (const page of gen) {
    for (const item of page) {
      yield item;
    }
  }
}

export async function gatherStream<In>(gen: AsyncIterable<In>): Promise<In[]> {
  const out: In[] = [];
  for await (const item of gen) {
    out.push(item);
  }
  return out;
}

export async function* mapPaginatedStream<Out>(
  gen: AsyncGenerator<messageApi.Envelope[]>,
  mapper: EnvelopeMapper<Out>
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
