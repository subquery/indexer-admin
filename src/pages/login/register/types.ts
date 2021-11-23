// Copyright 2020-2021 OnFinality Limited authors & contributors
// SPDX-License-Identifier: Apache-2.0

export enum RegisterStep {
  onboarding = 'onboarding',
  authorisation = 'authorisation',
  register = 'register',
  sync = 'sync',
}

export enum StepStatus {
  wait = 'wait',
  process = 'process',
  finish = 'finish',
}
