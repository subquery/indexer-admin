// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Notification } from 'containers/notificationContext';
import { ClickAction } from 'pages/project-details/types';
import { dismiss } from 'utils/notification';

import { ControllerAction } from './types';

export const ControllerActionName = {
  [ControllerAction.configController]: 'Config Controller Account',
  [ControllerAction.removeAccount]: 'Remove Account',
  [ControllerAction.withdraw]: 'Withdraw Assets',
};

export const createConfigControllerSteps = (onSendTxConfigController: ClickAction) => ({
  [ControllerAction.configController]: [
    {
      index: 0,
      title: 'Update your controller on contract',
      desc: `Press the button to send the transaction to network and update the new controller account on contract. The transaction processing time may take around 10s, it depends on the network status and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.`,
      buttonTitle: 'Send Transction',
      onClick: onSendTxConfigController,
    },
  ],
});

export const createRemoveAccountSteps = (removeAccount: ClickAction) => ({
  [ControllerAction.removeAccount]: [
    {
      index: 0,
      title: 'Remove Account',
      desc: 'The Account will be removed from coordinator service. Account can not be recove after remove.',
      buttonTitle: 'Confirm',
      onClick: removeAccount,
    },
  ],
});

export const createWithdrawSteps = (withdraw: ClickAction) => ({
  [ControllerAction.withdraw]: [
    {
      index: 0,
      title: 'Controller Withdraw',
      desc: `Withdraw all the assets from controller account will transfer all the asset of the controller to indexer account.`,
      buttonTitle: 'Confirm',
      onClick: withdraw,
    },
  ],
});

// notifications
export const withdrawControllerSucceed = (controller: string | undefined): Notification => ({
  type: 'success',
  title: 'Controller withdrawl Succeed',
  message: `Withdraw controller: ${controller} assets successfully`,
  dismiss: dismiss(),
});

export const withdrawControllerFailed = (controller: string | undefined): Notification => ({
  type: 'danger',
  title: 'Controller withdrawl Failed',
  message: `Withdraw controller: ${controller} assets failed`,
  dismiss: dismiss(),
});
