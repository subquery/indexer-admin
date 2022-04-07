// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo } from 'react';
import { isUndefined } from 'lodash';

import Avatar from 'components/avatar';
import { Separator, Text } from 'components/primary';
import { TagItem } from 'components/tagItem';
import { useLoading } from 'containers/loadingContext';
import { useIndexerMetadata } from 'hooks/indexerHook';
import { useIndexerEra } from 'hooks/network';
import { useWeb3 } from 'hooks/web3Hook';

import NetworkTabbarView from './components/networkTabBarView';
import { ContentContainer, Contrainer, LeftContainer, VersionContainer } from './styles';

const NetworkPage = () => {
  const { account } = useWeb3();
  const { metadata } = useIndexerMetadata();
  const { setPageLoading } = useLoading();
  const indexerEra = useIndexerEra();

  useEffect(() => {
    setPageLoading(isUndefined(indexerEra));
  }, [indexerEra]);

  const eraItems = useMemo(
    () => (
      <VersionContainer>
        <TagItem versionType="CURRENT ERA" prefix="#" value={indexerEra?.currentEra} />
        <Separator height={50} />
        <TagItem versionType="LAST CLAIM ERA" prefix="#" value={indexerEra?.lastClaimedEra} />
        <Separator height={50} />
        <TagItem versionType="LAST SETTLE ERA" prefix="#" value={indexerEra?.lastSettledEra} />
      </VersionContainer>
    ),
    [indexerEra]
  );

  return (
    <Contrainer>
      <LeftContainer>
        <Avatar address={account ?? ''} size={100} />
        <ContentContainer>
          <Text fw="600" size={30}>
            {metadata?.name}
          </Text>
          <Text fw="400" size={15}>
            {account}
          </Text>
          {eraItems}
        </ContentContainer>
      </LeftContainer>
      <NetworkTabbarView />
    </Contrainer>
  );
};

export default NetworkPage;
