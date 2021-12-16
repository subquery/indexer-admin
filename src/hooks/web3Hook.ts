// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { JsonRpcSigner } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { providers } from 'ethers';

export function useIsMetaMaskInstalled(): boolean {
  // @ts-ignore
  const { ethereum } = window;
  const [isMetaMask, setIsMetaMask] = useState(false);

  useEffect(() => {
    setIsMetaMask(!!ethereum && ethereum.isMetaMask);
  }, [ethereum]);

  return isMetaMask;
}

export const useWeb3 = (): Web3ReactContextInterface<providers.Web3Provider> => useWeb3React();

export function useWeb3Provider(): providers.Web3Provider | undefined {
  const { library } = useWeb3();
  return library;
}

export type Signer = JsonRpcSigner | undefined;

export function useSigner(): Signer {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const { active, account, library } = useWeb3();

  useEffect(() => {
    setSigner(library?.getSigner());
  }, [active, account]);

  return signer;
}

export function useIsMetaMask(): boolean | undefined {
  const [isMetaMask, setIsMetaMask] = useState<boolean>();
  const { active, library } = useWeb3();

  useEffect(() => {
    setIsMetaMask(!!library?.provider?.isMetaMask);
  }, [active, library?.provider.isMetaMask]);

  return isMetaMask;
}
