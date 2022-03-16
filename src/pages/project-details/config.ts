// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { initialIndexingValues, ProjectFormKey, StartIndexingSchema } from 'types/schemas';
import { ClickAction, FormSubmit, ProjectActionType } from 'utils/transactions';

import prompts from './prompts';

export enum ProjectStatus {
  NotIndexing,
  Started,
  Indexing,
  Ready,
  Terminated,
}

export type TransactionType =
  | ProjectActionType.AnnounceIndexing
  | ProjectActionType.AnnounceReady
  | ProjectActionType.AnnounceNotIndexing;

type ButtonItem = {
  title: string;
  action: () => void;
  color?: string;
};

const createButtonItem = (title: string, action: () => void, color?: string): ButtonItem => ({
  title,
  action,
  color,
});

export const createServiceItem = (type: string, url: string, version: string, status: string) => ({
  url,
  imageVersion: `onfinality/subql-${type}:${version}`,
  status,
});

export const createButtonItems = (onButtonClick: (type: ProjectActionType) => void) => ({
  [ProjectStatus.NotIndexing]: [
    createButtonItem('Start Indexing', () => onButtonClick(ProjectActionType.StartIndexing)),
  ],
  [ProjectStatus.Started]: [
    createButtonItem('Announce Indexing', () => onButtonClick(ProjectActionType.AnnounceIndexing)),
    createButtonItem('Stop Project', () => onButtonClick(ProjectActionType.StopProject)),
  ],
  [ProjectStatus.Indexing]: [
    createButtonItem('Retart Indexing', () => onButtonClick(ProjectActionType.RestartProject)),
    createButtonItem('Publish to Ready', () => onButtonClick(ProjectActionType.AnnounceReady)),
    createButtonItem('Stop Indexing', () => onButtonClick(ProjectActionType.StopIndexing)),
  ],
  [ProjectStatus.Ready]: [
    createButtonItem('Retart Indexing', () => onButtonClick(ProjectActionType.RestartProject)),
    createButtonItem('Stop Indexing', () => onButtonClick(ProjectActionType.StopIndexing)),
  ],
  [ProjectStatus.Terminated]: [
    createButtonItem('Announce Not Indexing', () =>
      onButtonClick(ProjectActionType.AnnounceNotIndexing)
    ),
  ],
});

export const modalTitles = {
  [ProjectActionType.StartIndexing]: 'Start Indexing Project',
  [ProjectActionType.RestartProject]: 'Restart Indexing Project',
  [ProjectActionType.AnnounceIndexing]: 'Announce Indexing Project',
  [ProjectActionType.AnnounceReady]: 'Publish Indexing to Ready',
  [ProjectActionType.StopProject]: 'Stop Project',
  [ProjectActionType.AnnounceNotIndexing]: 'Announce Not Indexing Project',
  [ProjectActionType.StopIndexing]: 'Stop Indexing',
};

// type ActionStep = Record<ProjectActionType, StepItem[]>;

export const createStartIndexingSteps = (
  onStartProject: FormSubmit,
  onSendTransaction: ClickAction
) => ({
  [ProjectActionType.StartIndexing]: [
    {
      index: 0,
      title: prompts.startProject.title,
      desc: prompts.startProject.desc,
      buttonTitle: 'Indexing Project',
      form: {
        formValues: initialIndexingValues,
        schema: StartIndexingSchema,
        onFormSubmit: onStartProject,
        items: [
          {
            formKey: ProjectFormKey.networkEndpoint,
            title: 'Indexing Network Endpiont',
            placeholder: 'wss://polkadot.api.onfinality.io/public-ws',
          },
        ],
      },
      onClick: onStartProject,
    },
    {
      index: 1,
      title: prompts.announceIndexing.title,
      desc: prompts.announceIndexing.desc,
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createRestartProjectSteps = (onStartProject: FormSubmit) => ({
  [ProjectActionType.RestartProject]: [
    {
      index: 0,
      title: prompts.restartProject.title,
      desc: prompts.restartProject.desc,
      buttonTitle: 'Restart Project',
      form: {
        formValues: initialIndexingValues,
        schema: StartIndexingSchema,
        onFormSubmit: onStartProject,
        items: [
          {
            formKey: ProjectFormKey.networkEndpoint,
            title: 'Indexing Network Endpiont',
            placeholder: 'wss://polkadot.api.onfinality.io/public-ws',
          },
        ],
      },
      onClick: onStartProject,
    },
  ],
});

export const createAnnounceIndexingSteps = (onSendTransaction: ClickAction) => ({
  [ProjectActionType.AnnounceIndexing]: [
    {
      index: 0,
      title: prompts.announceIndexing.title,
      desc: prompts.announceIndexing.desc,
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createReadyIndexingSteps = (onSendTransaction: ClickAction) => ({
  [ProjectActionType.AnnounceReady]: [
    {
      index: 0,
      title: prompts.announceReady.title,
      desc: prompts.announceReady.desc,
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createNotIndexingSteps = (onSendTransaction: ClickAction) => ({
  [ProjectActionType.AnnounceNotIndexing]: [
    {
      index: 0,
      title: prompts.announceNotIndexing.title,
      desc: prompts.announceNotIndexing.desc,
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});

export const createStopProjectSteps = (onStopProject: ClickAction) => ({
  [ProjectActionType.StopProject]: [
    {
      index: 0,
      title: prompts.stopProject.title,
      desc: prompts.stopProject.desc,
      buttonTitle: 'Stop Project',
      onClick: onStopProject,
    },
  ],
});

export const createStopIndexingSteps = (
  onStopProject: ClickAction,
  onSendTransaction: ClickAction
) => ({
  [ProjectActionType.StopIndexing]: [
    {
      index: 0,
      title: prompts.stopProject.title,
      desc: prompts.stopProject.desc,
      buttonTitle: 'Stop Indexing',
      onClick: onStopProject,
    },
    {
      index: 1,
      title: prompts.announceNotIndexing.title,
      desc: prompts.announceNotIndexing.desc,
      buttonTitle: 'Send Transction',
      onClick: onSendTransaction,
    },
  ],
});
