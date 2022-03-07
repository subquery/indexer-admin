// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { utils } from 'ethers';
import { create } from 'ipfs-http-client';

export const IPFS = create({ url: window.env.IPFS_GATEWAY });

export function cidToBytes32(cid: string): string {
  return `0x${Buffer.from(utils.base58.decode(cid)).slice(2).toString('hex')}`;
}

export function bytes32ToCid(bytes: string): string {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = `1220${bytes.slice(2)}`;
  const hashBytes = Buffer.from(hashHex, 'hex');
  return utils.base58.encode(hashBytes);
}

export function concatU8A(a: Uint8Array, b: Uint8Array): Uint8Array {
  const res = new Uint8Array(a.length + b.length);
  res.set(a, 0);
  res.set(b, a.length);
  return res;
}

export async function createIndexerMetadata(name: string, url: string): Promise<string> {
  const result = await IPFS.add(JSON.stringify({ name, url }), { pin: true });
  const cid = result.cid.toV0().toString();
  return cidToBytes32(cid);
}
