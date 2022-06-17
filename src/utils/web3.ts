// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubqueryNetwork } from '@subql/contract-sdk';
import { intToHex } from 'ethereumjs-util';

export enum ChainID {
  local = 1281,
  hardhat = 31337,
  testnet = 595,
  mainnet = 1285,
}

export enum Networks {
  local = 'local',
  hardhat = 'hardhat',
  testnet = 'testnet',
  mainnet = 'mainnet',
}

export const ChainIDs = [ChainID.local, ChainID.hardhat, ChainID.testnet, ChainID.mainnet];

export const NetworkToChainID: Record<SubqueryNetwork, ChainID> = {
  local: ChainID.local,
  hardhat: ChainID.hardhat,
  testnet: ChainID.testnet,
  mainnet: ChainID.mainnet,
};

export const isSupportNetwork = (chaiId?: number) => ChainIDs.includes(chaiId ?? 0);

export const RPC_URLS: Record<number, string> = {
  595: 'https://tc7-eth.aca-dev.network',
  1281: 'http://127.0.0.1:9933',
  1285: 'https://moonriver.api.onfinality.io/public',
  1287: 'https://moonbeam-alpha.api.onfinality.io/public',
  31337: 'http://127.0.0.1:8545',
};

export const networks: Record<number, SubqueryNetwork> = {
  1281: Networks.local,
  595: Networks.testnet,
  1285: Networks.mainnet,
  31337: Networks.hardhat,
};

export const chainNames: Record<number, string> = {
  595: 'SQN Testnet',
  1281: 'Moonbeam Local',
  1285: 'Moonriver',
  1287: 'Moonbeam Dev',
  31337: 'Hardhat Local'
};

export const NETWORK_CONFIGS = {
  [ChainID.testnet]: {
    chainId: intToHex(ChainID.testnet),
    chainName: 'Acala Testnet',
    nativeCurrency: {
      name: 'Acala',
      symbol: 'Acala',
      decimals: 18,
    },
    rpcUrls: [RPC_URLS[ChainID.testnet]],
    blockExplorerUrls: null,
  },
  1287: {
    chainId: intToHex(1287),
    chainName: 'Moonbase Alpha',
    nativeCurrency: {
      name: 'ACALA',
      symbol: 'ACALA',
      decimals: 18,
    },
    rpcUrls: [RPC_URLS[1287]],
    blockExplorerUrls: ['https://moonbase-blockscout.testnet.moonbeam.network/'],
  },
};
