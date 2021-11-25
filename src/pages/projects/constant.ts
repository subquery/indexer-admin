// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum IndexingStatus {
  INDEXING,
  READY,
  TERMINATED,
  NOTSTART,
}

export const statusColor = {
  [IndexingStatus.NOTSTART]: '#E4E4E4',
  [IndexingStatus.INDEXING]: 'rgba(67, 136, 221, 0.24)',
  [IndexingStatus.READY]: 'rgba(70, 219, 103, 0.4)',
  [IndexingStatus.TERMINATED]: 'rgba(214, 48, 48, 0.3)',
};

export const statusText = {
  [IndexingStatus.NOTSTART]: 'Not Started',
  [IndexingStatus.INDEXING]: 'Indexing',
  [IndexingStatus.READY]: 'Ready',
  [IndexingStatus.TERMINATED]: 'Stop',
};