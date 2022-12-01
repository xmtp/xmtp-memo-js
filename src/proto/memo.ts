/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "xmtp.memo";

export interface PayloadV1 {
  fromAddr: string;
  toAddr: string;
  encodedContent: Uint8Array;
  timestamp: number;
}

export interface Payload {
  v1?: PayloadV1 | undefined;
}

export interface MemoV1 {
  encodedPayload: Uint8Array;
  signature: Uint8Array;
}

export interface MemoSignature {
  signature: Uint8Array;
  signatureType: number;
  signingKey: Uint8Array;
}

export interface EncryptedMemoV1 {
  encryptedString: Uint8Array;
  encryptedSymmetricKey: Uint8Array;
  accTemplate: Uint8Array;
}

export interface EncryptedMemoV2 {
  v: string;
  encryptedString: Uint8Array;
  encryptedSymmetricKey: Uint8Array;
  accTemplate: Uint8Array;
}

export interface EncryptedMemo {
  v1?: EncryptedMemoV1 | undefined;
  v2?: EncryptedMemoV2 | undefined;
}

function createBasePayloadV1(): PayloadV1 {
  return { fromAddr: "", toAddr: "", encodedContent: new Uint8Array(), timestamp: 0 };
}

export const PayloadV1 = {
  encode(message: PayloadV1, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fromAddr !== "") {
      writer.uint32(10).string(message.fromAddr);
    }
    if (message.toAddr !== "") {
      writer.uint32(18).string(message.toAddr);
    }
    if (message.encodedContent.length !== 0) {
      writer.uint32(26).bytes(message.encodedContent);
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
          message.encodedContent = reader.bytes();
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
      encodedContent: isSet(object.encodedContent) ? bytesFromBase64(object.encodedContent) : new Uint8Array(),
      timestamp: isSet(object.timestamp) ? Number(object.timestamp) : 0,
    };
  },

  toJSON(message: PayloadV1): unknown {
    const obj: any = {};
    message.fromAddr !== undefined && (obj.fromAddr = message.fromAddr);
    message.toAddr !== undefined && (obj.toAddr = message.toAddr);
    message.encodedContent !== undefined &&
      (obj.encodedContent = base64FromBytes(
        message.encodedContent !== undefined ? message.encodedContent : new Uint8Array(),
      ));
    message.timestamp !== undefined && (obj.timestamp = Math.round(message.timestamp));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PayloadV1>, I>>(object: I): PayloadV1 {
    const message = createBasePayloadV1();
    message.fromAddr = object.fromAddr ?? "";
    message.toAddr = object.toAddr ?? "";
    message.encodedContent = object.encodedContent ?? new Uint8Array();
    message.timestamp = object.timestamp ?? 0;
    return message;
  },
};

function createBasePayload(): Payload {
  return { v1: undefined };
}

export const Payload = {
  encode(message: Payload, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.v1 !== undefined) {
      PayloadV1.encode(message.v1, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Payload {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePayload();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.v1 = PayloadV1.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Payload {
    return { v1: isSet(object.v1) ? PayloadV1.fromJSON(object.v1) : undefined };
  },

  toJSON(message: Payload): unknown {
    const obj: any = {};
    message.v1 !== undefined && (obj.v1 = message.v1 ? PayloadV1.toJSON(message.v1) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Payload>, I>>(object: I): Payload {
    const message = createBasePayload();
    message.v1 = (object.v1 !== undefined && object.v1 !== null) ? PayloadV1.fromPartial(object.v1) : undefined;
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

function createBaseMemoSignature(): MemoSignature {
  return { signature: new Uint8Array(), signatureType: 0, signingKey: new Uint8Array() };
}

export const MemoSignature = {
  encode(message: MemoSignature, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.signature.length !== 0) {
      writer.uint32(10).bytes(message.signature);
    }
    if (message.signatureType !== 0) {
      writer.uint32(16).uint32(message.signatureType);
    }
    if (message.signingKey.length !== 0) {
      writer.uint32(26).bytes(message.signingKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MemoSignature {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMemoSignature();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signature = reader.bytes();
          break;
        case 2:
          message.signatureType = reader.uint32();
          break;
        case 3:
          message.signingKey = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MemoSignature {
    return {
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(),
      signatureType: isSet(object.signatureType) ? Number(object.signatureType) : 0,
      signingKey: isSet(object.signingKey) ? bytesFromBase64(object.signingKey) : new Uint8Array(),
    };
  },

  toJSON(message: MemoSignature): unknown {
    const obj: any = {};
    message.signature !== undefined &&
      (obj.signature = base64FromBytes(message.signature !== undefined ? message.signature : new Uint8Array()));
    message.signatureType !== undefined && (obj.signatureType = Math.round(message.signatureType));
    message.signingKey !== undefined &&
      (obj.signingKey = base64FromBytes(message.signingKey !== undefined ? message.signingKey : new Uint8Array()));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MemoSignature>, I>>(object: I): MemoSignature {
    const message = createBaseMemoSignature();
    message.signature = object.signature ?? new Uint8Array();
    message.signatureType = object.signatureType ?? 0;
    message.signingKey = object.signingKey ?? new Uint8Array();
    return message;
  },
};

function createBaseEncryptedMemoV1(): EncryptedMemoV1 {
  return { encryptedString: new Uint8Array(), encryptedSymmetricKey: new Uint8Array(), accTemplate: new Uint8Array() };
}

export const EncryptedMemoV1 = {
  encode(message: EncryptedMemoV1, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encryptedString.length !== 0) {
      writer.uint32(10).bytes(message.encryptedString);
    }
    if (message.encryptedSymmetricKey.length !== 0) {
      writer.uint32(18).bytes(message.encryptedSymmetricKey);
    }
    if (message.accTemplate.length !== 0) {
      writer.uint32(26).bytes(message.accTemplate);
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
          message.accTemplate = reader.bytes();
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
      accTemplate: isSet(object.accTemplate) ? bytesFromBase64(object.accTemplate) : new Uint8Array(),
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
    message.accTemplate !== undefined &&
      (obj.accTemplate = base64FromBytes(message.accTemplate !== undefined ? message.accTemplate : new Uint8Array()));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncryptedMemoV1>, I>>(object: I): EncryptedMemoV1 {
    const message = createBaseEncryptedMemoV1();
    message.encryptedString = object.encryptedString ?? new Uint8Array();
    message.encryptedSymmetricKey = object.encryptedSymmetricKey ?? new Uint8Array();
    message.accTemplate = object.accTemplate ?? new Uint8Array();
    return message;
  },
};

function createBaseEncryptedMemoV2(): EncryptedMemoV2 {
  return {
    v: "",
    encryptedString: new Uint8Array(),
    encryptedSymmetricKey: new Uint8Array(),
    accTemplate: new Uint8Array(),
  };
}

export const EncryptedMemoV2 = {
  encode(message: EncryptedMemoV2, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.v !== "") {
      writer.uint32(10).string(message.v);
    }
    if (message.encryptedString.length !== 0) {
      writer.uint32(18).bytes(message.encryptedString);
    }
    if (message.encryptedSymmetricKey.length !== 0) {
      writer.uint32(26).bytes(message.encryptedSymmetricKey);
    }
    if (message.accTemplate.length !== 0) {
      writer.uint32(34).bytes(message.accTemplate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncryptedMemoV2 {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedMemoV2();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.v = reader.string();
          break;
        case 2:
          message.encryptedString = reader.bytes();
          break;
        case 3:
          message.encryptedSymmetricKey = reader.bytes();
          break;
        case 4:
          message.accTemplate = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncryptedMemoV2 {
    return {
      v: isSet(object.v) ? String(object.v) : "",
      encryptedString: isSet(object.encryptedString) ? bytesFromBase64(object.encryptedString) : new Uint8Array(),
      encryptedSymmetricKey: isSet(object.encryptedSymmetricKey)
        ? bytesFromBase64(object.encryptedSymmetricKey)
        : new Uint8Array(),
      accTemplate: isSet(object.accTemplate) ? bytesFromBase64(object.accTemplate) : new Uint8Array(),
    };
  },

  toJSON(message: EncryptedMemoV2): unknown {
    const obj: any = {};
    message.v !== undefined && (obj.v = message.v);
    message.encryptedString !== undefined &&
      (obj.encryptedString = base64FromBytes(
        message.encryptedString !== undefined ? message.encryptedString : new Uint8Array(),
      ));
    message.encryptedSymmetricKey !== undefined &&
      (obj.encryptedSymmetricKey = base64FromBytes(
        message.encryptedSymmetricKey !== undefined ? message.encryptedSymmetricKey : new Uint8Array(),
      ));
    message.accTemplate !== undefined &&
      (obj.accTemplate = base64FromBytes(message.accTemplate !== undefined ? message.accTemplate : new Uint8Array()));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncryptedMemoV2>, I>>(object: I): EncryptedMemoV2 {
    const message = createBaseEncryptedMemoV2();
    message.v = object.v ?? "";
    message.encryptedString = object.encryptedString ?? new Uint8Array();
    message.encryptedSymmetricKey = object.encryptedSymmetricKey ?? new Uint8Array();
    message.accTemplate = object.accTemplate ?? new Uint8Array();
    return message;
  },
};

function createBaseEncryptedMemo(): EncryptedMemo {
  return { v1: undefined, v2: undefined };
}

export const EncryptedMemo = {
  encode(message: EncryptedMemo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.v1 !== undefined) {
      EncryptedMemoV1.encode(message.v1, writer.uint32(10).fork()).ldelim();
    }
    if (message.v2 !== undefined) {
      EncryptedMemoV2.encode(message.v2, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncryptedMemo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedMemo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.v1 = EncryptedMemoV1.decode(reader, reader.uint32());
          break;
        case 2:
          message.v2 = EncryptedMemoV2.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncryptedMemo {
    return {
      v1: isSet(object.v1) ? EncryptedMemoV1.fromJSON(object.v1) : undefined,
      v2: isSet(object.v2) ? EncryptedMemoV2.fromJSON(object.v2) : undefined,
    };
  },

  toJSON(message: EncryptedMemo): unknown {
    const obj: any = {};
    message.v1 !== undefined && (obj.v1 = message.v1 ? EncryptedMemoV1.toJSON(message.v1) : undefined);
    message.v2 !== undefined && (obj.v2 = message.v2 ? EncryptedMemoV2.toJSON(message.v2) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncryptedMemo>, I>>(object: I): EncryptedMemo {
    const message = createBaseEncryptedMemo();
    message.v1 = (object.v1 !== undefined && object.v1 !== null) ? EncryptedMemoV1.fromPartial(object.v1) : undefined;
    message.v2 = (object.v2 !== undefined && object.v2 !== null) ? EncryptedMemoV2.fromPartial(object.v2) : undefined;
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
