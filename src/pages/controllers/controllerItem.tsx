// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FC } from 'react';
import { Tag } from '@subql/react-ui';

import { asyncRender } from 'components/asyncRender';
import { Button, Text } from 'components/primary';
import { useBalance } from 'hooks/indexerHook';

import { AccountContainer, Balance, Buttons, ItemContainer, Status } from './styles';
import { Controller } from './types';

type Props = {
  index: number;
} & Controller;

const ControllerItem: FC<Props> = ({ id, index, address }) => {
  const balance = useBalance(address);
  return (
    <ItemContainer>
      <AccountContainer>
        <Text>{`Account ${index + 1}`}</Text>
        <Text mt={5}>{address}</Text>
      </AccountContainer>
      <Balance>{asyncRender(!!balance, <Text>{`${balance} ACA`}</Text>)}</Balance>
      <Status>
        <Tag text="Configured" state="success" />
      </Status>
      <Buttons>
        <Button title="Configure" onClick={() => console.log('')} />
        <Button ml={10} title="Remove" onClick={() => console.log('')} />
      </Buttons>
    </ItemContainer>
  );
};

export default ControllerItem;
