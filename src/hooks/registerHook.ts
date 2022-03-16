// Copyright 2020-2022 SubQuery Pte Ltd authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useState } from 'react';
import { isUndefined } from 'lodash';

import { useContractSDK } from 'containers/contractSdk';
import { useWeb3 } from 'hooks/web3Hook';
import { RegisterStep } from 'pages/register/types';

export const useIsApproved = () => {
  const [isApprove, setIsApprove] = useState<boolean>();
  const { account } = useWeb3();
  const sdk = useContractSDK();

  const checkAllowance = useCallback(async () => {
    if (!account || !sdk) return;
    try {
      const mimAmount = (await sdk.indexerRegistry.minimumStakingAmont()) ?? 0;
      const amount = await sdk.sqToken.allowance(account, sdk.staking.address);
      setIsApprove(!!amount?.gte(mimAmount));
      // setIsApprove(false);
    } catch {
      setIsApprove(false);
    }
  }, [sdk, account]);

  useEffect(() => {
    checkAllowance();
  }, [checkAllowance]);

  return isApprove;
};

export const useInitialStep = (): RegisterStep | undefined => {
  const isApproved = useIsApproved();

  return useMemo(() => {
    if (isUndefined(isApproved)) return undefined;
    if (isApproved) return RegisterStep.register;
    return RegisterStep.onboarding;
  }, [isApproved]);
};
