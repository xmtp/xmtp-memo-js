import * as crypto from "crypto";

// export async function generateSymmetricKey() {
//   const symmKey = await crypto.subtle.generateKey(
//     {
//       name: "AES-CBC",
//       length: 256,
//     },
//     true,
//     ["encrypt", "decrypt"]
//   );

//   return symmKey;
// }

// export async function encryptWithSymmetricKey(
//   symmKey: CryptoKey,
//   data: Uint8Array
// ): Promise<ArrayBuffer> {
//   // encrypt the zip with symmetric key
//   const iv = crypto.getRandomValues(new Uint8Array(16));

//   const encryptedZipData = await crypto.subtle.encrypt(
//     {
//       name: "AES-CBC",
//       iv,
//     },
//     symmKey,
//     data
//   );

//   return encryptedZipData;
// }

// export async function encryptBytesWithSymmetricKey(bytes: Uint8Array) {
//   const symmKey = await generateSymmetricKey();
//   const encryptedBytes = await encryptWithSymmetricKey(symmKey, bytes);

//   const exportedSymmKey = new Uint8Array(
//     await crypto.subtle.exportKey("raw", symmKey)
//   );

//   return {
//     symmetricKey: exportedSymmKey,
//     encryptedBytes,
//     encryptedData: encryptedBytes,
//   };
// }
