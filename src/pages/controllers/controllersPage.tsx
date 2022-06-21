// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';

import ModalView from 'components/modalView';
import { Button, Text } from 'components/primary';
import { useNotification } from 'containers/notificationContext';
import { useController } from 'hooks/indexerHook';
import { useAccountAction } from 'hooks/transactionHook';
import {
  ADD_CONTROLLER,
  GET_CONTROLLERS,
  REMOVE_CONTROLLER,
  WITHDRAW_CONTROLLER,
} from 'utils/queries';

import {
  createConfigControllerSteps,
  createRemoveAccountSteps,
  createWithdrawSteps,
  withdrawControllerFailed,
  withdrawControllerSucceed,
} from './config';
import ControllerItem from './controllerItem';
import { Container, ContentContainer, HeaderContainer } from './styles';
import { Controller, ControllerAction } from './types';

const controllersPage = () => {
  const [actionType, setActionType] = useState<ControllerAction>();
  const [account, setAccount] = useState<Controller>();
  const [visible, setVisible] = useState(false);

  const { dispatchNotification } = useNotification();
  const accountAction = useAccountAction();
  const { controller: currentController } = useController();

  const [removeController] = useMutation(REMOVE_CONTROLLER);
  const [addController, { loading: addingController }] = useMutation(ADD_CONTROLLER);
  const [withdrawController, { data, loading }] = useLazyQuery(WITHDRAW_CONTROLLER, {
    fetchPolicy: 'network-only',
  });
  const [getControllers, { data: controllers }] = useLazyQuery<{ controllers: Controller[] }>(
    GET_CONTROLLERS,
    { fetchPolicy: 'network-only' }
  );

  useEffect(() => {
    getControllers();
  }, []);

  const addControllerAction = async () => {
    await addController();
    await getControllers();
  };

  const onButtonPress = (type: ControllerAction) => (a: Controller) => {
    setAccount(a);
    setActionType(type);
    setVisible(true);
  };

  const onModalClose = () => setVisible(false);

  const removeAccountSteps = createRemoveAccountSteps(async () => {
    await removeController({ variables: { id: account?.id } });
    await getControllers();
    onModalClose();
  });

  const withdrawSteps = createWithdrawSteps(async () => {
    const res = await withdrawController();
    onModalClose();

    if (res.data.withdrawController) {
      dispatchNotification(withdrawControllerSucceed(account?.address));
    } else {
      dispatchNotification(withdrawControllerFailed(account?.address));
    }
  });

  const configControllerSteps = createConfigControllerSteps(() =>
    accountAction(
      ControllerAction.configController,
      account?.address ?? '',
      onModalClose,
      getControllers
    )
  );

  const steps = { ...configControllerSteps, ...withdrawSteps, ...removeAccountSteps };

  // TODO: 1. show empty view with empty controllers

  return (
    <Container>
      <HeaderContainer>
        <ContentContainer>
          <Text size={30} fw="bold" mr={20}>
            Manage Controller Account
          </Text>
          <Text color="gray" mt={5}>
            Create and manange your controller accounts here
          </Text>
          <Text color="gray">
            You can Configure the account you wish to set as the controller on the coordinator
            services
          </Text>
        </ContentContainer>
        <Button
          title="Create Account"
          type="primary"
          loading={addingController}
          onClick={addControllerAction}
        />
      </HeaderContainer>
      <ContentContainer mt={50}>
        {!!controllers &&
          controllers.controllers.map((item, index) => (
            <ControllerItem
              key={item.id}
              controller="0xf610a648f386336609fb9f4a987fa49794b0fa21"
              name={`Account ${index + 1}`}
              onConfigController={onButtonPress(ControllerAction.configController)}
              onRemoveController={onButtonPress(ControllerAction.removeAccount)}
              onWithdraw={onButtonPress(ControllerAction.withdraw)}
              {...item}
            />
          ))}
      </ContentContainer>
      {actionType && (
        <ModalView
          visible={visible}
          title={ControllerAction[actionType]}
          onClose={onModalClose}
          steps={steps[actionType]}
          type={actionType}
        />
      )}
    </Container>
  );
};

export default controllersPage;
