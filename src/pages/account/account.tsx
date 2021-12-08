// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { isValidPrivate, toBuffer, privateToAddress, bufferToHex } from 'ethereumjs-util';
import {
  useBalance,
  useController,
  useIsController,
  useIsControllerChanged,
  useIsIndexer,
  useIsIndexerChanged,
} from '../../hooks/indexerHook';
import { useIsMetaMask, useSigner, useWeb3 } from '../../hooks/web3Hook';
import { Container } from './styles';
import prompts from './prompts';
import AccountCard from '../../components/accountCard';
import MetaMaskView from '../login/metamaskView';
import { ActionType } from '../../utils/transactions';
import ModalView from '../../components/modalView';
import { createControllerSteps, createUnregisterSteps, modalTitles } from './config';
import { UPDAET_CONTROLLER, REMOVE_ACCOUNTS } from '../../utils/queries';
import { configController, unRegister } from '../../utils/indexerActions';
import { useContractSDK } from '../../containers/contractSdk';
import { ControllerFormKey } from '../../types/schemas';

const Registry = () => {
  const [visible, setVisible] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());
  const [currentStep, setCurrentStep] = useState(0);
  const [inputController, setController] = useState('');
  const [actionType, setActionType] = useState<ActionType | undefined>(undefined);

  const { account } = useWeb3();
  const signer = useSigner();
  const sdk = useContractSDK();
  const history = useHistory();
  const isMetaMask = useIsMetaMask();
  const isIndexer = useIsIndexer();
  const isController = useIsController(account);
  const controller = useController(account, timestamp);
  const controllerBalance = useBalance(controller);
  const indexerBalance = useBalance(account);
  const [updateController, { loading: updateControllerLoading }] = useMutation(UPDAET_CONTROLLER);
  const [removeAccounts, { loading: removeAccountsLoading }] = useMutation(REMOVE_ACCOUNTS);
  const { request: checkIsIndexerChanged, loading: indexerLoading } = useIsIndexerChanged();
  const { request: checkIsControllerChanged, loading: controllerLoading } =
    useIsControllerChanged(account);
  const loading =
    updateControllerLoading || removeAccountsLoading || indexerLoading || controllerLoading;

  prompts.controller.desc = `Balance ${controllerBalance} SQT`;
  const controllerItem = !controller ? prompts.emptyController : prompts.controller;
  const indexerItem = prompts.indexer;

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
      const privateKey = values[ControllerFormKey.privateKey];
      // TODO: move this to helper function
      if (!privateKey || !privateKey.startsWith('0x') || !isValidPrivate(toBuffer(privateKey))) {
        formHelper.setErrors({ [ControllerFormKey.privateKey]: 'Invalid private key format' });
        return;
      }

      const controllerAddress = bufferToHex(privateToAddress(toBuffer(privateKey)));
      const isExist = await sdk?.indexerRegistry.isController(controllerAddress);
      if (isExist) {
        formHelper.setErrors({
          [ControllerFormKey.privateKey]: 'Controller already been used',
        });
        return;
      }

      setController(controllerAddress);
      updateController({ variables: { controller: privateKey } })
        .then(() => setCurrentStep(1))
        .catch(onModalClose);
    },
    () => {
      configController(sdk, signer, inputController)
        .then(() => {
          checkIsControllerChanged(inputController, () => {
            setTimestamp(Date.now());
            onModalClose();
          }).catch((e) => console.log('error:', e));
        })
        .catch(onModalClose);
    }
  );

  const unregisterStepConfig = createUnregisterSteps(
    () => {
      removeAccounts().then(() => setCurrentStep(1));
    },
    () => {
      unRegister(sdk, signer)
        .then(() => {
          checkIsIndexerChanged(false, () => {
            onModalClose();
            history.replace('./');
          }).catch((e) => console.log('error:', e));
        })
        .catch(onModalClose);
    }
  );

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
          loading={indexerLoading}
          onClick={onModalShow}
        />
      )}
      {(isIndexer || isController) && (
        <AccountCard
          title={controllerItem.title}
          name={controllerItem.name}
          type={ActionType.configCntroller}
          account={controller}
          buttonTitle={isIndexer ? controllerItem.buttonTitle : ''}
          desc={controllerItem?.desc}
          onClick={onModalShow}
        />
      )}
      <MetaMaskView />
      <ModalView
        visible={visible}
        // @ts-ignore
        title={actionType ? modalTitles[actionType] : ''}
        onClose={onModalClose}
        // @ts-ignore
        steps={actionType ? steps[actionType] : []}
        currentStep={currentStep}
        type={actionType}
        loading={loading}
      />
    </Container>
  );
};

export default Registry;
