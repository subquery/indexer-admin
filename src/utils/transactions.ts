// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ContractTransaction } from 'ethers';
import { FormikHelpers, FormikValues } from 'formik';

import { ToastContext, ToastProps } from 'containers/toastContext';

// TODO: reorganise these types
export enum ActionType {
  unregister = 'unregister',
  configCntroller = 'configCntroller',
  addProject = 'addProject',
}

export enum ProjectActionType {
  StartIndexing = 'StartIndexing',
  AnnounceIndexing = 'AnnounceIndexing',
  RestartProject = 'RestartProject',
  AnnounceReady = 'AnnounceReady',
  StopProject = 'StopProject',
  AnnounceNotIndexing = 'AnnounceNotIndexing',
  StopIndexing = 'StopIndexing',
}

export type ModalActionType = ActionType | ProjectActionType;

export type ClickAction = (type?: ModalActionType) => void;
export type FormSubmit = (values: FormikValues, helper: FormikHelpers<FormikValues>) => void;

export function txLoadingToast(txHash: string): ToastProps {
  return { type: 'loading', text: `Processing transaction: ${txHash}` };
}

export function txSuccessToast(txHash: string): ToastProps {
  return { type: 'success', text: `Transaction completed: ${txHash}` };
}

export function txErrorToast(message: string): ToastProps {
  return { type: 'error', text: `Transaction failed: ${message}` };
}

export async function handleTransaction(
  tx: ContractTransaction,
  toastContext: ToastContext,
  onSuccess?: () => void,
  onError?: () => void
) {
  const { dispatchToast, closeToast } = toastContext;
  dispatchToast(txLoadingToast(tx.hash));

  const receipt = await tx.wait(1);
  if (!receipt.status) {
    onError && onError();
    dispatchToast(txErrorToast(tx.hash));
  } else {
    onSuccess && onSuccess();
    dispatchToast(txSuccessToast(tx.hash));
  }

  setTimeout(() => closeToast(), 2000);
}
