// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Notification } from 'containers/notificationContext';
import { AccountAction, ClickAction, FormSubmit } from 'pages/project-details/types';
import { initialMetadataValues, MetadataFormKey, MetadataFormSchema } from 'types/schemas';
import { dismiss } from 'utils/notification';

import { IndexerMetadata } from './types';

const buttonTitles = {
  [AccountAction.unregister]: 'Unregister',
  [AccountAction.updateMetaData]: 'Update Metadata',
  [AccountAction.configController]: 'Manage Controllers',
};

export const createButonItem = (
  actionType: AccountAction,
  onClick: (type: AccountAction) => void
) => {
  return {
    title: buttonTitles[actionType],
    type: actionType,
    onClick,
  };
};

export const AccountActionName = {
  [AccountAction.updateMetaData]: 'Update Indexer Metadata',
  [AccountAction.unregister]: 'Unregister Indexer Account',
  [AccountAction.configController]: 'Config Controller Account',
};

export const createConfigControllerSteps = (
  controller: string,
  onCreateController: ClickAction,
  onSendTxConfigController: ClickAction
) => ({
  [AccountAction.configController]: [
    {
      index: 0,
      title: 'Create new controller account',
      desc: 'Press the button to generate a new controller account inside the coordinator service, after update the controller account need to make sure it has enough balance for sending transaciotns. Note that withdraw the current controller first before update to the new controller account.',
      buttonTitle: 'Create Account',
      onClick: onCreateController,
    },
    {
      index: 1,
      title: 'Update your controller on contract',
      desc: `Press the button to send the transaction to network and update the new controller account: ${controller} on contract. The transaction processing time may take around 10s, it depends on the network status and gas fee. You will see the processing status on the top of the page once you confim the transaction on the MetaMask.`,
      buttonTitle: 'Send Transction',
      onClick: onSendTxConfigController,
    },
  ],
});

// export const createWithdrawSteps = (withdraw: ClickAction) => ({
//   [AccountAction.withdrawController]: [
//     {
//       index: 0,
//       title: 'Controller Withdraw',
//       desc: `Withdraw all the assets from controller account will transfer all the asset of the controller to indexer account.`,
//       buttonTitle: 'Withdraw',
//       onClick: withdraw,
//     },
//   ],
// });

export const createUnregisterSteps = (onUnregister: ClickAction) => ({
  [AccountAction.unregister]: [
    {
      index: 0,
      title: 'Unregister from network',
      desc: `Sorry to see the indexer unregister from the Subquery Network, please note that all the data in your coordinator service will be removed, and the staking token will deposit to your current account once transction processed`,
      buttonTitle: 'Unregister',
      onClick: onUnregister,
    },
  ],
});

export const createUpdateMetadataSteps = (onUpdate: FormSubmit, metadata?: IndexerMetadata) => ({
  [AccountAction.updateMetaData]: [
    {
      index: 0,
      title: 'Update Indexer Metadata',
      desc: `Input valid indexer name and proxy server endpoint to update the metadata, make sure the proxy endpoint is valid`,
      buttonTitle: 'Update Metadata',
      form: {
        formValues: initialMetadataValues(metadata),
        schema: MetadataFormSchema,
        onFormSubmit: onUpdate,
        items: [
          {
            formKey: MetadataFormKey.name,
            title: 'Indexer Name',
          },
          {
            formKey: MetadataFormKey.proxyEndpoint,
            title: 'Proxy Server Endpoint',
          },
        ],
      },
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
