// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';
import { browserName } from 'react-device-detect';

import Icon from 'components/Icon';
import { Button, Label, Text } from 'components/primary';
import { useCoordinatorIndexer } from 'containers/coordinatorIndexer';
import { useIsMetaMask, useIsMetaMaskInstalled, useWeb3 } from 'hooks/web3Hook';
import ArrowIcon from 'resources/arrow.svg';
import MetaMaskIcon from 'resources/metamask.svg';
import { connectWithMetaMask, NetworkError, switchNetwork } from 'utils/metamask';

import { extensionInstallUrls } from './config';
import prompts from './prompts';
import { Container, ContentContainer, MetaMaskContainer } from './styles';

const MetaMaskView = () => {
  const { account, activate, error } = useWeb3();
  const { indexer } = useCoordinatorIndexer();
  const isMetaMask = useIsMetaMask();
  const isMetaMaskInstalled = useIsMetaMaskInstalled();

  const [isNetworkError, setNetworkError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setNetworkError(error?.name === NetworkError.unSupportedNetworkError);
  }, [error]);

  const data = useMemo(() => {
    const { install, connect, invalidNetwork, invalidAccount } = prompts(indexer);
    if (!isMetaMaskInstalled) return install;
    if (isNetworkError) return invalidNetwork;
    if (!isMetaMask) return connect;
    return invalidAccount;
  }, [isNetworkError, isMetaMaskInstalled, isMetaMask, account, indexer]);

  const onButtonClick = useCallback(async () => {
    if (isNetworkError) {
      await switchNetwork();
      return;
    }
    if (!isMetaMaskInstalled) {
      // @ts-ignore
      const url = extensionInstallUrls[browserName] ?? '';
      url && window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!isMetaMask) {
      const result = await connectWithMetaMask(activate);
      setErrorMsg(result);
    }
  }, [isMetaMask, isNetworkError, isMetaMaskInstalled]);

  const metaMaskItem = useMemo(
    () => (
      <MetaMaskContainer>
        <div>
          <ContentContainer>
            <Icon size={50} src={MetaMaskIcon} />
            <Label ml={20} size={25}>
              MetaMask
            </Label>
          </ContentContainer>
          <Text mt={10}>{data.buttonTitle}</Text>
        </div>
        <Icon size={30} src={ArrowIcon} />
      </MetaMaskContainer>
    ),
    [data]
  );

  return (
    <Container>
      <Label alignCenter size={35} fw="400">
        {data.title}
      </Label>
      <Text alignCenter mt={15}>
        {data.desc}
      </Text>
      <Text color="red" alignCenter mt={15}>
        {errorMsg}
      </Text>
      <Button mt={50} type="secondary" title="" onClick={onButtonClick} leftItem={metaMaskItem} />
    </Container>
  );
};

export default MetaMaskView;
