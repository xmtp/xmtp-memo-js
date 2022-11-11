/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "xmtp.memo";

export interface PayloadV1 {
  fromAddr: string;
  toAddr: string;
  encodedContent: string;
  timestamp: number;
}

export interface MemoV1 {
  encodedPayload: Uint8Array;
  signature: Uint8Array;
}

export interface Signature {
  signature: Uint8Array;
  signatureType: number;
}

export interface EncryptedMemoV1 {
  encryptedString: Uint8Array;
  encryptedSymmetricKey: Uint8Array;
  accessControlConditions: Uint8Array;
}

function createBasePayloadV1(): PayloadV1 {
  return { fromAddr: "", toAddr: "", encodedContent: "", timestamp: 0 };
}

export const PayloadV1 = {
  encode(message: PayloadV1, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fromAddr !== "") {
      writer.uint32(10).string(message.fromAddr);
    }
    if (message.toAddr !== "") {
      writer.uint32(18).string(message.toAddr);
    }
    if (message.encodedContent !== "") {
      writer.uint32(26).string(message.encodedContent);
    }
    if (message.timestamp !== 0) {
      writer.uint32(32).uint64(message.timestamp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PayloadV1 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePayloadV1();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fromAddr = reader.string();
          break;
        case 2:
          message.toAddr = reader.string();
          break;
        case 3:
          message.encodedContent = reader.string();
          break;
        case 4:
          message.timestamp = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PayloadV1 {
    return {
      fromAddr: isSet(object.fromAddr) ? String(object.fromAddr) : "",
      toAddr: isSet(object.toAddr) ? String(object.toAddr) : "",
      encodedContent: isSet(object.encodedContent) ? String(object.encodedContent) : "",
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
    };
  },

  toJSON(message: PayloadV1): unknown {
    const obj: any = {};
    message.fromAddr !== undefined && (obj.fromAddr = message.fromAddr);
    message.toAddr !== undefined && (obj.toAddr = message.toAddr);
    message.encodedContent !== undefined && (obj.encodedContent = message.encodedContent);
    message.timestamp !== undefined && (obj.timestamp = Math.round(message.timestamp));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PayloadV1>, I>>(object: I): PayloadV1 {
    const message = createBasePayloadV1();
    message.fromAddr = object.fromAddr ?? "";
    message.toAddr = object.toAddr ?? "";
    message.encodedContent = object.encodedContent ?? "";
    message.timestamp = object.timestamp ?? 0;
    return message;
  },
};

function createBaseMemoV1(): MemoV1 {
  return { encodedPayload: new Uint8Array(), signature: new Uint8Array() };
}

export const MemoV1 = {
  encode(message: MemoV1, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encodedPayload.length !== 0) {
      writer.uint32(10).bytes(message.encodedPayload);
    }
    if (message.signature.length !== 0) {
      writer.uint32(18).bytes(message.signature);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MemoV1 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMemoV1();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.encodedPayload = reader.bytes();
          break;
        case 2:
          message.signature = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MemoV1 {
    return {
      encodedPayload: isSet(object.encodedPayload) ? bytesFromBase64(object.encodedPayload) : new Uint8Array(),
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
    };
  },

  toJSON(message: MemoV1): unknown {
    const obj: any = {};
    message.encodedPayload !== undefined &&
      (obj.encodedPayload = base64FromBytes(
        message.encodedPayload !== undefined ? message.encodedPayload : new Uint8Array(),
      ));
    message.signature !== undefined &&
      (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MemoV1>, I>>(object: I): MemoV1 {
    const message = createBaseMemoV1();
    message.encodedPayload = object.encodedPayload ?? new Uint8Array();
    message.signature = object.signature ?? new Uint8Array();
    return message;
  },
};

function createBaseSignature(): Signature {
  return { signature: new Uint8Array(), signatureType: 0 };
}

export const Signature = {
  encode(message: Signature, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.signature.length !== 0) {
      writer.uint32(10).bytes(message.signature);
    }
    if (message.signatureType !== 0) {
      writer.uint32(16).uint32(message.signatureType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Signature {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSignature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signature = reader.bytes();
          break;
        case 2:
          message.signatureType = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Signature {
    return {
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
      signatureType: isSet(object.signatureType) ? Number(object.signatureType) : 0,
    };
  },

  toJSON(message: Signature): unknown {
    const obj: any = {};
    message.signature !== undefined &&
      (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
    message.signatureType !== undefined && (obj.signatureType = Math.round(message.signatureType));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Signature>, I>>(object: I): Signature {
    const message = createBaseSignature();
    message.signature = object.signature ?? new Uint8Array();
    message.signatureType = object.signatureType ?? 0;
    return message;
  },
};

function createBaseEncryptedMemoV1(): EncryptedMemoV1 {
  return {
    encryptedString: new Uint8Array(),
    encryptedSymmetricKey: new Uint8Array(),
    accessControlConditions: new Uint8Array(),
  };
}

export const EncryptedMemoV1 = {
  encode(message: EncryptedMemoV1, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encryptedString.length !== 0) {
      writer.uint32(10).bytes(message.encryptedString);
    }
    if (message.encryptedSymmetricKey.length !== 0) {
      writer.uint32(18).bytes(message.encryptedSymmetricKey);
    }
    if (message.accessControlConditions.length !== 0) {
      writer.uint32(26).bytes(message.accessControlConditions);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncryptedMemoV1 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedMemoV1();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.encryptedString = reader.bytes();
          break;
        case 2:
          message.encryptedSymmetricKey = reader.bytes();
          break;
        case 3:
          message.accessControlConditions = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncryptedMemoV1 {
    return {
      encryptedString: isSet(object.encryptedString) ? bytesFromBase64(object.encryptedString) : new Uint8Array(),
      encryptedSymmetricKey: isSet(object.encryptedSymmetricKey)
        ? bytesFromBase64(object.encryptedSymmetricKey)
        : new Uint8Array(),
      accessControlConditions: isSet(object.accessControlConditions)
        ? bytesFromBase64(object.accessControlConditions)
        : new Uint8Array(),
    };
  },

  toJSON(message: EncryptedMemoV1): unknown {
    const obj: any = {};
    message.encryptedString !== undefined &&
      (obj.encryptedString = base64FromBytes(
        message.encryptedString !== undefined ? message.encryptedString : new Uint8Array(),
      ));
    message.encryptedSymmetricKey !== undefined &&
      (obj.encryptedSymmetricKey = base64FromBytes(
        message.encryptedSymmetricKey !== undefined ? message.encryptedSymmetricKey : new Uint8Array(),
      ));
    message.accessControlConditions !== undefined &&
      (obj.accessControlConditions = base64FromBytes(
        message.accessControlConditions !== undefined ? message.accessControlConditions : new Uint8Array(),
      ));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncryptedMemoV1>, I>>(object: I): EncryptedMemoV1 {
    const message = createBaseEncryptedMemoV1();
    message.encryptedString = object.encryptedString ?? new Uint8Array();
    message.encryptedSymmetricKey = object.encryptedSymmetricKey ?? new Uint8Array();
    message.accessControlConditions = object.accessControlConditions ?? new Uint8Array();
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
