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
  name: string;
  controller: string | undefined;
  onRemoveController: (id: string) => void;
  onWithdraw: (id: string) => void;
} & Controller;

const ControllerItem: FC<Props> = ({
  id,
  name,
  controller,
  address,
  onRemoveController,
  onWithdraw,
}) => {
  // FIXME: comparing with controller account
  // const isActive = address === controller;
  const isActived = address === '0xf610a648f386336609fb9f4a987fa49794b0fa21';
  const balance = useBalance(address);
  const emptyBalance = Number(balance) === 0;

  return (
    <ItemContainer>
      <AccountContainer>
        <Text>{name}</Text>
        <Text mt={5}>{address}</Text>
      </AccountContainer>
      <Balance>{asyncRender(!!balance, <Text>{`${balance} ACA`}</Text>)}</Balance>
      <Status>{isActived && <Tag text="Actived" state="success" />}</Status>
      <Buttons>
        {!isActived && <Button title="Configure" onClick={() => console.log('')} />}
        {emptyBalance ? (
          <Button ml={10} title="Remove" onClick={() => onRemoveController(id)} />
        ) : (
          <Button ml={10} title="Withdraw" onClick={() => onWithdraw(id)} />
        )}
      </Buttons>
    </ItemContainer>
  );
};

export default ControllerItem;
