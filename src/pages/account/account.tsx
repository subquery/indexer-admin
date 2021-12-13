// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { bufferToHex, privateToAddress, toBuffer } from 'ethereumjs-util';
import { isUndefined } from 'lodash';

import AccountCard from 'components/accountCard';
import ModalView from 'components/modalView';
import { useContractSDK } from 'containers/contractSdk';
import { useLoading } from 'containers/loadingContext';
import { useToast } from 'containers/toastContext';
import {
  useBalance,
  useController,
  useIsController,
  useIsControllerChanged,
  useIsIndexer,
  useIsIndexerChanged,
} from 'hooks/indexerHook';
import { useIsMetaMask, useSigner, useWeb3 } from 'hooks/web3Hook';
import { ControllerFormKey } from 'types/schemas';
import { configController, unRegister } from 'utils/indexerActions';
import { REMOVE_ACCOUNTS, UPDAET_CONTROLLER } from 'utils/queries';
import { ActionType } from 'utils/transactions';
import { validatePrivateKey } from 'utils/validateService';

import MetaMaskView from '../metamask/metamaskView';
import { createControllerSteps, createUnregisterSteps, modalTitles } from './config';
import prompts from './prompts';
import { Container } from './styles';

const Registry = () => {
  const [visible, setVisible] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [currentStep, setCurrentStep] = useState(0);
  const [inputController, setController] = useState('');
  const [actionType, setActionType] = useState<ActionType>();

  const { account } = useWeb3();
  const signer = useSigner();
  const sdk = useContractSDK();
  const history = useHistory();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const isController = useIsController(account);
  const controller = useController(timestamp);
  const controllerBalance = useBalance(controller);
  const indexerBalance = useBalance(account);
  const { setPageLoading } = useLoading();
  const { dispatchToast, closeToast } = useToast();
  const [updateController, { loading: updateControllerLoading }] = useMutation(UPDAET_CONTROLLER);
  const [removeAccounts, { loading: removeAccountsLoading }] = useMutation(REMOVE_ACCOUNTS);
  const { request: checkIsIndexerChanged, loading: indexerLoading } = useIsIndexerChanged();
  const { request: checkIsControllerChanged, loading: controllerLoading } =
    useIsControllerChanged(account);

  const loadingActions = useMemo(
    () => ({
      [ActionType.unregister]: indexerLoading,
      [ActionType.configCntroller]: controllerLoading,
    }),
    [indexerLoading, controllerLoading]
  );

  prompts.controller.desc = `Balance ${controllerBalance} SQT`;
  const controllerItem = !controller ? prompts.emptyController : prompts.controller;
  const indexerItem = prompts.indexer;

  useEffect(() => {
    setPageLoading(isUndefined(isIndexer));
    if (!isUndefined(isIndexer) && !isIndexer) {
      history.replace('/');
    }
  }, [isIndexer]);

  useEffect(() => {
    if (indexerLoading || controllerLoading) {
      dispatchToast({
        type: 'loading',
        text: 'Transaction processing: 0xskfakf34faskdfjaksdjfakdfjaksfjakfa',
      });
    } else {
      closeToast();
    }
  }, [indexerLoading, controllerLoading]);

  const onModalShow = (type: ActionType) => {
    setActionType(type);
    setVisible(true);
  };

  const onModalClose = (error?: Error) => {
    console.log('>>>action error:', error);
    setVisible(false);
    setCurrentStep(0);
  };

  const controllerStepsConfig = createControllerSteps(
    async (values, formHelper) => {
      formHelper.setStatus({ loading: true });
      const privateKey = values[ControllerFormKey.privateKey];
      const error = validatePrivateKey(privateKey);
      if (error) {
        formHelper.setStatus({ loading: false });
        formHelper.setErrors({ [ControllerFormKey.privateKey]: error });
        return;
      }

      const controllerAddress = bufferToHex(privateToAddress(toBuffer(privateKey)));
      const isExist = await sdk?.indexerRegistry.isController(controllerAddress);
      if (isExist) {
        formHelper.setStatus({ loading: false });
        formHelper.setErrors({
          [ControllerFormKey.privateKey]: 'Controller already been used',
        });
        return;
      }

      setController(controllerAddress);
      try {
        await updateController({ variables: { controller: privateKey } });
        setCurrentStep(1);
      } catch {
        onModalClose();
      }
      formHelper.setStatus({ loading: false });
    },
    () => {
      configController(sdk, signer, inputController)
        .then(() => {
          onModalClose();
          checkIsControllerChanged(inputController, () => {
            setTimestamp(Date.now());
          }).catch((e) => console.log('error:', e));
        })
        .catch(onModalClose);
    }
  );

  const unregisterStepConfig = createUnregisterSteps(async () => {
    try {
      await unRegister(sdk, signer);
      onModalClose();
      checkIsIndexerChanged(false, () => {
        onModalClose();
        history.replace('./');
      });
      await removeAccounts();
    } catch (e) {
      onModalClose();
    }
  });

  const steps = { ...controllerStepsConfig, ...unregisterStepConfig };

  return (
    <Container>
      {isMetaMask && isIndexer && (
        <AccountCard
          title={indexerItem.title}
          name={indexerItem.name}
          buttonTitle={indexerItem.buttonTitle}
          type={ActionType.unregister}
          account={account ?? ''}
          status="active"
          desc={`Balance: ${indexerBalance} SQT`}
          disabled={indexerLoading}
          onClick={onModalShow}
        />
      )}
      {(isIndexer || isController) && (
        <AccountCard
          title={controllerItem.title}
          name={controllerItem.name}
          type={ActionType.configCntroller}
          account={controller}
          disabled={controllerLoading}
          buttonTitle={isIndexer ? controllerItem.buttonTitle : ''}
          desc={controllerItem?.desc}
          onClick={onModalShow}
        />
      )}
      <MetaMaskView />
      {actionType && (
        <ModalView
          visible={visible}
          // @ts-ignore
          title={modalTitles[actionType]}
          onClose={onModalClose}
          // @ts-ignore
          steps={steps[actionType]}
          currentStep={currentStep}
          type={actionType}
          // @ts-ignore
          loading={loadingActions[actionType]}
        />
      )}
    </Container>
  );
};

export default Registry;
